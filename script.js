const grid = document.querySelector('.grid')
const input = document.getElementById('input')
const submitBtn = document.getElementById('submit')

const macyInstance = Macy({
  container: grid,
  breakAt: {
    1600: 5,
    1200: 4,
    900: 3,
    600: 2,
    400: 1,
  },
})

const key = 'Gj812_xvgyKHIXLLsaP29BadzLP59cvQm6g4YNCZLsM'

const API_URL = 'https://api.unsplash.com'

const fixStartUpBug = () => {
  macyInstance.runOnImageLoad(function () {
    macyInstance.recalculate(true, true)
    var evt = document.createEvent('UIEvents')
    evt.initUIEvent('resize', true, false, window, 0)
    window.dispatchEvent(evt)
  }, true)
}

const addImagesInDom = images => {
  images.forEach(image => {
    const container = document.createElement('div')

    const img = document.createElement('img')
    img.src = image.urls.regular
    container.append(img)

    const author = document.createElement('p')
    author.textContent = `By ${image.user.name}`
    container.append(author)

    const link = document.createElement('a')
    link.href = image.links.html
    link.target = '_blank'
    link.textContent = 'View on Unsplash'
    container.append(link)

    grid.append(container)
  })
}

// const intializeImages = async () => {
//   let { data: images } = await axios.get(
//     `${API_URL}/photos/?client_id=${key}&per_page=50`
//   )

//   addImagesInDom(images)

//   fixStartUpBug()
// }

// intializeImages()

const searchImages = async query => {
  let {
    data: { results: images },
  } = await axios.get(
    `${API_URL}/search/photos/?client_id=${key}&query=${query}&per_page=50`
  )

  return images
}

const removeAllChild = parent => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

const handleSubmit = async event => {
  event.preventDefault()

  const query = input.value

  if (!query) return false

  const images = await searchImages(query)

  removeAllChild(grid)

  addImagesInDom(images)

  fixStartUpBug()
}

submitBtn.addEventListener('click', handleSubmit)