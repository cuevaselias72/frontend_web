//Sobre todo poara los modals que repiten mucho
'use client';

// --- INPUT CON LABEL RESPONSIVO ---
interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function LabelInput({ label, id, className = '', ...props }: LabelInputProps) {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-neutral-700 sm:w-1/3 sm:text-right shrink-0"
      >
        {label}
      </label>
      <input
        id={inputId}
        className="w-full sm:w-2/3 rounded-xl border border-transparent bg-neutral-200/70 px-4 py-2.5 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-200 transition-all"
        {...props}
      />
    </div>
  );
}


// --- BOTÓN BLANCO TIPO PILL (OUTLINE) ---
interface OutlineBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function OutlineButton({ children, className = '', ...props }: OutlineBtnProps) {
  return (
    <button
      className={`px-6 py-2 bg-white border-2 border-neutral-800 text-neutral-800 text-sm font-medium rounded-full hover:bg-neutral-100 hover:text-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}