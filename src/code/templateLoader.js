export async function loadTemplates(templateConfigs) {
  const templates = {};

  for (const { id, url } of templateConfigs) {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to load template from ${url}`);
      continue;
    }

    const html = await response.text();
    const container = document.createElement("div");
    container.innerHTML = html.trim();
    document.body.appendChild(container);
    templates[id] = document.getElementById(id);
  }

  return templates;
}
