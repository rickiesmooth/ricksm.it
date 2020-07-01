import { init as initRouter } from './router'

import './main.scss'

const CONTENT_SUFFIX = '.partial.html'

const getContentPartialPath = (pathname: string) => {
  if (pathname.endsWith('/')) {
    pathname += 'index.html'
  }

  if (!pathname.includes(CONTENT_SUFFIX)) {
    pathname = pathname.replace(/\.html$/, CONTENT_SUFFIX)
  }

  return pathname
}

const fetchPageContent = (pathname: string) =>
  fetch(getContentPartialPath(pathname)).then((res) => res.text())

const updatePageContent = (content: string) => {
  const node = document!.getElementById('content')!
  node.innerHTML = content
}

const executeContainerScripts = () => {
  const container = document.getElementById('content')
  const containerScripts = Array.from(container!.getElementsByTagName('script'))
  for (const containerScript of containerScripts) {
    const activeScript = document.createElement('script')
    containerScript!.parentNode!.removeChild(containerScript)
    activeScript.text = containerScript.text
    container!.appendChild(activeScript)
  }
}

function initMain() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
    })
  }
  initRouter({
    onChange: async (pathname) => {
      const content = await fetchPageContent(pathname)
      updatePageContent(content)
      executeContainerScripts()
    },
  })
}

initMain()
