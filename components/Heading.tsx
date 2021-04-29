export const Heading = ({ children, level = 1 }) => {
    const map = {
        1: "text-2xl leading-7 sm:text-3xl",
        2: "text-xl leading-6 sm:text-1xl"
    }
  return (
    <div className="pb-5 mb-5 border-b border-gray-200">
      <h3 className={`${map[level]} font-bold text-gray-900`}>{children}</h3>
    </div>
  )
}
