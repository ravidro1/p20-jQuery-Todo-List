$(document).ready(() => {
  const tasksContainer = $("#tasks-container");
  const itemTemplate = $("#item-template")[0];
  const addTaskButton = $("#add-task-button");
  const newTaskInput = $("#new-task-input");

  const listsContainer = $("#lists-container");
  const listTemplate = $("#list-template")[0];
  const addListButton = $("#add-list-button");
  const newListInput = $("#new-list-input");

  let lists = getLists();
  //   refreshList();

  // localStorage functions
  function setLists(arg_lists) {
    const stringifyLists = JSON.stringify(arg_lists);
    localStorage.setItem("lists", stringifyLists);
  }

  function getLists() {
    const localItems = localStorage.getItem("lists") || "[]";
    return JSON.parse(localItems);
  }

  // task functions
  //   function addItem(description) {
  //     items.unshift({
  //       checked: false,
  //       description,
  //     });

  //     setItems(items);
  //     refreshList();
  //   }

  //   function deleteItem(index) {
  //     items = items.filter((_, i) => index != i);
  //     setItems(items);
  //     refreshList();
  //   }

  //   function updateItem(item, key, value) {
  //     item[key] = value;
  //     setItems(items);
  //     refreshList();
  //   }

  //   function refreshList() {
  //     tasksContainer.empty();

  //     items.forEach((item, index) => {
  //       const itemElement = itemTemplate.content.cloneNode(true);

  //       const checkedElement = itemElement.querySelector(".item-checkbox");
  //       const descriptionElement = itemElement.querySelector(".item-text");
  //       const editInputElement = itemElement.querySelector(".item-edit-input");
  //       const editButtonElement = itemElement.querySelector(".item-edit-button");
  //       const deleteButtonElement = itemElement.querySelector(
  //         ".item-delete-button"
  //       );

  //       checkedElement.checked = item.checked;
  //       descriptionElement.innerText = item.description;

  //       checkedElement.onchange = (e) => {
  //         const isChecked = e.target.checked;
  //         updateItem(item, "checked", isChecked);
  //       };

  //       let isInEditMode = false;
  //       let editInputValue = "";

  //       editButtonElement.onclick = () => {
  //         isInEditMode = !isInEditMode;

  //         if (isInEditMode) {
  //           $(descriptionElement).css({ display: "none" });
  //           $(editInputElement).css({ display: "block" });
  //           $(editInputElement).on("input", (e) => {
  //             editInputValue = e.target.value;
  //           });
  //         } else {
  //           $(descriptionElement).css({ display: "block" });
  //           $(editInputElement).css({ display: "none" });
  //           if (editInputValue) {
  //             updateItem(item, "description", editInputValue);
  //           }

  //           editInputValue = "";
  //           $(editInputElement).empty();
  //         }

  //         $(editInputElement).val(item.description);
  //         console.log(isInEditMode);
  //       };

  //       deleteButtonElement.onclick = () => {
  //         deleteItem(index);
  //       };

  //       if (item.checked) {
  //         $(descriptionElement).css({ "text-decoration-line": "line-through" });
  //       }

  //       tasksContainer.append(itemElement);
  //     });
  //   }

  // *****************************************

  // tasks Events
  let newTaskInputValue = "";

  newTaskInput.on("input", (e) => {
    newTaskInputValue = e.target.value;
  });

  addTaskButton.on("click", () => {
    if (!newTaskInputValue) {
      alert("Input can not be empty");
      return;
    }
    addItem(newTaskInputValue);
    newTaskInputValue = "";
    newTaskInput.val("");
  });
  // *****************************************

  // list functions

  function addList(name) {
    // add temp
    // add localhost
    // render
    lists.unshift({ name, list: [] });
    setLists(lists);
  }
  function deleteList() {}
  function editList() {}

  function renderAllLists() {
    listsContainer.empty();
    lists.forEach((list) => {
      const listElement = listTemplate.content.cloneNode(true);

      const listEditInputElement =
        listElement.querySelector(".list-edit-input");

      const listNameElement = listElement.querySelector(".list-text");

      const listEditButtonElement =
        listElement.querySelector(".list-edit-button");

      const listDeleteButtonElement = listElement.querySelector(
        ".list-delete-button"
      );
      listNameElement.innerText = list?.name;

      $(listElement).on("click", () => {});

      listsContainer.append(listElement);
    });
  }
  // *****************************************

  // lists Events
  let newListInputValue = "";
  newListInput.on("input", (e) => {
    newListInputValue = e.target.value;
  });

  addListButton.on("click", () => {
    if (!newListInputValue) {
      alert("Input can not be empty");
      return;
    }
    addList(newListInputValue);
    newListInputValue = "";
    newListInput.val("");
  });

  // *****************************************

  // const listsContainer = $("#lists-container");
  // const listTemplate = $("#list-template")[0];
  // const addListButton = $("#add-list-button");
  // const newListInput = $("#new-list-input");

  renderAllLists();
});
