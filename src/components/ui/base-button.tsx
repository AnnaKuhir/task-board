export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function BaseButton({ startIcon, endIcon, children, className = '', ...props }: BaseButtonProps) {
  return (
    <button
      {...props}
      className={`${className} capitalize group flex cursor-pointer items-center transition-all ease-in-out disabled:cursor-not-allowed`}
    >
      {startIcon && <span>{startIcon}</span>}
      {children}
      {endIcon && <span>{endIcon}</span>}
    </button>
  );
}
