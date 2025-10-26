/**
 * Input Component
 *
 * A reusable input component with variants, validation states, and icons.
 * Supports text, password, email, number types and custom styling.
 *
 * @example
 * <Input
 *   label="Branch Name"
 *   placeholder="Enter branch name..."
 *   value={value}
 *   onChange={setValue}
 *   icon={<GitBranch />}
 * />
 */

import "./Input.css";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  size = "medium",
  className = "",
  name,
  id,
  ...rest
}) => {
  const inputId =
    id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  const wrapperClassNames = [
    "input-wrapper",
    `input-${size}`,
    error && "input-error",
    disabled && "input-disabled",
    fullWidth && "input-full-width",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, e);
    }
  };

  return (
    <div className={wrapperClassNames}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input-field ${icon ? "input-with-icon" : ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error || helperText ? `${inputId}-helper` : undefined
          }
          {...rest}
        />
      </div>

      {(error || helperText) && (
        <div
          id={`${inputId}-helper`}
          className={`input-helper ${error ? "input-helper-error" : ""}`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

// Textarea variant
Input.Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  rows = 4,
  fullWidth = false,
  className = "",
  name,
  id,
  ...rest
}) => {
  const textareaId =
    id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const wrapperClassNames = [
    "input-wrapper",
    error && "input-error",
    disabled && "input-disabled",
    fullWidth && "input-full-width",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, e);
    }
  };

  return (
    <div className={wrapperClassNames}>
      {label && (
        <label htmlFor={textareaId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className="input-field input-textarea"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error || helperText ? `${textareaId}-helper` : undefined
        }
        {...rest}
      />

      {(error || helperText) && (
        <div
          id={`${textareaId}-helper`}
          className={`input-helper ${error ? "input-helper-error" : ""}`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
