$(document).ready(() => {
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

  const tasksContainer = $("#tasks-container");
  const taskTemplate = $("#task-template")[0];
  const addTaskButton = $("#add-task-button");
  const newTaskInput = $("#new-task-input");

  let lists = getLists();
  let currentListIndex = null;
  const getCurrentList = () => {
    if (currentListIndex == null) return null;
    return lists[currentListIndex].list;
  };

  renderAllLists();

  function listChanged() {
    const currentList = getCurrentList();

    if (currentList == null) {
      newTaskInput.css({ display: "none" });
      addTaskButton.css({ display: "none" });
      return;
    }

    newTaskInput.css({ display: "block" });
    addTaskButton.css({ display: "block" });

    renderTasks(currentList);
  }

  // list functions
  function addList(name) {
    lists.unshift({ name, list: [] });
    renderAllLists();
    setLists(lists);
  }

  function deleteList(index) {
    lists = lists.filter((_, i) => i != index);
    renderAllLists();
    setLists(lists);
  }

  function updateListName(list, newName) {
    list.name = newName;
    setLists(lists);
  }

  function renderAllLists() {
    listsContainer.empty();

    lists.forEach((list, index) => {
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

      let isListInEditMode = false;

      $(listEditButtonElement).on("click", () => {
        isListInEditMode = !isListInEditMode;
        
        if (isListInEditMode) {
          $(listEditInputElement).val(list?.name);
          $(listEditInputElement).css({ display: "block" });
          $(listNameElement).css({ display: "none" });
        } else {
          const inputValue = $(listEditInputElement).val();
          if (inputValue) {
            updateListName(lists[index], inputValue);
          }
          $(listEditInputElement).css({ display: "none" });
          $(listNameElement).css({ display: "block" });
          renderAllLists();
        }
      });

      $(listDeleteButtonElement).on("click", () => {
        deleteList(index);
        currentListIndex = null;
        listChanged();
      });

      $(listNameElement)
        .parent()
        .on("click", () => {
          currentListIndex = index;
          listChanged();
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
    lists[currentListIndex].list = getCurrentList().filter(
      (_, i) => index != i
    );
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

    list.forEach((task, index) => {
      const taskElement = taskTemplate.content.cloneNode(true);

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
          $(descriptionElement).css({ display: "none" });
          $(editInputElement).css({ display: "block" });
          $(editInputElement).on("input", (e) => {
            editInputValue = e.target.value;
          });
        } else {
          $(descriptionElement).css({ display: "block" });
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
