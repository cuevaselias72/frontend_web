'use client';

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ModalDefaultBtn({ children, className = '', ...props }: BtnProps) {
  return (
    <button
      className={`px-4 py-2 bg-neutral-800 hover:bg-black text-white text-sm font-medium rounded-xl transition-all active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ModalCloseBtn({ children, className = '', ...props }: BtnProps) {
  return (
    <button
      className={`px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 text-sm font-medium rounded-xl transition-all active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}