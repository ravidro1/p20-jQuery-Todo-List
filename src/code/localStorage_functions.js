// localStorage functions
function setLists(arg_lists) {
  const stringifyLists = JSON.stringify(arg_lists);
  localStorage.setItem("lists", stringifyLists);
}

function getLists() {
  const localItems = localStorage.getItem("lists") || "[]";
  return JSON.parse(localItems);
}

export { setLists, getLists };
