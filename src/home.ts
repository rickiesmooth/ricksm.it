function animateWetransferSpinnerSvg() {
  const element = document.getElementById('wetransfer-spinner')
  if (element === null) return
  // clone node to overlay with progress
  const backgroundCircle = element.getElementsByTagName('circle')[0]
  const progressCircle = backgroundCircle.cloneNode() as typeof backgroundCircle
  const pathLength = backgroundCircle.getTotalLength() || 502 // iOS Safari fallback

  backgroundCircle.setAttribute('stroke-dasharray', `${pathLength}`)

  progressCircle.setAttribute('stroke', 'rgb(64, 159, 255)')
  progressCircle.setAttribute('stroke-dashoffset', `${pathLength}`)
  progressCircle.setAttribute('stroke-dasharray', `${pathLength}`)
  progressCircle.setAttribute('class', 'progress')

  element.appendChild(progressCircle)
}

function initVideo() {
  const video = document.getElementsByTagName('video')[0]
  const formats = {
    webm: 'video/webm; codecs="vp8, vorbis"',
    vp9: 'video/webm; codecs="vp9"',
    hls: 'application/x-mpegURL; codecs="avc1.42E01E"',
  }
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

export function initHome() {
  animateWetransferSpinnerSvg()
  initVideo()
  import(/* webpackChunkName: "webgl" */ './webgl').then(({ initEarth }) =>
    initEarth()
  )
}

initHome()
