import { forwardRef } from "react";
import { clsx } from "clsx";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: React.ReactNode;
  error?: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className={clsx(
              "w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2",
              error && "border-red-500",
              className
            )}
            onChange={handleChange}
            {...props}
          />
        </div>
        {label && (
          <div className="flex-1">
            {typeof label === "string" ? (
              <label className="text-sm text-neutral-700 leading-5">
                {label}
              </label>
            ) : (
              label
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
