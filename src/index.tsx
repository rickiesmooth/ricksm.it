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
  const element = document.getElementById('projects')
  if (element !== null) {
    element.innerHTML = showcaseItems
      .map(
        ({ name, url, descriptionHTML }) =>
          `<li><a href=${url}>${name}</a>${descriptionHTML}</li>`
      )
      .join('')
  }
}

function fetchAndRenderShowCaseItems() {
  fetch(`${process.env.API_URL}/github`)
    .then((response) => response.json())
    .then(renderShowCaseItems)
}

fetchAndRenderShowCaseItems()
