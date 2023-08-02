$(document).ready(() => {
  const container = $("#list-container");
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
      const editInputElement = itemElement.querySelector(".item-edit-input");
      const editButtonElement = itemElement.querySelector(".item-edit-button");
      const deleteButtonElement = itemElement.querySelector(
        ".item-delete-button"
      );

      checkedElement.checked = item.checked;
      descriptionElement.innerText = item.description;

      checkedElement.onchange = (e) => {
        const isChecked = e.target.checked;
        updateItem(item, "checked", isChecked);
      };

      let isInEditMode = false;
      let editInputValue = "";

      editButtonElement.onclick = () => {
        isInEditMode = !isInEditMode;

        if (isInEditMode) {
          $(descriptionElement).css({ display: "none" });
          $(editInputElement).css({ display: "block" });
          $(editInputElement).on("input", (e) => {
            editInputValue = e.target.value;
          });
        } else {
          $(descriptionElement).css({ display: "block" });
          $(editInputElement).css({ display: "none" });
          if (editInputValue) {
            updateItem(item, "description", editInputValue);
          }

          editInputValue = "";
          $(editInputElement).empty();
        }

        $(editInputElement).val(item.description);
        console.log(isInEditMode);
      };

      deleteButtonElement.onclick = () => {
        deleteItem(index);
      };

      if (item.checked) {
        $(descriptionElement).css({ "text-decoration-line": "line-through" });
      }

      container.append(itemElement);
    });
  }

  function deleteItem(index) {
    items = items.filter((_, i) => index != i);
    setItems(items);
    refreshList();
  }

  function editItem(item) {
    updateItem(item, "", "");
  }

  function updateItem(item, key, value) {
    item[key] = value;
    setItems(items);
    refreshList();
  }

  // *****************************************
});
