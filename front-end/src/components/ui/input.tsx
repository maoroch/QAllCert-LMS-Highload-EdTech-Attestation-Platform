import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className = '', label, error, ...props }, ref) => {
 return (
 <div className="w-full flex flex-col gap-1.5">
 {label && (
 <label className="text-sm font-medium text-slate-700 ">
 {label}
 </label>
 )}
 <input
 ref={ref}
 className={`
 flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm 
 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 
 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50
 :ring-indigo-400
 transition-colors duration-200 ease-in-out
 ${error ? 'border-red-500 focus:ring-red-500 ' : ''}
 ${className}
 `}
 {...props}
 />
 {error && <span className="text-xs text-red-500">{error}</span>}
 </div>
 );
 }
);
Input.displayName = 'Input';
