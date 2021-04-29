type Update = {
  year: number
  logo: JSX.Element
  description: string
}

function TimeStamp({ children }) {
  return (
    <aside className="text-xs p-2 bg-gray-300 rounded-3xl	flex justify-center items-center flex-shrink-0 w-12 mr-4">
      {children}
    </aside>
  )
}

function Line() {
  return <div className="bg-gray-300 w-px h-full block ml-6 absolute"></div>
}

function Update({
  year,
  logo,
  description,
  isLast,
}: Update & { isLast: boolean }) {
  return (
    <div className="flex flex-row items-start pb-8 relative">
      {!isLast && <Line />}
      <TimeStamp>{year}</TimeStamp>
      <main className="flex flex-1 flex-row items-start m-0 text-sm">
        {logo}
        <p>{description}</p>
      </main>
    </div>
  )
}

export default function TimeLine({ updates }: { updates: Update[] }) {
  return (
    <div className="relative flex flex-col flex-2 self-center">
      {updates.map((update, i) => (
        <Update {...update} isLast={i === updates.length - 1} />
      ))}
    </div>
  )
}
