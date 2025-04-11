export async function saveLayout(widgets) {
  try {
    await fetch("http://localhost:5000/api/saveLayout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layout: widgets }),
    });
    alert("Layout saved!");
  } catch (err) {
    console.error("Save failed:", err);
  }
}

export async function loadLayout() {
  try {
    const res = await fetch("http://localhost:5000/api/loadLayout");
    const data = await res.json();
    return data.layout || [];
  } catch (err) {
    console.error("Load failed:", err);
    return [];
  }
}

// Local fallback versions (renamed)
export function saveLayoutToLocal() {
  const widgets = [...document.querySelectorAll('.widget')].map(w => w.innerHTML);
  localStorage.setItem('dashboardLayout', JSON.stringify(widgets));
}

export function loadLayoutFromLocal() {
  const container = document.querySelector('#dashboard');
  const saved = JSON.parse(localStorage.getItem('dashboardLayout') || '[]');
  saved.forEach(html => {
    const div = document.createElement('div');
    div.className = 'widget';
    div.innerHTML = html;
    container.appendChild(div);
  });
}
