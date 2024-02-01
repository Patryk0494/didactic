import './style.scss';

const menuItems = document.querySelectorAll('.main-menu__item');

const hideSubmenu = (currentlyClickedItem) => {
  const menuSubitems = document.querySelectorAll('.main-menu__subitem');
  menuSubitems.forEach((subitem) => {
    if (subitem.id !== currentlyClickedItem) {
      subitem.classList.remove('main-menu__subitem--show');
    }
  })
}
menuItems.forEach((item) => {
  item.addEventListener('click', e => {
    const { id: itemId, offsetLeft, offsetWidth } = e.target;
    const subitemId = `${itemId}_submenu`
    const itemSubmenu = document.querySelector(`#${subitemId}`);
    if (!itemSubmenu) {
      return
    }
    const center = offsetLeft + offsetWidth / 2;
    hideSubmenu(subitemId);
    itemSubmenu?.style.setProperty('--left-position', `${center}px`);
    itemSubmenu?.classList.toggle('main-menu__subitem--show');
  });
})

/**** search ****/

const searchInputElement = document.querySelector('#search-input');

const getProducts = async query => {
  return fetch(
    `https://dummyjson.com/products/search?q=${query}&limit=5&delay=1000`
  )
    .then(res => res.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(err => {
      console.log(err);
    });
};
searchInputElement.addEventListener('input', async e => {
  const { value } = e.target;
  if (value.length > 3) {
    const { products } = await getProducts(value);
    const dropdownElem = document.querySelector('.input-wrapper__dropdown');
    dropdownElem.classList.add('input-wrapper__dropdown--show');
    products.forEach(({ title }) => {
      const prodElem = document.createElement('div');
      prodElem.innerHTML = title;
      prodElem.style.color = '#000';
      const searchResultsElement = document.querySelector('#search_results')
      searchResultsElement.appendChild(prodElem);
    });
    console.log({ products });
  }
});