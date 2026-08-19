import React, { useState, useMemo } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { TemplateCard } from '../components/domain/TemplateCard';
import { CreateTemplateModal } from '../components/domain/CreateTemplateModal';
import { DeleteTemplateModal } from '../components/domain/DeleteTemplateModal';
import { TemplateEditorWindow } from '../components/domain/TemplateEditorWindow';
import { type ITemplate, type ICreateTemplatePayload } from '../types/template.types';
import { useToast } from '../contexts/ToastContext';
import { TemplatesEmptyState, NoSearchResults } from '../components/domain/TemplatesEmptyState';

interface TemplatesPageProps {
  onViewChange: (v: string) => void;
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const PREVIEW_URL = '/template_preview.jpg';

// Start with no mock data so the empty state is shown by default
const MOCK_TEMPLATES: ITemplate[] = [];

const PAGE_SIZE = 8;
// ──────────────────────────────────────────────────────────────────────────────

/** Triggers a real browser file download via a temporary anchor element. */
function triggerDownload(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onViewChange }) => {
  const [templates, setTemplates] = useState<ITemplate[]>(MOCK_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  // ── Modal states ─────────────────────────────────────────────────────────────
  /** null = closed, undefined = create mode, ITemplate = edit mode */
  const [editingTemplate, setEditingTemplate] = useState<ITemplate | null | undefined>(undefined);
  const isCreateModalOpen = editingTemplate !== undefined;

  /** null = closed */
  const [deletingTemplate, setDeletingTemplate] = useState<ITemplate | null>(null);

  /** null = closed */
  const [viewerTemplate, setViewerTemplate] = useState<ITemplate | null>(null);
  const [viewerMode, setViewerMode] = useState<'view' | 'edit'>('view');

  // ── Derived state ─────────────────────────────────────────────────────────────
  const filteredTemplates = useMemo(
    () =>
      templates.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [templates, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / PAGE_SIZE));

  const paginatedTemplates = useMemo(
    () =>
      filteredTemplates.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [filteredTemplates, currentPage],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────────

  /** Create new template from the form payload */
  const handleSaveTemplate = async (payload: ICreateTemplatePayload) => {
    const isEdit = editingTemplate != null;

    const blobUrl = payload.file
      ? URL.createObjectURL(payload.file)
      : (editingTemplate?.fileUrl ?? undefined);

    let newPreviewUrl = editingTemplate?.previewImageUrl ?? PREVIEW_URL;
    if (payload.file) {
      try {
        const { generatePdfThumbnail } = await import('../utils/pdfUtils');
        newPreviewUrl = await generatePdfThumbnail(payload.file);
      } catch (err) {
        console.error('Failed to generate PDF thumbnail, using default', err);
      }
    }

    if (isEdit && editingTemplate) {
      // Update existing template in-place
      const updated: ITemplate = {
        ...editingTemplate,
        title: payload.templateName,
        description: payload.description,
        previewImageUrl: newPreviewUrl,
        fileUrl: blobUrl,
        file: payload.file ?? editingTemplate.file,
      };
      setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      // Add new template at the top
      const newTemplate: ITemplate = {
        id: `template-${Date.now()}`,
        title: payload.templateName,
        description: payload.description,
        createdAt: new Date(),
        previewImageUrl: newPreviewUrl,
        fileUrl: blobUrl,
        file: payload.file ?? undefined,
      };
      setTemplates((prev) => [newTemplate, ...prev]);
      setCurrentPage(1);
    }
  };

  /** Open viewer in preview tab (read-only) */
  const handlePreview = (template: ITemplate) => {
    setViewerMode('view');
    setViewerTemplate(template);
  };

  /** Open viewer in edit mode (Personalizar) */
  const handlePersonalize = (template: ITemplate) => {
    setViewerMode('edit');
    setViewerTemplate(template);
  };

  /** Open create modal pre-filled with existing template data */
  const handleEdit = (template: ITemplate) => {
    setEditingTemplate(template);
  };

  /** First step: mark template for deletion → shows confirmation modal */
  const handleDeleteRequest = (template: ITemplate) => {
    setDeletingTemplate(template);
  };

  /** Second step: user confirmed deletion */
  const handleDeleteConfirm = () => {
    if (!deletingTemplate) return;
    // Revoke blob URL to prevent memory leaks
    if (deletingTemplate.fileUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(deletingTemplate.fileUrl);
    }
    setTemplates((prev) => prev.filter((t) => t.id !== deletingTemplate.id));
    showToast(`"${deletingTemplate.title}" eliminada`, 'delete');
    setDeletingTemplate(null);
  };

  /** Handles the save action from the editor window */
  const handleSaveFromEditor = (template: ITemplate, modifiedPdfBlob: Blob) => {
    // Update the template with the new modified PDF blob
    const updatedUrl = URL.createObjectURL(modifiedPdfBlob);
    const updatedFile = new File([modifiedPdfBlob], template.title + '.pdf', { type: 'application/pdf' });
    
    // Quick re-generate thumbnail async (we could await, but fire-and-forget is ok here to not block UI)
    const updated: ITemplate = {
      ...template,
      fileUrl: updatedUrl,
      file: updatedFile,
    };
    
    import('../utils/pdfUtils').then(({ generatePdfThumbnail }) => {
       generatePdfThumbnail(updatedFile).then(thumbUrl => {
         setTemplates((prev) => prev.map((t) => (t.id === updated.id ? { ...t, previewImageUrl: thumbUrl } : t)));
       }).catch(console.error);
    });

    setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setViewerTemplate(null); // Close editor
  };

  /** Download original file */
  const handleDownload = (template: ITemplate) => {
    if (template.fileUrl && template.fileUrl !== '#') {
      const filename = template.file?.name ?? `${template.title}.pdf`;
      triggerDownload(template.fileUrl, filename);
      showToast(`Descargando "${template.title}"`, 'success');
    } else {
      showToast('Esta plantilla no tiene archivo adjunto para descargar.', 'delete');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const hasActiveSearch = searchQuery.length > 0;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout
      currentView="templates"
      onViewChange={onViewChange}
      topbarProps={{
        title: 'Plantillas',
        subtitle: 'Gestiona tus plantillas para prestamo de activos',
      }}
    >
      <div className="flex flex-col gap-6 h-full pb-8">

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Input
            id="templates-search-input"
            icon={Search}
            placeholder="Buscar..."
            value={searchQuery}
            onChange={handleSearchChange}
            containerClassName="w-full sm:max-w-xs"
          />
          <Button
            id="create-template-btn"
            variant="primary"
            icon={Plus}
            onClick={() => setEditingTemplate(null)}
          >
            Añadir Solicitud
          </Button>
        </div>

        {/* ── Content ── */}
        {paginatedTemplates.length > 0 ? (
          <>
            <div>
              <h2 className="text-base font-bold text-gray-800">Más Reciente</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={handlePreview}
                  onPersonalize={handlePersonalize}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                  onDownload={handleDownload}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-100">
              <span className="text-sm text-[#0a2a5e] font-medium">
                Mostrando {paginatedTemplates.length} de {filteredTemplates.length}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <button
                  aria-label="Página anterior"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 cursor-pointer hover:text-[#0a2a5e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium px-2">{currentPage} de {totalPages}</span>
                <button
                  aria-label="Página siguiente"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 cursor-pointer hover:text-[#0a2a5e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : hasActiveSearch ? (
          <NoSearchResults query={searchQuery} />
        ) : (
          <TemplatesEmptyState onCreateClick={() => setEditingTemplate(null)} />
        )}
      </div>

      {/* ── Create / Edit modal ── */}
      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setEditingTemplate(undefined)}
        onSave={handleSaveTemplate}
        templateToEdit={editingTemplate ?? null}
      />

      {/* ── Delete confirmation modal ── */}
      {deletingTemplate && (
        <DeleteTemplateModal
          isOpen={deletingTemplate !== null}
          template={deletingTemplate}
          onClose={() => setDeletingTemplate(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* ── PDF Editor Window ── */}
      <TemplateEditorWindow
        isOpen={viewerTemplate !== null}
        template={viewerTemplate}
        onClose={() => setViewerTemplate(null)}
        onSaveTemplate={handleSaveFromEditor}
      />
    </DashboardLayout>
  );
};
