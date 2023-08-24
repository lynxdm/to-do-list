// select elements
const themeBtn = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-toggle i");
const alertText = document.querySelector(".alert");
const form = document.querySelector(".todo-form");
const inputText = document.querySelector(".form-text");
const submitBtn = document.querySelector(".submit-btn");
const listContainer = document.querySelector(".list-container");
const clearBtn = document.querySelector(".clear-btn");

// setting default
let editFlag = false;
let editID = "";
let id = "";
let editElement = "";

//***********EVENT LISTENERS*********
// theme toggle
let theme = localStorage.getItem("dark-theme");
if (theme) {
  document.body.classList.add("dark-theme");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}

themeBtn.addEventListener("click", () => {
  // add theme class to body
  document.body.classList.toggle("dark-theme");
  //   check current theme class to change icon
  if (document.body.classList.contains("dark-theme")) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    localStorage.setItem("dark-theme", "dark");
  } else {
    themeIcon.classList.add("fa-moon");
    themeIcon.classList.remove("fa-sun");
    localStorage.removeItem("dark-theme");
  }
});

// setting up items
window.addEventListener("DOMContentLoaded", () => {
  let list = getStorage();
  if (list.length > 0) {
    list.forEach((item) => {
      createListItem(item.id, item.value);
    });
    clearBtn.style.visibility = "visible";
    setTimeout(() => {
      displayAlert("green", "items retrieved");
    }, 100);
  }
});

// form action
form.addEventListener("submit", (e) => {
  e.preventDefault();
  value = inputText.value;
  id = new Date().getTime().toString();
  if (value && !editFlag) {
    // add to list
    createListItem(id, value);
    // display alert
    displayAlert("green", "item added successfully");
    clearBtn.style.visibility = "visible";
    addToStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editStorage(editID, value);
    editListItem(value);
    displayAlert("green", "item edited");
    setBackToDefault();
  }
});

// clearing all
clearBtn.addEventListener("click", () => {
  localStorage.removeItem("list");
  displayAlert("red", "items cleared");
  listContainer.innerHTML = "";
  clearBtn.style.visibility = "hidden";
});

// ****STORAGE FUNCTIONS*******
const addToStorage = (id, value) => {
  let list = getStorage();
  list.push({ id: id, value: value });
  localStorage.setItem("list", JSON.stringify(list));
};

const getStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

const editStorage = (editID, edited) => {
  let list = getStorage();
  list.forEach((item) => {
    if (item.id == editID) {
      console.log(item);
      item.value = edited;
    }
  });
  localStorage.setItem("list", JSON.stringify(list));
};
// ********FUNCTIONS**********
const createListItem = (id, value) => {
  // console.log(id);
  let element = document.createElement("article");
  element.dataset.id = id;
  element.classList.add("todo-list");
  element.innerHTML = `<p class="list-title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
              Edit</button>
              <button type="button" class="delete-btn">
              Delete</button>
            </div>`;

  listContainer.append(element);
  // selecting buttons
  creatListBtns(element, id);
};

const editListItem = (value) => {
  editElement.innerHTML = `<p class="list-title">${value}</p>`;
};

const creatListBtns = (element, id) => {
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  // deleting each item
  deleteBtn.addEventListener("click", () => {
    element.remove();
    let list = getStorage();
    list = list.filter((item) => {
      if (item.id !== id) return item;
    });
    localStorage.setItem("list", JSON.stringify(list));
    if (!listContainer.innerHTML) {
      clearBtn.style.visibility = "hidden";
    }
    displayAlert("red", "item deleted");
  });
  // editing items
  editBtn.addEventListener("click", (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    submitBtn.textContent = "Edit";
    inputText.value = editElement.textContent;
    editFlag = true;
    editID = element.dataset.id;
    console.log(editID);
  });
};

const displayAlert = (alert, text) => {
  alertText.classList.add(`alert-${alert}`);
  alertText.textContent = text;
  setTimeout(() => {
    alertText.classList.remove(`alert-${alert}`);
  }, 1000);
};

const setBackToDefault = () => {
  editFlag = false;
  editID = "";
  editElement = "";
  inputText.value = "";
  id = "";
  submitBtn.textContent = "Append";
};
