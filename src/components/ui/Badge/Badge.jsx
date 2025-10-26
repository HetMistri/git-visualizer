/**
 * Badge Component
 *
 * A reusable badge/tag component for labels, status indicators, and counts.
 * Supports multiple variants, sizes, and optional icons.
 *
 * @example
 * <Badge variant="primary">New</Badge>
 * <Badge variant="success" icon={<Check />}>Active</Badge>
 * <Badge variant="info" size="small">v1.0</Badge>
 */

import "./Badge.css";

const Badge = ({
  children,
  variant = "default",
  size = "medium",
  icon,
  dot = false,
  pill = false,
  outline = false,
  className = "",
  ...rest
}) => {
  const classNames = [
    "badge",
    `badge-${variant}`,
    `badge-${size}`,
    pill && "badge-pill",
    outline && "badge-outline",
    dot && "badge-with-dot",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classNames} {...rest}>
      {dot && <span className="badge-dot"></span>}
      {icon && <span className="badge-icon">{icon}</span>}
      {children && <span className="badge-text">{children}</span>}
    </span>
  );
};

export default Badge;
