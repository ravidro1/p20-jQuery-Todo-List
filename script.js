$(document).ready(() => {
  $("form").click((event) => {
    event.preventDefault();
  });

  // localStorage functions
  function setLists(arg_lists) {
    const stringifyLists = JSON.stringify(arg_lists);
    localStorage.setItem("lists", stringifyLists);
  }

  function getLists() {
    const localItems = localStorage.getItem("lists") || "[]";
    return JSON.parse(localItems);
  }

  const listsContainer = $("#lists-container");
  const listTemplate = $("#list-template")[0];
  const addListButton = $("#add-list-button");
  const newListInput = $("#new-list-input");

  const listNameHeadlineInTasksSection = $(
    "#list-name-headline-in-tasks-section"
  );
  const tasksContainer = $("#tasks-container");
  const taskTemplate = $("#task-template")[0];
  const addTaskButton = $("#add-task-button");
  const newTaskInput = $("#new-task-input");

  let lists = getLists();
  let currentListID = null;

  const getCurrentListObject = () => {
    if (currentListID == null) return null;
    return lists.find((list) => list.id == currentListID);
  };
  const getCurrentList = () => {
    if (currentListID == null) return null;
    return lists.find((list) => list.id == currentListID).list;
  };

  function getIdCount() {
    let tempIdCount = 0;
    lists.forEach((list) => {
      if (list.id > tempIdCount) tempIdCount = list.id + 1;
    });

    return tempIdCount;
  }
  let idCount = getIdCount();

  renderAllLists();

  function listChanged(listElement) {
    const currentList = getCurrentList();
    const currentListObject = getCurrentListObject();

    if (currentList == null) {
      newTaskInput.css({ display: "none" });
      addTaskButton.css({ display: "none" });
      listNameHeadlineInTasksSection.text("");
      return;
    }

    newTaskInput.css({ display: "block" });
    addTaskButton.css({ display: "block" });

    listsContainer.children().each((_, element) => {
      $(element).css({ backgroundColor: "" });
    });

    listElement.css({ backgroundColor: "#EEEEEE" });

    listNameHeadlineInTasksSection.text(currentListObject.name);

    renderTasks(currentList);
  }

  // list functions
  function checkUniqueListName(name) {
    let isUnique = true;
    lists.forEach((list) => {
      if (name == list.name) isUnique = false;
    });

    return isUnique;
  }

  function addList(name) {
    lists.unshift({ name, list: [], id: idCount++ });
    renderAllLists();
    setLists(lists);
  }

  function deleteList(listID) {
    lists = lists.filter((list) => list.id != listID);
    currentListID = null;
    renderAllLists();
    setLists(lists);
    renderTasks(null);
  }

  function updateListName(list, newName) {
    list.name = newName;
    setLists(lists);
  }

  function renderAllLists() {
    listsContainer.empty();

    lists.forEach((list) => {
      const listElementClone = listTemplate.content.cloneNode(true);

      const listEditInputElement =
        listElementClone.querySelector(".list-edit-input");

      const listNameElement = listElementClone.querySelector(".list-text");

      const listEditButtonElement =
        listElementClone.querySelector(".list-edit-button");

      const listDeleteButtonElement = listElementClone.querySelector(
        ".list-delete-button"
      );

      listNameElement.innerText = list?.name;
      const listElement = $(listNameElement).parent();

      let isListInEditMode = false;

      $(listEditButtonElement).on("click", () => {
        isListInEditMode = !isListInEditMode;

        if (isListInEditMode) {
          $(listEditInputElement).val(list?.name);
          $(listEditInputElement).css({ display: "block" });
          $(listNameElement).css({ display: "none" });
          $(listEditInputElement).focus();
        } else {
          const inputValue = $(listEditInputElement).val();
          if (inputValue) {
            if (!checkUniqueListName(inputValue)) {
              alert("This name already in use");
            } else {
              updateListName(list, inputValue);
            }
          }
          $(listEditInputElement).css({ display: "none" });
          $(listNameElement).css({ display: "block" });
          renderAllLists();
        }
      });

      $(listDeleteButtonElement).on("click", () => {
        deleteList(list.id);
        listChanged(listElement);
      });

      if (currentListID == list.id)
        listElement.css({ backgroundColor: "#EEEEEE" });

      listElement.on("click", () => {
        currentListID = list.id;
        listChanged(listElement);
      });

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
    } else if (!checkUniqueListName(newListInputValue)) {
      alert("This name already in use");
      return;
    }
    addList(newListInputValue);
    newListInputValue = "";
    newListInput.val("");
  });

  // *****************************************

  // task functions
  function addTask(description) {
    const currentList = getCurrentList();
    currentList.unshift({
      checked: false,
      description,
    });

    setLists(lists);
    renderTasks(currentList);
  }

  function deleteTask(index) {
    lists.find((list) => list.id == currentListID).list =
      getCurrentList().filter((_, i) => index != i);

    setLists(lists);
    renderTasks(getCurrentList());
  }

  function updateTask(task, key, value) {
    task[key] = value;
    setLists(lists);
    renderTasks(getCurrentList());
  }

  function renderTasks(list) {
    tasksContainer.empty();

    if (list == null) return;

    list.forEach((task, index) => {
      const taskElement = taskTemplate.content.cloneNode(true);

      const descriptionContainerElement = taskElement.querySelector(
        ".description-container"
      );
      const checkedElement = taskElement.querySelector(".task-checkbox");
      const descriptionElement = taskElement.querySelector(".task-text");

      const editInputElement = taskElement.querySelector(".task-edit-input");
      const editButtonElement = taskElement.querySelector(".task-edit-button");
      const deleteButtonElement = taskElement.querySelector(
        ".task-delete-button"
      );

      checkedElement.checked = task.checked;
      descriptionElement.innerText = task.description;

      checkedElement.onchange = (e) => {
        const isChecked = e.target.checked;
        updateTask(task, "checked", isChecked);
      };

      let isInEditMode = false;
      let editInputValue = "";

      editButtonElement.onclick = () => {
        isInEditMode = !isInEditMode;

        if (isInEditMode) {
          // $(descriptionElement).css({ display: "none" });
          // $(checkedElement).css({ display: "none" });
          $(descriptionContainerElement).css({ display: "none" });
          $(editInputElement).css({ display: "block" });
          $(editInputElement).on("input", (e) => {
            editInputValue = e.target.value;
          });
        } else {
          // $(descriptionElement).css({ display: "block" });
          // $(checkedElement).css({ display: "block" });
          $(descriptionContainerElement).css({ display: "" });
          $(editInputElement).css({ display: "none" });
          if (editInputValue) {
            updateTask(task, "description", editInputValue);
          }

          editInputValue = "";
          $(editInputElement).empty();
        }

        $(editInputElement).val(task.description);
        console.log(isInEditMode);
      };

      deleteButtonElement.onclick = () => {
        deleteTask(index);
      };

      if (task.checked) {
        $(descriptionElement).css({ "text-decoration-line": "line-through" });
      }

      tasksContainer.append(taskElement);
    });
  }

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
    addTask(newTaskInputValue);
    newTaskInputValue = "";
    newTaskInput.val("");
  });
  // *****************************************
});
