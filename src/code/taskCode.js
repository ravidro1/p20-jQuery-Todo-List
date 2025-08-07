import { templates } from "../script";
import {
  addTaskButton,
  newTaskInput,
  tasksContainer,
  taskTemplate,
} from "./elements";
import { getTaskOfCurrentList, lists } from "./listsCode";
import { setLists } from "./localStorage_functions";

// task functions
function addTask(description) {
  const taskOfCurrentList = getTaskOfCurrentList();
  taskOfCurrentList.unshift({
    checked: false,
    description,
  });

  setLists(lists);
  renderTasks(taskOfCurrentList);
}

function deleteTask(index) {
  lists.find((list) => list.id == currentListID).list =
    getTaskOfCurrentList().filter((_, i) => index != i);

  setLists(lists);
  renderTasks(getTaskOfCurrentList());
}

function updateTask(task, key, value) {
  task[key] = value;
  setLists(lists);
  renderTasks(getTaskOfCurrentList());
}

function renderTasks(list) {
  tasksContainer.empty();

  if (list == null) return;

  list.forEach((task, index) => {
    const taskElement = templates["task-template"].content.cloneNode(true);

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

export {
  addTask,
  deleteTask,
  updateTask,
  renderTasks,
  newTaskInput,
  addTaskButton,
  taskTemplate,
  tasksContainer,
};
