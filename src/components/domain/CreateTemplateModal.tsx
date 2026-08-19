import React, { useState, useEffect, useRef } from 'react';
import {
  FileEarmarkText,
  ArrowRepeat,
  CheckCircleFill,
  Upload,
} from 'react-bootstrap-icons';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { FileDropzone } from '../ui/FileDropzone';
import { type ICreateTemplatePayload, type ITemplate } from '../../types/template.types';
import { useToast } from '../../contexts/ToastContext';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payload: ICreateTemplatePayload) => void | Promise<void>;
  /**
   * When provided the modal switches to "edit" mode:
   * - Title becomes "Editar Plantilla"
   * - Form pre-fills with the template's existing data
   * - File section shows the current PDF thumbnail with hover-to-replace
   */
  templateToEdit?: ITemplate | null;
}

const EMPTY_FORM: ICreateTemplatePayload = {
  templateName: '',
  description: '',
  file: null,
};

// ── Existing-file preview with hover-to-replace ───────────────────────────────

interface CurrentFilePreviewProps {
  previewImageUrl: string;
  filename: string;
  onReplace: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CurrentFilePreview: React.FC<CurrentFilePreviewProps> = ({
  previewImageUrl,
  filename,
  onReplace,
  fileInputRef,
  onFileInputChange,
}) => (
  <div className="flex flex-col gap-2">
    {/* Thumbnail with hover overlay */}
    <div
      className="group relative w-full rounded-xl overflow-hidden border border-gray-200 cursor-pointer aspect-[16/7] shrink-0"
      onClick={onReplace}
      title="Haz clic para cambiar el archivo"
    >
      <img
        src={previewImageUrl}
        alt="Vista previa del documento actual"
        className="
          absolute inset-0 w-full h-full object-cover object-top
          transition-all duration-300
          group-hover:scale-105 group-hover:blur-[2px] group-hover:brightness-60
        "
        draggable={false}
      />

      {/* Hover overlay */}
      <div className="
        absolute inset-0 flex flex-col items-center justify-center gap-2
        bg-[#0a2a5e]/50
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
      ">
        <div className="
          flex items-center justify-center
          w-12 h-12 rounded-full bg-white/25 border-2 border-white/70
          scale-75 group-hover:scale-100
          transition-transform duration-300
        ">
          <ArrowRepeat className="w-5 h-5 text-white drop-shadow" />
        </div>
        <span className="
          text-white text-xs font-bold tracking-wide drop-shadow
          translate-y-2 group-hover:translate-y-0
          opacity-0 group-hover:opacity-100
          transition-all duration-300 delay-75
        ">
          Cambiar documento
        </span>
      </div>
    </div>

    {/* Current file badge */}
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50 border border-green-100">
      <div className="flex items-center gap-2 min-w-0">
        <CheckCircleFill className="w-3.5 h-3.5 text-green-500 shrink-0" />
        <span className="text-xs font-semibold text-green-700 truncate">{filename}</span>
      </div>
      <button
        type="button"
        onClick={onReplace}
        className="
          flex items-center gap-1 ml-2 shrink-0
          text-xs text-gray-500 hover:text-[#0a2a5e]
          cursor-pointer transition-colors
        "
      >
        <Upload className="w-3 h-3" />
        Cambiar
      </button>
    </div>

    {/* Hidden file input */}
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf"
      className="hidden"
      onChange={onFileInputChange}
    />
  </div>
);

// ── Main modal ────────────────────────────────────────────────────────────────

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  templateToEdit = null,
}) => {
  const isEditMode = templateToEdit !== null;
  const [formData, setFormData] = useState<ICreateTemplatePayload>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Sync form when modal opens / templateToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (templateToEdit) {
        setFormData({
          templateName: templateToEdit.title,
          description: templateToEdit.description ?? '',
          file: templateToEdit.file ?? null,
        });
      } else {
        setFormData(EMPTY_FORM);
      }
      setIsSaving(false);
    }
  }, [isOpen, templateToEdit]);

  const handleFieldChange = <K extends keyof ICreateTemplatePayload>(
    key: K,
    value: ICreateTemplatePayload[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.templateName.trim()) {
      showToast('El nombre de la plantilla es obligatorio.', 'delete');
      return;
    }
    // In edit mode, the file is optional (keeps the existing one)
    if (!isEditMode && !formData.file) {
      showToast('Debe adjuntar un documento antes de guardar.', 'delete');
      return;
    }
    
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      showToast(
        isEditMode ? 'Plantilla actualizada con éxito' : 'Plantilla guardada con éxito',
        'success',
      );
      onClose();
    } catch (error) {
      console.error(error);
      showToast('Ocurrió un error al guardar la plantilla.', 'delete');
    } finally {
      setIsSaving(false);
    }
  };

  /** Click the hidden file input to replace the existing file */
  const handleReplaceClick = () => {
    replaceFileInputRef.current?.click();
  };

  /** Process the file chosen via the replace input */
  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    if (!chosen) return;

    if (!chosen.name.toLowerCase().endsWith('.pdf')) {
      showToast('Solo se aceptan archivos PDF.', 'delete');
      return;
    }
    if (chosen.size > 15 * 1024 * 1024) {
      showToast('El archivo supera el límite de 15 MB.', 'delete');
      return;
    }
    handleFieldChange('file', chosen);
    // Reset the input so the same file can be re-selected if needed
    e.target.value = '';
  };

  // Determine what to show in the file section
  const showCurrentPreview =
    isEditMode && templateToEdit?.previewImageUrl && !formData.file?.name
      ? true
      : isEditMode && formData.file !== null;

  // Which filename to show in the preview badge
  const currentFilename =
    formData.file?.name ?? templateToEdit?.file?.name ?? 'Documento existente';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Editar Plantilla' : 'Plantillas'}
      subtitle={
        isEditMode
          ? 'Actualiza el nombre, descripción o documento de esta plantilla'
          : 'Gestiona y monitorea tus plantillas de equipos IT'
      }
      icon={<FileEarmarkText className="w-6 h-6" />}
    >
      <div className="flex flex-col">
        {/* ── Form body ── */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-4 flex flex-col gap-4 sm:gap-5">

          {/* Template name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="template-name-input" className="text-sm font-semibold text-gray-700">
              Nombre de la Plantilla:
            </label>
            <Input
              id="template-name-input"
              placeholder="Documento-Lab"
              value={formData.templateName}
              onChange={(e) => handleFieldChange('templateName', e.target.value)}
              className="bg-white border border-gray-200 shadow-sm"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="template-description-textarea" className="text-sm font-semibold text-gray-700">
              Descripción:
            </label>
            <textarea
              id="template-description-textarea"
              placeholder="Este documento tendrá información sobre..."
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="
                w-full resize-none rounded-md border border-gray-200
                bg-white px-3 py-2 text-sm text-gray-700
                placeholder-gray-400 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-[#0a2a5e]
                transition-shadow
              "
            />
          </div>

          {/* File section */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              {isEditMode ? 'Documento adjunto' : 'Adjunte su documento'}
            </label>

            {isEditMode && showCurrentPreview ? (
              /* Edit mode: show current file thumbnail with hover-to-replace */
              <CurrentFilePreview
                previewImageUrl={templateToEdit!.previewImageUrl}
                filename={currentFilename}
                onReplace={handleReplaceClick}
                fileInputRef={replaceFileInputRef}
                onFileInputChange={handleReplaceFileChange}
              />
            ) : (
              /* Create mode (or edit without existing file): standard dropzone */
              <FileDropzone
                acceptedTypes=".pdf"
                maxSizeMB={15}
                selectedFile={formData.file}
                onFileSelect={(file) => handleFieldChange('file', file)}
                label={isEditMode ? 'Adjunte el nuevo PDF' : 'Adjunte su documento'}
                hint="Archivo .pdf, máx. de 15MB"
              />
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-t border-gray-100 bg-gray-50/50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 bg-[#0a2a5e] hover:bg-[#1a3d75] disabled:opacity-70 disabled:cursor-wait"
          >
            {isSaving ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Guardar Plantilla')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
