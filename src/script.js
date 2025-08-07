import { loadTemplates } from "./code/templateLoader";
import { addList, checkUniqueListName, renderAllLists } from "./code/listsCode";
import "./scss/index.scss";
import { addListButton, newListInput } from "./code/elements";

export let templates = null;

window.addEventListener("DOMContentLoaded", async () => {
  templates = await loadTemplates([
    { id: "list-template", url: "/templates/list_template.html" },
    { id: "task-template", url: "/templates/task_template.html" },
  ]);

  initializeApp();
});

function initializeApp() {
  $("form").click((event) => event.preventDefault());

  renderAllLists();

  let newListInputValue = "";

  newListInput.on("input", (e) => {
    newListInputValue = e.target.value;
  });

  addListButton.on("click", () => {
    const trimmedValue = newListInputValue.trim();

    if (!trimmedValue) {
      alert("Input cannot be empty");
      return;
    }
    if (!checkUniqueListName(trimmedValue)) {
      alert("This name already exists");
      return;
    }

    addList(trimmedValue);
    newListInputValue = "";
    newListInput.val("");
  });
}
