const Badge = ({ children, variant = 'success' }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  }

  return <span className={variants[variant]}>{children}</span>
}

export default Badge
