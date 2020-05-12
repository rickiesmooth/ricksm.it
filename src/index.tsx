import './index.scss'

console.log('URL', process.env.API_URL)

type ShowCaseItem = {
  name: string
  url: string
  descriptionHTML: string
  topic: string[]
}

type ApiResponse = {
  showcaseItems: ShowCaseItem[]
}

window
  .fetch(`${process.env.API_URL}/github`)
  .then((response) => response.json() as Promise<ApiResponse>)
  .then(({ showcaseItems }) => {
    document.getElementById('projects')!.innerHTML = showcaseItems.reduce(
      (list, { name, url, descriptionHTML }) =>
        `${list}<li><a class="text-blue-400 hover:underline" href=${url}>${name}</a>${descriptionHTML}</li>`,
      ''
    )
  })
