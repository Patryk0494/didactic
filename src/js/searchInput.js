const searchInputElement = document.querySelector('#search-input');
const inputWrapperElement = document.querySelector('.input-wrapper');
const searchResultsElement = document.querySelector('#search_results');
const dropdownElem = document.querySelector('.input-wrapper__dropdown');
const labelElement = document.querySelector('.input-wrapper__label');

const hasLoadIcon = () => !!inputWrapperElement.querySelector('.load-icon');
const hideDropdown = () =>
  dropdownElem.classList.remove('input-wrapper__dropdown--show');
const showDropdown = () =>
  dropdownElem.classList.add('input-wrapper__dropdown--show');

const loadIconElement = document.createElement('i');
loadIconElement.classList.add('load-icon');

const createProductElement = (title, price) => {
  const productElement = document.createElement('li');
  productElement.innerHTML = `${title} <span>$${price}</span>`;
  productElement.style.color = '#000';
  return productElement;
};

const getProducts = async query => {
  inputWrapperElement.appendChild(loadIconElement);
  return fetch(
    `https://dummyjson.com/products/search?q=${query}&limit=5&delay=1000`
  )
    .then(res => res.json())
    .then(data => {
      inputWrapperElement.removeChild(loadIconElement);
      return data;
    })
    .catch(err => {
      inputWrapperElement.removeChild(loadIconElement);
      console.log(err);
    });
};

searchInputElement.addEventListener('input', async e => {
  const { value } = e.target;

  labelElement.style.visibility = value.length ? 'visible' : 'hidden';

  if (value.length > 2) {
    hideDropdown();
    searchResultsElement.innerHTML = '';
    const { products } = await getProducts(value);
    if (products.length) {
      const { top } = dropdownElem.getBoundingClientRect();
      dropdownElem.style.maxHeight = `calc(100vh - ${top + 20}px)`;
      products.forEach(({ title, price }) => {
        const productElement = createProductElement(title, price);
        searchResultsElement.appendChild(productElement);
      });
      showDropdown();
    } else {
      hideDropdown();
    }
  } else {
    hideDropdown();
  }
});
