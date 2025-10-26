/**
 * Button Component
 *
 * A reusable, atomic button component with multiple variants and sizes.
 * Supports icons, loading states, and consistent styling across the app.
 *
 * @example
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * <Button variant="secondary" icon={<GitBranch />} disabled>
 *   Disabled
 * </Button>
 */

import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  onClick,
  type = "button",
  title,
  ariaLabel,
  ...rest
}) => {
  const classNames = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && "btn-full-width",
    loading && "btn-loading",
    disabled && "btn-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={classNames}
      onClick={handleClick}
      disabled={disabled || loading}
      title={title}
      aria-label={ariaLabel}
      {...rest}
    >
      {loading && <span className="btn-spinner"></span>}
      {!loading && icon && iconPosition === "left" && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      {children && <span className="btn-text">{children}</span>}
      {!loading && icon && iconPosition === "right" && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
