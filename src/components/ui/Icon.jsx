export default function Icon({ name, className = '', filled = false, ...props }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      {...props}
    >
      {name}
    </span>
  )
}
