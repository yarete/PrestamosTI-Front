import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { createPortal } from 'react-dom';
import * as pdfjsLib from 'pdfjs-dist';
import {
  X,
  Type,
  SquareFill,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
} from 'react-bootstrap-icons';
import { Button } from '../ui/Button';
import { type ITemplate } from '../../types/template.types';

// The worker URL is already set in pdfUtils.ts or we can set it here:
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface TemplateEditorWindowProps {
  isOpen: boolean;
  template: ITemplate | null;
  onClose: () => void;
  mode?: 'view' | 'edit';
  onSaveTemplate: (template: ITemplate, modifiedPdfBlob: Blob) => void;
}

export type AnnotationType = 'text' | 'whiteout';

export interface Annotation {
  id: string;
  page: number;
  type: AnnotationType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  fontSize?: number;
}

export const TemplateEditorWindow: React.FC<TemplateEditorWindowProps> = ({
  isOpen,
  template,
  onClose,
  mode = 'edit',
  onSaveTemplate,
}) => {
  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isRendered, setIsRendered] = useState(false);
  
  // Annotations state
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);

  // Store canvas refs for each page
  const canvasRefs = useRef<{ [pageIndex: number]: HTMLCanvasElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [pageDimensions, setPageDimensions] = useState<{ [page: number]: { width: number; height: number } }>({});

  useEffect(() => {
    if (!isOpen || !template || !template.fileUrl) {
      setPdfDocument(null);
      setNumPages(0);
      setIsRendered(false);
      setAnnotations([]);
      setZoom(1);
      setPageDimensions({});
      return;
    }

    const loadPdf = async () => {
      try {
        const response = await fetch(template.fileUrl!);
        const arrayBuffer = await response.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setPdfDocument(pdf);
        setNumPages(pdf.numPages);
      } catch (err) {
        console.error('Failed to load PDF for editing:', err);
      }
    };

    loadPdf();
  }, [isOpen, template]);

  // Render pages (Only run when document or numPages changes, not on zoom)
  useEffect(() => {
    if (!pdfDocument || numPages === 0) return;

    const renderPages = async () => {
      setIsRendered(false);
      const dimensions: { [page: number]: { width: number; height: number } } = {};
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Static high-res scale
        const canvas = canvasRefs.current[i];
        
        dimensions[i] = { width: viewport.width, height: viewport.height };
        
        if (canvas) {
          const context = canvas.getContext('2d');
          if (!context) continue;
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          // White background
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          await page.render({
            canvasContext: context,
            viewport,
          } as any).promise;
        }
      }
      setPageDimensions(dimensions);
      setIsRendered(true);
    };

    renderPages();
  }, [pdfDocument, numPages]);

  // ── Handlers ──

  const addAnnotation = (type: AnnotationType) => {
    let targetPage = activePage;
    
    // Auto-detect the most visible page based on scroll position
    if (scrollContainerRef.current) {
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;
      
      let closestPage = 1;
      let minDistance = Infinity;
      
      for (let i = 1; i <= numPages; i++) {
        const pageEl = document.getElementById(`pdf-page-${i}`);
        if (pageEl) {
          const rect = pageEl.getBoundingClientRect();
          const pageCenterY = rect.top + rect.height / 2;
          const distance = Math.abs(pageCenterY - centerY);
          if (distance < minDistance) {
            minDistance = distance;
            closestPage = i;
          }
        }
      }
      targetPage = closestPage;
      setActivePage(closestPage);
    }

    const newAnn: Annotation = {
      id: `ann-${Date.now()}`,
      page: targetPage,
      type,
      // Place it near the top of the visible area of the target page, or just static offset
      x: 50,
      y: 50,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 50 : 30,
      text: type === 'text' ? 'Nuevo texto...' : undefined,
      fontSize: 14,
    };
    setAnnotations((prev) => [...prev, newAnn]);
    setSelectedAnnotationId(newAnn.id);
  };

  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const removeAnnotation = (id: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, x: -9999, y: -9999, width: 0, height: 0 } : a)).filter(a => a.id !== id));
    if (selectedAnnotationId === id) setSelectedAnnotationId(null);
  };

  const serializePdf = async (): Promise<Blob | null> => {
    if (!template?.fileUrl) return null;
    try {
      const { PDFDocument, rgb } = await import('pdf-lib');
      const response = await fetch(template.fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const ann of annotations) {
        const page = pages[ann.page - 1]; // 0-indexed in pdf-lib
        if (!page || !pdfDocument) continue;
        
        // Calculate EXACT proportion of the annotation relative to the UI container
        const pdfJsPage = await pdfDocument.getPage(ann.page);
        const viewport = pdfJsPage.getViewport({ scale: 1.5 });
        
        const xRatio = ann.x / viewport.width;
        const yRatio = ann.y / viewport.height;
        const wRatio = ann.width / viewport.width;
        const hRatio = ann.height / viewport.height;

        const cropBox = page.getCropBox();
        // Handle rotation swaps if the PDF is rotated 90 or 270 degrees
        const isRotated = viewport.rotation === 90 || viewport.rotation === 270;
        const actualPdfWidth = isRotated ? cropBox.height : cropBox.width;
        const actualPdfHeight = isRotated ? cropBox.width : cropBox.height;

        const pdfX = cropBox.x + (xRatio * actualPdfWidth);
        const pdfW = wRatio * actualPdfWidth;
        const pdfH = hRatio * actualPdfHeight;
        
        // PDF Y origin is bottom-left, UI is top-left
        const pdfY = cropBox.y + actualPdfHeight - (yRatio * actualPdfHeight) - pdfH;

        if (ann.type === 'whiteout') {
          page.drawRectangle({
            x: pdfX,
            y: pdfY,
            width: pdfW,
            height: pdfH,
            color: rgb(1, 1, 1),
          });
        } else if (ann.type === 'text' && ann.text) {
          // Font size proportion
          const fontSizeRatio = (ann.fontSize || 14) / viewport.height;
          const pdfFontSize = fontSizeRatio * actualPdfHeight;
          
          const lines = ann.text.split('\n');
          let currentY = pdfY + pdfH - pdfFontSize - 2;
          
          for (const line of lines) {
             page.drawText(line, {
               x: pdfX + 2,
               y: currentY,
               size: pdfFontSize,
               color: rgb(0, 0, 0),
             });
             currentY -= (pdfFontSize * 1.2);
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      // pdfBytes is a Uint8Array, we can pass it to Blob directly or use its buffer
      return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    } catch (err) {
      console.error('Error serializing PDF:', err);
      return null;
    }
  };

  const handleSave = async () => {
    const blob = await serializePdf();
    if (blob && template) {
      onSaveTemplate(template, blob);
    }
  };

  const handleDownload = async () => {
    const blob = await serializePdf();
    if (blob && template) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Sanitize filename
      const safeName = template.title.replace(/[^a-zA-Z0-9_\-áéíóúÁÉÍÓÚñÑ]/g, '_');
      a.download = `${safeName}_modificado.pdf`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  };

  if (!isOpen || !template) return null;

  const content = (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-gray-900/40 pointer-events-auto" onClick={onClose} />
      
      <Rnd
        default={{
          x: window.innerWidth * 0.1,
          y: window.innerHeight * 0.05,
          width: window.innerWidth * 0.8,
          height: window.innerHeight * 0.9,
        }}
        minWidth={700}
        minHeight={500}
        bounds="window"
        dragHandleClassName="drag-handle"
        className="pointer-events-auto shadow-2xl rounded-xl z-50"
        onMouseDown={() => setSelectedAnnotationId(null)}
      >
        {/* INNER WRAPPER TO GUARANTEE FLEXBOX LAYOUT */}
        <div className="w-full h-full flex flex-col bg-white overflow-hidden rounded-xl border border-gray-200/60 shadow-inner">
          
          {/* ── Title Bar ── */}
          <div className="drag-handle bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-5 py-3 flex items-center justify-between cursor-move shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button className="w-3.5 h-3.5 rounded-full bg-red-400 hover:bg-red-500 transition-colors shadow-sm" onClick={onClose} aria-label="Cerrar" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm" />
              </div>
              <h2 className="text-sm font-bold tracking-tight text-gray-800 select-none">
                Editando: <span className="font-medium text-gray-600">{template.title}</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
              <button
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                title="Alejar"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-gray-600 font-bold select-none w-12 text-center">
                {(zoom * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                title="Acercar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div className="bg-white border-b border-gray-100 px-5 py-2.5 flex items-center gap-3 shrink-0 select-none shadow-sm z-10">
            {mode === 'edit' && (
              <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                <button 
                  onClick={() => addAnnotation('text')}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg hover:bg-blue-50 text-sm font-semibold text-gray-700 hover:text-[#0a2a5e] transition-all shadow-sm border border-transparent hover:border-blue-100"
                >
                  <Type className="w-4 h-4" />
                  Añadir Texto
                </button>
                <button 
                  onClick={() => addAnnotation('whiteout')}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg hover:bg-blue-50 text-sm font-semibold text-gray-700 hover:text-[#0a2a5e] transition-all shadow-sm border border-transparent hover:border-blue-100"
                >
                  <SquareFill className="w-4 h-4 text-white border-2 border-gray-400 rounded-sm" />
                  Cinta Correctora
                </button>
              </div>
            )}
            
            <div className="flex-1 flex justify-center items-center">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-full shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Página
                </span>
                <span className="text-sm font-bold text-[#0a2a5e]">
                  {activePage} <span className="text-gray-400">/</span> {numPages}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <Button variant="outline" className="text-sm h-9 px-4 rounded-lg shadow-sm" icon={Download} onClick={handleDownload}>
                Descargar Copia
              </Button>
              {mode === 'edit' && (
                <Button variant="primary" className="text-sm h-9 px-4 rounded-lg shadow-sm" icon={Save} onClick={handleSave}>
                  Guardar
                </Button>
              )}
            </div>
          </div>

          {/* ── PDF Canvas Area ── */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 min-h-0 w-full bg-[#f3f4f6] overflow-y-auto overflow-x-hidden p-8 flex flex-col items-center gap-8 relative"
            onScroll={() => {
              // Update active page on scroll naturally
              if (!scrollContainerRef.current) return;
              const containerRect = scrollContainerRef.current.getBoundingClientRect();
              const centerY = containerRect.top + containerRect.height / 2;
              let closest = 1;
              let minD = Infinity;
              for (let i = 1; i <= numPages; i++) {
                const el = document.getElementById(`pdf-page-${i}`);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  const dist = Math.abs(rect.top + rect.height / 2 - centerY);
                  if (dist < minD) {
                    minD = dist;
                    closest = i;
                  }
                }
              }
              if (activePage !== closest) setActivePage(closest);
            }}
          >
          {!isRendered && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50 font-medium">
              Cargando documento...
            </div>
          )}
          
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
            const dims = pageDimensions[pageNum];
            const scaledWidth = dims ? dims.width * (zoom / 1.5) : 600;
            const scaledHeight = dims ? dims.height * (zoom / 1.5) : 800;

            return (
              <div
                key={pageNum}
                id={`pdf-page-${pageNum}`}
                className="relative bg-white shadow-xl select-none shrink-0"
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                }}
                onMouseEnter={() => setActivePage(pageNum)}
              >
                {/* 
                  Inner container has the exact unscaled dimensions of the canvas.
                  We apply the transform to it, which scales it down/up to match the parent wrapper exactly.
                  This ensures 1:1 aspect ratio and no squashing.
                */}
                <div 
                  className="origin-top-left absolute top-0 left-0"
                  style={{ 
                    width: dims ? `${dims.width}px` : 'auto',
                    height: dims ? `${dims.height}px` : 'auto',
                    transform: `scale(${zoom / 1.5})` 
                  }}
                >
                  <canvas
                    ref={(el) => { canvasRefs.current[pageNum] = el; }}
                    className="block"
                    style={{
                      width: dims ? `${dims.width}px` : 'auto',
                      height: dims ? `${dims.height}px` : 'auto',
                    }}
                  />
                  
                  {/* Annotations Overlay - Inside the unscaled container, so no manual math needed! */}
                  {annotations
                    .filter((a) => a.page === pageNum)
                    .map((ann) => (
                      <Rnd
                        key={ann.id}
                        bounds="parent"
                        scale={zoom / 1.5}
                        position={{ x: ann.x, y: ann.y }}
                        size={{ width: ann.width, height: ann.height }}
                        onDragStop={(_e, d) => {
                          updateAnnotation(ann.id, { x: d.x, y: d.y })
                        }}
                        onResizeStop={(_e, _direction, ref, _delta, position) => {
                          updateAnnotation(ann.id, {
                            width: parseInt(ref.style.width, 10),
                            height: parseInt(ref.style.height, 10),
                            x: position.x,
                            y: position.y,
                          });
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setSelectedAnnotationId(ann.id);
                        }}
                        className={`absolute ${
                          selectedAnnotationId === ann.id
                            ? 'outline outline-2 outline-blue-500 z-20'
                            : 'hover:outline hover:outline-2 hover:outline-gray-300 z-10'
                        } ${ann.type === 'whiteout' ? 'bg-white' : ''}`}
                      >
                      {/* Delete button when selected */}
                      {selectedAnnotationId === ann.id && (
                        <button
                          className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 cursor-pointer pointer-events-auto"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            removeAnnotation(ann.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {/* Content */}
                      {ann.type === 'text' && (
                        <textarea
                          value={ann.text}
                          onChange={(e) => updateAnnotation(ann.id, { text: e.target.value })}
                          style={{ fontSize: `${ann.fontSize}px` }}
                          className="w-full h-full bg-transparent border-none resize-none focus:outline-none p-1 text-black font-sans leading-tight overflow-hidden"
                          placeholder="Escribe aquí..."
                        />
                      )}
                    </Rnd>
                  ))}
              </div>
            </div>
            );
          })}
        </div>
        </div>
      </Rnd>
    </div>
  );

  return createPortal(content, document.body);
};
