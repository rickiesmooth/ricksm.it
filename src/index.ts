import './index.scss'
import { init as initRouter } from './router'

import(/* webpackChunkName: "webgl" */ './webgl').then(({ initEarth }) =>
  initEarth()
)

type ShowCaseItem = {
  name: string
  url: string
  descriptionHTML: string
  topic: string[]
}

type ApiResponse = {
  showcaseItems: ShowCaseItem[]
}

function fetchAndRenderShowCaseItems() {
  const element = document.getElementById('projects')
  if (element === null) return

  function renderShowCaseItems({ showcaseItems }: ApiResponse) {
    element!.innerHTML = showcaseItems
      .map(
        ({ name, url, descriptionHTML }) =>
          `<li><a href=${url}>${name}</a>${descriptionHTML}</li>`
      )
      .join('')
  }

  fetch(`${process.env.API_URL}/github`)
    .then((response) => response.json())
    .then(renderShowCaseItems)
}

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

const CONTENT_SUFFIX = '.partial.html'

const getContentPartialPath = (pagePath: string) => {
  if (pagePath.endsWith('/')) {
    pagePath += 'index.html'
  }
  if (!pagePath.includes(CONTENT_SUFFIX)) {
    pagePath = pagePath.replace(/\.html$/, CONTENT_SUFFIX)
  }
  return pagePath
}

const fetchPageContent = (path: string) =>
  fetch(getContentPartialPath(path)).then((res) => res.text())

const updatePageContent = (content: string) => {
  document!.getElementById('content')!.innerHTML = content
}

function init() {
  animateWetransferSpinnerSvg()
  fetchAndRenderShowCaseItems()
  initRouter({
    onChange: async (pathname) => {
      const content = await fetchPageContent(pathname)
      updatePageContent(content)
    },
  })
}

init()