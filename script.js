const grid = document.querySelector('.grid');
const input = document.getElementById('input');
const submitBtn = document.getElementById('submit');

const macyInstance = Macy({
  container: grid,
  breakAt: {
    1600: 5,
    1200: 4,
    900: 3,
    600: 2,
    400: 1,
  },
});

const key = 'Gj812_xvgyKHIXLLsaP29BadzLP59cvQm6g4YNCZLsM';

const API_URL = 'https://api.unsplash.com';

const fixStartUpBug = () => {
  macyInstance.runOnImageLoad(function () {
    macyInstance.recalculate(true, true);
    var evt = document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);
  }, true);
};

const addImagesInDom = (images) => {
  images.forEach((image) => {
    const container = document.createElement('div');

    const img = document.createElement('img');
    img.src = image.urls.regular;
    img.alt = image.alt_description;
    container.append(img);

    const author = document.createElement('p');
    author.classList.add('author');
    author.textContent = `author: ${image.user.name}`;

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = image.alt_description;

    const link = document.createElement('a');
    link.href = image.links.html;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View on Unsplash';

    container.append(author, description, link);
    grid.append(container);
  });
};
const searchImages = async (query) => {
  let {
    data: { results: images },
  } = await axios.get(
    `${API_URL}/search/photos/?client_id=${key}&query=${query}&per_page=50`
  );

  images = images.map((image) => {
    return {
      urls: {
        regular: image.urls.regular,
      },
      alt_description: image.alt_description,
      user: {
        name: image.user.name,
      },
      links: {
        html: image.links.html,
      },
    };
  });

  return images;
};

const removeAllChild = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const query = input.value;

  if (!query) return false;

  const images = await searchImages(query);

  removeAllChild(grid);

  addImagesInDom(images);

  fixStartUpBug();
};

submitBtn.addEventListener('click', handleSubmit);