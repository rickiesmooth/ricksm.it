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
          `<li class="flex-1 shadow w-full"><a href=${url}><h4 class="leading-snug text-md font-semibold mb-4 mt-2 sm:text-lg">${name}</h4></a>${descriptionHTML}</li>`
      )
      .join('')
  }

  fetch(`${process.env.API_URL}/github`)
    .then((response) => response.json())
    .then(renderShowCaseItems)
}

export function initWork() {
  fetchAndRenderShowCaseItems()
}

initWork()
