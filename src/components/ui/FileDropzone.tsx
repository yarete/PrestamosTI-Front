import React, { useCallback, useRef, useState } from 'react';
import { FileEarmark, CloudUpload, CheckCircle, XCircle } from 'react-bootstrap-icons';

interface FileDropzoneProps {
  acceptedTypes?: string;
  maxSizeMB?: number;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  label?: string;
  hint?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  acceptedTypes = '.pdf',
  maxSizeMB = 15,
  selectedFile,
  onFileSelect,
  label = 'Adjunte su documento',
  hint,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedHint = hint ?? `Archivo .pdf, máx. de ${maxSizeMB}MB`;

  const validateAndSet = useCallback(
    (file: File) => {
      setError(null);

      const extension = file.name.split('.').pop()?.toLowerCase();
      const allowed = acceptedTypes
        .split(',')
        .map((t) => t.trim().replace('.', '').toLowerCase());

      if (!allowed.includes(extension ?? '')) {
        setError(`Tipo de archivo no permitido. Solo se aceptan: ${acceptedTypes}`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`El archivo supera el límite de ${maxSizeMB}MB.`);
        return;
      }

      onFileSelect(file);
    },
    [acceptedTypes, maxSizeMB, onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSet(file);
    },
    [validateAndSet],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
    // Reset input so the same file can be re-selected after removal
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Área de carga de archivo"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center gap-3 
          w-full min-h-[160px] rounded-xl cursor-pointer 
          border-2 border-dashed transition-all duration-200 select-none
          ${isDragging
            ? 'border-[#0a2a5e] bg-blue-50 scale-[1.01]'
            : selectedFile
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-white hover:border-[#0a2a5e] hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          className="hidden"
          onChange={handleInputChange}
        />

        {selectedFile ? (
          /* ── File selected state ── */
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-sm font-semibold text-gray-800 truncate max-w-[220px]">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="mt-1 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
            >
              <XCircle className="w-3.5 h-3.5" />
              Eliminar archivo
            </button>
          </div>
        ) : (
          /* ── Empty / drag state ── */
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <div className="relative">
              <FileEarmark className="w-10 h-10 text-gray-400" />
              <CloudUpload
                className={`w-4 h-4 absolute -bottom-1 -right-1 transition-colors ${
                  isDragging ? 'text-[#0a2a5e]' : 'text-gray-400'
                }`}
              />
            </div>
            <span
              className={`text-sm font-semibold transition-colors ${
                isDragging ? 'text-[#0a2a5e]' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
            <span className="text-xs text-gray-400">{resolvedHint}</span>
          </div>
        )}
      </div>

      {/* Validation error */}
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
