export const CodeSandbox = ({ src }) => {
  return (
    <iframe
      src={src}
      className="w-full border-none rounded-md overflow-hidden mb-5"
      style={{ height: 500 }}
      title="Framer Motion: Image gallery (forked)"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
  )
}
