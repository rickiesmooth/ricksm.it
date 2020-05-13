import './index.scss'

type ShowCaseItem = {
  name: string
  url: string
  descriptionHTML: string
  topic: string[]
}

type ApiResponse = {
  showcaseItems: ShowCaseItem[]
}

function renderShowCaseItems({ showcaseItems }: ApiResponse) {
  document.getElementById('projects')!.innerHTML = showcaseItems.reduce(
    (list, { name, url, descriptionHTML }) =>
      `${list}<li><a href=${url}>${name}</a>${descriptionHTML}</li>`,
    ''
  )
}

function fetchAndRenderShowCaseItems() {
  fetch(`${process.env.API_URL}/github`)
    .then((response) => response.json())
    .then(renderShowCaseItems)
}

fetchAndRenderShowCaseItems()
