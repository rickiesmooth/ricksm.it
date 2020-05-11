import './index.scss'

console.log(process.env.API_URL)

window
  .fetch(`${process.env.API_URL}/github`)
  .then((response) => response.json())
  .then((data) => console.log(data))
