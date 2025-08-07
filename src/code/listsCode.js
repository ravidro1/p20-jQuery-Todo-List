import { templates } from "../script";
import { listNameHeadlineInTasksSection, listsContainer } from "./elements";
import { getLists, setLists } from "./localStorage_functions";
import { addTaskButton, newTaskInput, renderTasks } from "./taskCode";

let lists = getLists();
let currentListID = null;
let currentListElement = null;
let idCount = getIdCount();

// Helpers
function getCurrentListObject() {
  return currentListID != null
    ? lists.find((list) => list.id === currentListID)
    : null;
}

function getTaskOfCurrentList() {
  const obj = getCurrentListObject();
  return obj ? obj.listOfTask : null;
}

function getIdCount() {
  return Math.max(0, ...lists.map((l) => l.id + 1));
}

function checkUniqueListName(name) {
  return !lists.some((list) => list.name === name);
}

// Core Actions
function addList(name) {
  lists.unshift({ name, listOfTask: [], id: idCount++ });
  updateAndRender();
}

function deleteList(id) {
  lists = lists.filter((list) => list.id !== id);
  currentListID = null;
  updateAndRender();
  renderTasks(null);
}

function updateListName(list, newName) {
  list.name = newName;
  updateAndRender();
  listChanged(null);
}

// UI Updates
function listChanged(element) {
  const taskOfCurrentList = getTaskOfCurrentList();
  const listObject = getCurrentListObject();

  if (!currentListID) {
    newTaskInput.hide();
    addTaskButton.hide();
    listNameHeadlineInTasksSection.text("");
    return;
  }

  newTaskInput.show();
  addTaskButton.show();

  listsContainer.children().css({ backgroundColor: "" });
  element?.css({ backgroundColor: "#EEEEEE" });
  element?.find(".list-text").css({ color: "#000" });

  listNameHeadlineInTasksSection.text(listObject.name);
  renderTasks(taskOfCurrentList);
}

function updateAndRender() {
  setLists(lists);
  renderAllLists();
}

// Rendering
let currentEditInput = null;
let currentEditNameEl = null;

function renderAllLists() {
  listsContainer.empty();

  lists.forEach((list) => {
    const clone = templates["list-template"].content.cloneNode(true);

    const inputEl = clone.querySelector(".list-edit-input");
    const nameEl = clone.querySelector(".list-text");
    const editBtn = clone.querySelector(".list-edit-button");
    const deleteBtn = clone.querySelector(".list-delete-button");

    nameEl.innerText = list.name;
    const listEl = $(nameEl).parent();

    // === EDIT BUTTON ===
    $(editBtn).on("click", (e) => {
      e.stopPropagation();

      if (currentEditInput != inputEl) {
        // Close other open edit
        if (currentEditInput && currentEditNameEl) {
          $(currentEditInput).hide();
          $(currentEditNameEl).show();
        }

        $(inputEl).val(list.name).show().focus();
        $(nameEl).hide();

        currentEditInput = inputEl;
        currentEditNameEl = nameEl;
      } else {
        const newName = $(inputEl).val().trim();
        if (newName && newName !== list.name) {
          if (checkUniqueListName(newName)) {
            updateListName(list, newName);
          } else {
            alert("This name is already in use.");
          }
        }

        $(inputEl).hide();
        $(nameEl).show();
        currentEditInput = null;
        currentEditNameEl = null;
        renderAllLists();
        return;
      }
    });

    // === DELETE BUTTON ===
    $(deleteBtn).on("click", (e) => {
      e.stopPropagation();
      deleteList(list.id);
      listChanged(listEl);
    });

    // === SELECT LIST (CLICK) ===
    listEl.on("click", () => {
      // Exit any active edit mode
      if (currentEditInput && currentEditNameEl) {
        $(currentEditInput).hide();
        $(currentEditNameEl).show();
        currentEditInput = null;
        currentEditNameEl = null;
      }

      // Reset previous styles
      if (currentListElement && currentListID !== list.id) {
        currentListElement.css({ backgroundColor: "" });
        currentListElement.find(".list-text").css({ color: "" });
      }

      listEl.css({ backgroundColor: "#EEEEEE" });
      $(nameEl).css({ color: "#000" });

      currentListID = list.id;
      currentListElement = listEl;

      listChanged(listEl);
    });

    // Keep highlight if currently selected
    if (currentListID === list.id) {
      listEl.css({ backgroundColor: "#EEEEEE" });
      $(nameEl).css({ color: "#000" });
      currentListElement = listEl;
    }

    listsContainer.append(listEl);
  });
}

export {
  getIdCount,
  checkUniqueListName,
  addList,
  deleteList,
  updateListName,
  renderAllLists,
  getTaskOfCurrentList,
  lists,
};
