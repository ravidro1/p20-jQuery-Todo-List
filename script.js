$(document).ready(() => {
  const container = $("#list");
  const itemTemplate = $("#item-template")[0];
  const addButton = $("#add-button");
  const newTaskInput = $("#new-task-input");

  let items = getItems();
  let inputValue = "";
  refreshList();

  // Events
  newTaskInput.on("input", (e) => {
    inputValue = e.target.value;
  });

  addButton.on("click", () => {
    if (!inputValue) {
      alert("Input can not be empty");
      return;
    }
    addItem(inputValue);
    inputValue = "";
    newTaskInput.val("");
  });

  // *****************************************

  // Functions
  function setItems(list) {
    const stringifyItems = JSON.stringify(list);
    localStorage.setItem("tasks", stringifyItems);
  }

  function getItems() {
    const localItems = localStorage.getItem("tasks") || "[]";
    return JSON.parse(localItems);
  }

  function addItem(description) {
    items.unshift({
      checked: false,
      description,
    });

    setItems(items);
    refreshList();
  }

  function refreshList() {
    // sort items

    container.empty();

    items.forEach((item, index) => {
      const itemElement = itemTemplate.content.cloneNode(true);

      const checkedElement = itemElement.querySelector(".item-checkbox");
      const descriptionElement = itemElement.querySelector(".item-text");
      const editButtonElement = itemElement.querySelector(".item-edit-button");
      const deleteButtonElement = itemElement.querySelector(
        ".item-delete-button"
      );

      checkedElement.checked = item.checked;
      descriptionElement.innerText = item.description;

      checkedElement.onchange = (e) => {
        const isChecked = e.target.checked;
        updateDate(item, "checked", isChecked);
      };

      editButtonElement.onclick = () => {
        editItem();
      };

      deleteButtonElement.onclick = () => {
        deleteItem(index);
      };

      container.append(itemElement);
    });
  }

  function deleteItem(index) {
    items = items.filter((_, i) => index != i);
    setItems(items);
    refreshList();
  }

  function editItem(item) {
    descriptionElement.innerHTML = 0;
    updateDate(item, "", "");
  }

  function updateDate(item, key, value) {
    item[key] = value;
    setItems(items);
    refreshList();
  }

  // *****************************************
});
