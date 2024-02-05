const menuItems = document.querySelectorAll('.main-menu__item');

const hideSubmenu = currentlyClickedItem => {
  const menuSubitems = document.querySelectorAll('.main-menu__subitem');
  menuSubitems.forEach(subitem => {
    if (subitem.id !== currentlyClickedItem) {
      subitem.classList.remove('main-menu__subitem--show');
    }
  });
};
menuItems.forEach(item => {
  item.addEventListener('click', e => {
    const { id: itemId, offsetLeft, offsetWidth } = e.target;
    const subitemId = `${itemId}_submenu`;
    const itemSubmenu = document.querySelector(`#${subitemId}`);
    if (!itemSubmenu) {
      return;
    }
    const center = offsetLeft + offsetWidth / 2;
    hideSubmenu(subitemId);
    itemSubmenu?.style.setProperty('--left-position', `${center}px`);
    itemSubmenu?.classList.toggle('main-menu__subitem--show');
  });
});
