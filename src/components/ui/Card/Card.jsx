/**
 * Card Component
 *
 * A reusable card component with glassmorphic design.
 * Used for feature cards, info panels, and content sections.
 *
 * @example
 * <Card variant="elevated" padding="large">
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content goes here</Card.Body>
 * </Card>
 */

import "./Card.css";

const Card = ({
  children,
  variant = "default",
  padding = "medium",
  hoverable = false,
  className = "",
  onClick,
  ...rest
}) => {
  const classNames = [
    "card",
    `card-${variant}`,
    `card-padding-${padding}`,
    hoverable && "card-hoverable",
    onClick && "card-clickable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} onClick={onClick} {...rest}>
      {children}
    </div>
  );
};

// Sub-components for better composition
Card.Header = ({ children, className = "", ...rest }) => (
  <div className={`card-header ${className}`} {...rest}>
    {children}
  </div>
);

Card.Body = ({ children, className = "", ...rest }) => (
  <div className={`card-body ${className}`} {...rest}>
    {children}
  </div>
);

Card.Footer = ({ children, className = "", ...rest }) => (
  <div className={`card-footer ${className}`} {...rest}>
    {children}
  </div>
);

Card.Icon = ({ children, className = "", ...rest }) => (
  <div className={`card-icon ${className}`} {...rest}>
    {children}
  </div>
);

Card.Title = ({ children, className = "", ...rest }) => (
  <h3 className={`card-title ${className}`} {...rest}>
    {children}
  </h3>
);

Card.Description = ({ children, className = "", ...rest }) => (
  <p className={`card-description ${className}`} {...rest}>
    {children}
  </p>
);

export default Card;
