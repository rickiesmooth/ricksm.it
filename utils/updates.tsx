import React from 'react'

export const updates = [
  {
    year: 2013,
    description: 'Started out as a large customer sales intern at Google.',
    logo: (
      <img
        className="w-full"
        src="/uploads/google-logo.png"
        alt="Google logo"
      />
    ),
  },
  {
    year: 2015,
    description:
      "Coding always was my hobby and I got to that that professionally when I joined my friends' startup building products for companies like MTV",
    logo: <div className="w-full text-lg flex justify-center">🚀</div>,
  },
  {
    year: 2018,
    description:
      'Registered Smooth Capital Holding Enterprise International Worldwide and freelanced for big companies (Ahold, Catawiki)',
    logo: (
      <canvas className="w-full" id="canvas" width="51" height="51"></canvas>
    ),
  },
  {
    year: 2020,
    description:
      'Currently at WeTransfer building products that creatives love',
    logo: <Spinner />,
  },
]

function Spinner() {
  const spinnerRef = React.useRef()

  return (
    <svg
      ref={spinnerRef}
      className="w-full h-full"
      viewBox="0 0 170 170"
      height="170"
      width="170"
      shapeRendering="geometricPrecision"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        r="80"
        cx="85"
        cy="85"
        fill="transparent"
        stroke="rgb(232, 235, 237)"
        strokeDashoffset="0"
        strokeWidth="10"
      />
      <circle
        className="animate-spin origin-center"
        style={{ animationDuration: '4s' }}
        r="80"
        cx="85"
        cy="85"
        fill="transparent"
        stroke="rgb(64, 159, 255)"
        strokeDashoffset="200"
        strokeDasharray="200"
        strokeWidth="10"
      />
    </svg>
  )
}