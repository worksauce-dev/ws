import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, isRequired, className, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={props.id} className="label">
            {label}
            {isRequired && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={clsx("input", hasError && "input-error", className)}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
        {helperText && !error && <p className="form-helper">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
