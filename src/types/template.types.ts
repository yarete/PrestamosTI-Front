// Domain model for a Template entity
export interface ITemplate {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  previewImageUrl: string;
  /** Blob URL (for uploaded files) or a regular HTTP URL */
  fileUrl?: string;
  /** The raw File object – only present when the template was created client-side */
  file?: File;
}

// Payload used when creating / editing a template via the form
export interface ICreateTemplatePayload {
  templateName: string;
  description: string;
  file: File | null;
}
