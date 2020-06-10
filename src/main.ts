import { init as initRouter } from './router'

import './main.scss'

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
  initRouter({
    onChange: async (pathname) => {
      const content = await fetchPageContent(pathname)
      updatePageContent(content)
      executeContainerScripts()
    },
  })
}

initMain()
