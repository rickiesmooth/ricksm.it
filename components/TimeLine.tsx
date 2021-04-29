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

export default function TimeLine({ updates }: { updates: Update[] }) {
  return (
    <div className="relative flex flex-col flex-2 self-center">
      {updates.map(({ year, description, logo }, i) => (
        <div className="flex flex-row items-start pb-8 relative" key={i}>
          {i !== updates.length - 1 && <Line />}
          <TimeStamp>{year}</TimeStamp>
          <main className="flex flex-1 flex-row items-start m-0 text-sm">
            <div className="w-6 h-6 mr-5">{logo}</div>
            <p className="flex-1">{description}</p>
          </main>
        </div>
      ))}
    </div>
  )
}
