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

export function initHome() {
  animateWetransferSpinnerSvg()
  import(/* webpackChunkName: "webgl" */ './webgl').then(({ initEarth }) =>
    initEarth()
  )
}

initHome()
