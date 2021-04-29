export function Callout({ variant = 'info', list = [], children }) {
  const variantStyles = {
    info: 'bg-blue-50',
    danger: 'bg-red-200',
  }
  return (
    <aside className={`${variantStyles[variant]} mb-5 p-5 text-grey rounded-md`}>
      {children || (
        <ul>
          {list.map((item, i) => (
            <li className="list-disc m-5" key={i}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
