'use strict';

const formElement = document.getElementById('item-form');
const inputElement = document.getElementById('item-input');
const listElement = document.getElementById('item-list');
const clearButtonElement = document.getElementById('clear');
const filterElement = document.getElementById('filter');
const submitButtonElement = formElement.querySelector('button');
let isEditing = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  updateUI();
}

function onAddItemSubmit(event) {
  event.preventDefault();

  const newItem = inputElement.value.trim();

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Check for edit mode
  if (isEditing) {
    const itemToEdit = listElement.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditing = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  updateUI();

  inputElement.value = '';
}

function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  listElement.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(event) {
  if (event.target.parentElement.classList.contains('remove-item')) {
    removeItem(event.target.parentElement.parentElement);
  } else if (event.target.tagName === 'LI') {
    setItemToEdit(event.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditing = true;

  listElement
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  submitButtonElement.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  submitButtonElement.style.backgroundColor = '#228B22';
  inputElement.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);

    updateUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (listElement.firstChild) {
    listElement.removeChild(listElement.firstChild);
  }

  // Clear from localStorage
  localStorage.removeItem('items');

  updateUI();
}

function filterItems(event) {
  const items = listElement.querySelectorAll('li');
  const text = event.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function updateUI() {
  inputElement.value = '';

  const items = listElement.querySelectorAll('li');

  if (items.length === 0) {
    clearButtonElement.style.display = 'none';
    filterElement.style.display = 'none';
  } else {
    clearButtonElement.style.display = 'block';
    filterElement.style.display = 'block';
  }

  submitButtonElement.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  submitButtonElement.style.backgroundColor = '#333';

  isEditing = false;
}

// Initialize app
function init() {
  // Event Listeners
  formElement.addEventListener('submit', onAddItemSubmit);
  listElement.addEventListener('click', onClickItem);
  clearButtonElement.addEventListener('click', clearItems);
  filterElement.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  updateUI();
}

init();
