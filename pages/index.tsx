import React from 'react'
import Layout from '../components/Layout'
import { Link } from '../components/Link'
import TimeLine from '../components/TimeLine'
import { updates } from '../utils/updates'

const formats = {
  webm: 'video/webm; codecs="vp8, vorbis"',
  vp9: 'video/webm; codecs="vp9"',
  hls: 'application/x-mpegURL; codecs="avc1.42E01E"',
}

export default function Index() {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      video.defaultPlaybackRate = 0.5

      if (video.canPlayType(formats['vp9'])) {
        video.src = 'video/640p-vp9.webm'
      } else if (video.canPlayType(formats['webm'])) {
        video.src = 'video/640p-vp8.webm'
      } else if (video.canPlayType(formats['hls'])) {
        video.src = 'video/640p.m3u8'
      } else {
        video.src = 'video/640p.mp4'
      }
    }
  }, [videoRef])

  React.useEffect(() => {
    if (process.browser) {
      import(
        /* webpackChunkName: "webgl" */ '../utils/webgl'
      ).then(({ initEarth }) => initEarth())
    }
  }, [])

  return (
    <Layout
      pageTitle="Home"
      description="My development blog. Focus on React, AWS, DevOps, and more!"
    >
      <div className="py-12">
        <h1 className="leading-tight text-4xl font-semibold mb-4 mt-6 text-center pb-2 sm:text-5xl">
          Hi, I'm Rick
        </h1>
        <p className="mb-12 text-center">
          I'm a curious fullstack developer and a good communicator. At the
          moment I'm interested in Functional Programming, Epistemology and
          DevOps.
        </p>
      </div>
      <div className="main flex md:flex-row flex-col mb-24">
        <TimeLine updates={updates} />
        <span className="border-dotted w-2 border-l-2 border-r-2 md:mx-16 md:my-0 my-16"></span>
        <div className="relative group">
          <video
            ref={videoRef}
            poster="/uploads/lake-tahoe.jpg"
            className="w-full min-h-full rounded-lg"
            autoPlay
            loop
            muted
            playsInline
          ></video>
          <Link href="/posts/">
            <div className="absolute bottom-0 top-0 left-0 right-0 p-8 text-white flex justify-end flex-col">
              <h4>my blog</h4>
              <p className="text-sm">where I learn and reflect</p>
              <svg
                className="fill-currentx w-4 h-4 mr-8 self-center transform -rotate-90 absolute right-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
