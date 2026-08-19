import * as pdfjsLib from 'pdfjs-dist';

// Vite handles ?url by emitting the asset and returning its public URL
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/**
 * Generates a thumbnail image (data URL) from the first page of a given PDF File.
 * 
 * @param file The PDF File object
 * @returns A Promise that resolves to a base64 encoded data URL (image/png)
 */
export async function generatePdfThumbnail(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Get the first page
    const page = await pdf.getPage(1);
    
    // Set scale for thumbnail quality vs size
    const viewport = page.getViewport({ scale: 1.5 });
    
    // Prepare canvas using standard DOM
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Fill white background (PDFs are transparent by default)
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    
    await page.render(renderContext as any).promise;
    
    // Return base64 string
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error);
    throw error;
  }
}
