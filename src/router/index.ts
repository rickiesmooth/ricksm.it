type NavigationState = { url: string; title?: string; isPopState?: boolean }
type Update = (args: NavigationState) => Promise<void>

const handleClick = (update: Update) =>
  function (event: MouseEvent) {
    if (
      event.target &&
      event.target instanceof HTMLAnchorElement &&
      event.target.href
    ) {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.which > 1
      )
        return

      const page = new URL(window.location.href)
      const link = new URL(getClosestLink(event.target, document).href)

      if (/\.(png|svg)$/.test(link.href)) return

      if (link.href == page.href) event.preventDefault()

      if (link.origin == page.origin && link.pathname != page.pathname) {
        event.preventDefault()
        update({ url: link.href })
      }
    }
  }

const handlePopState = (update: Update) =>
  function (event: PopStateEvent) {
    const url = location.href
    const title = event.state && event.state.title
    update({ url, title, isPopState: true })
  }

export function init({
  onChange,
}: {
  onChange(pathname: string): Promise<void>
}) {
  const navigationState = { current: { pathname: '' } }

  async function update({ url, title = '', isPopState }: NavigationState) {
    const prevState = navigationState.current
    const nextState = getState(url, title)

    if (prevState.pathname == nextState.pathname) return

    await onChange(nextState.pathname)

    navigationState.current = nextState

    if (!isPopState) {
      history.pushState(JSON.stringify(nextState), title || '', url)
    }
  }

  window.addEventListener('click', handleClick(update))
  window.addEventListener('popstate', handlePopState(update))
}

function getClosestLink(node: any, root: any): any {
  if (!node || node === root) return
  if ('a' !== node.nodeName.toLowerCase() || !node.href) {
    return getClosestLink(node.parentNode, root)
  }
  return node
}

const getState = (url: string, title: string) =>
  Object.assign(new URL(url), { title })
