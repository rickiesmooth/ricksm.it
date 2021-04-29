export function Callout({ variant = 'info', list = [], children }) {
  const variantStyles = {
    info: 'bg-blue-200',
    danger: 'bg-red-200',
  }
  return (
    <aside className={`${variantStyles[variant]} mb-5 p-5 text-grey`}>
      {children || (
        <ul>
          {list.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      )}
    </aside>
  )
}
