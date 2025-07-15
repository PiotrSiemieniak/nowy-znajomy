import * as React from "react";
import { X, Eye, EyeClosed } from "lucide-react";

import { cn } from "@/lib/utils";
import { useId } from "react";

// Props rozszerzone o clearable i showPasswordToggle
type InputProps = React.ComponentProps<"input"> & {
  clearable?: boolean;
  showPasswordToggle?: boolean;
};

function Input({
  className,
  type,
  clearable = false,
  showPasswordToggle = false,
  ...props
}: InputProps) {
  const [inputType, setInputType] = React.useState(type);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const uid = useId();

  // Obsługa controlled/uncontrolled value
  const isControlled = props.value !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    props.defaultValue ?? ""
  );
  const value = isControlled ? props.value : internalValue;

  // Synchronizacja typu inputa (dla hasła)
  React.useEffect(() => {
    setInputType(type);
  }, [type]);

  // Czyszczenie inputa
  const handleClear = (e: React.MouseEvent) => {
    if (isControlled && props.onChange) {
      const event = {
        ...e,
        target: { ...inputRef.current, value: "" },
        currentTarget: { ...inputRef.current, value: "" },
      };
      props.onChange(event as any);
    } else {
      setInternalValue("");
      // Wywołaj onChange jeśli jest
      if (props.onChange) {
        const event = {
          ...e,
          target: { ...inputRef.current, value: "" },
          currentTarget: { ...inputRef.current, value: "" },
        };
        props.onChange(event as any);
      }
    }
    // Ustaw focus z powrotem na input
    inputRef.current?.focus();
  };

  // Zmiana widoczności hasła
  const handleTogglePassword = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
    inputRef.current?.focus();
  };

  // Obsługa zmiany wartości (dla uncontrolled)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    if (props.onChange) props.onChange(e);
  };

  return (
    <div className="relative w-full">
      <input
        id={"input-" + uid}
        name={"input-" + uid}
        ref={inputRef}
        type={inputType}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
        value={value}
        onChange={handleChange}
      />
      {/* Ikonka X do czyszczenia */}
      {clearable && !!value && (
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
          aria-label="Wyczyść pole"
        >
          <X size={16} />
        </button>
      )}
      {/* Ikonka Eye/EyeClosed do pokazywania hasła */}
      {showPasswordToggle && type === "password" && (
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
          onClick={handleTogglePassword}
          aria-label={inputType === "password" ? "Pokaż hasło" : "Ukryj hasło"}
        >
          {inputType === "password" ? (
            <Eye size={16} />
          ) : (
            <EyeClosed size={16} />
          )}
        </button>
      )}
    </div>
  );
}

export { Input };
