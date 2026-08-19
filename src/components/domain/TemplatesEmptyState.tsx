import React from 'react';
import {
  FileEarmarkText,
  Plus,
  Search,
} from 'react-bootstrap-icons';

// ── Ghost template card ───────────────────────────────────────────────────────

interface GhostCardProps {
  opacity: number;
  rotate?: number;
  scale?: number;
  delay?: string;
}

const GhostCard: React.FC<GhostCardProps> = ({
  opacity,
  rotate = 0,
  scale = 1,
  delay = '0ms',
}) => (
  <div
    className="w-44 rounded-xl border-2 border-dashed border-[#0a2a5e]/20 bg-white/60 flex flex-col overflow-hidden shrink-0"
    style={{
      opacity,
      transform: `rotate(${rotate}deg) scale(${scale})`,
      transition: `all 0.6s ease ${delay}`,
    }}
  >
    {/* Thumbnail area */}
    <div className="w-full bg-gradient-to-br from-slate-100 to-blue-50/60 flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
      <FileEarmarkText className="w-8 h-8 text-[#0a2a5e]/20" />
    </div>
    {/* Body skeleton */}
    <div className="p-3 flex flex-col gap-2">
      <div className="h-2.5 rounded-full bg-gray-200/80 w-3/4" />
      <div className="h-2.5 rounded-full bg-gray-200/80 w-1/2" />
    </div>
  </div>
);

// ── No-search results state ───────────────────────────────────────────────────

interface NoSearchResultsProps {
  query: string;
}

export const NoSearchResults: React.FC<NoSearchResultsProps> = ({ query }) => (
  <div className="flex-1 flex flex-col items-center justify-center py-16 animate-in fade-in duration-300">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
      <Search className="w-9 h-9 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-[#0a2a5e] mb-2">
      Sin resultados para &ldquo;{query}&rdquo;
    </h3>
    <p className="text-gray-400 text-sm text-center max-w-xs">
      Intenta con otro término o verifica la ortografía del nombre.
    </p>
  </div>
);

// ── Main empty state ─────────────────────────────────────────────────────────

interface TemplatesEmptyStateProps {
  onCreateClick: () => void;
}

export const TemplatesEmptyState: React.FC<TemplatesEmptyStateProps> = ({ onCreateClick }) => (
  <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">

    {/* ── Ghost cards illustration ── */}
    <div className="relative flex items-end justify-center gap-3 mb-10 h-52 w-full max-w-lg px-4">
      {/* Decorative blurred glow behind the cards */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(10,42,94,0.07) 0%, transparent 70%)' }}
      />

      {/* Left card — furthest away */}
      <div className="hidden sm:block pb-4" style={{ opacity: 0.35 }}>
        <GhostCard opacity={1} rotate={-8} scale={0.88} delay="100ms" />
      </div>

      {/* Center card — closest */}
      <div className="relative z-10">
        {/* Glowing icon badge floating on the center card */}
        <div className="
          absolute -top-5 left-1/2 -translate-x-1/2
          w-11 h-11 rounded-2xl
          bg-gradient-to-br from-[#0a2a5e] to-[#1e4d9b]
          shadow-[0_8px_24px_0_rgba(10,42,94,0.35)]
          flex items-center justify-center z-20
        ">
          <FileEarmarkText className="w-5 h-5 text-white" />
        </div>
        <GhostCard opacity={1} rotate={0} scale={1} delay="0ms" />
      </div>

      {/* Right card — furthest away */}
      <div className="hidden sm:block pb-4" style={{ opacity: 0.35 }}>
        <GhostCard opacity={1} rotate={8} scale={0.88} delay="200ms" />
      </div>
    </div>

    {/* ── Heading ── */}
    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a2a5e] text-center mb-3 tracking-tight">
      No hay plantillas registradas
    </h3>
    <p className="text-gray-500 text-sm sm:text-base text-center max-w-sm sm:max-w-md mb-7 leading-relaxed px-4">
      Las plantillas son documentos base para gestionar tus préstamos de activos IT.
      Crea la primera y agiliza cada proceso desde aquí.
    </p>



    {/* ── CTA ── */}
    <button
      type="button"
      onClick={onCreateClick}
      className="
        flex items-center gap-2.5
        px-7 py-3.5 rounded-xl
        bg-gradient-to-br from-[#0a2a5e] to-[#1e4d9b]
        text-white font-bold text-sm sm:text-base
        shadow-[0_6px_20px_0_rgba(10,42,94,0.35)]
        hover:shadow-[0_10px_30px_0_rgba(10,42,94,0.45)]
        hover:scale-[1.03] active:scale-[0.98]
        transition-all duration-200
        cursor-pointer
      "
    >
      <Plus className="w-5 h-5" />
      Crear primera plantilla
    </button>

    {/* Subtle bottom hint */}
    <p className="mt-5 text-xs text-gray-400 text-center px-4">
      Puedes subir documentos PDF · máx. 15 MB por plantilla
    </p>
  </div>
);
