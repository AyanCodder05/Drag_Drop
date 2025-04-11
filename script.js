document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-widget").addEventListener("click", addWidget);
  document.getElementById("save-layout").addEventListener("click", saveLayout);
  document.getElementById("load-layout").addEventListener("click", loadLayout);
});

let widgetCount = 0;

function addWidget(widgetData = null) {
  const dashboard = document.getElementById("dashboard");
  const widget = document.createElement("div");
  widget.classList.add("widget");
  widget.id = widgetData?.id || `widget-${++widgetCount}`;

  widget.innerHTML = `
    <div class="widget-header">
      <span class="widget-title" contenteditable="true">${widgetData?.title || `Widget ${widgetCount}`}</span>
      <button class="remove-widget">✖</button>
    </div>
    <div class="widget-body">
      <input type="text" class="apiUrl" placeholder="Enter API URL" value="${widgetData?.apiUrl || ''}" />
      <select class="chartType">
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
      </select>
      <button class="loadData">Load Data</button>
      <canvas></canvas>
      <div class="dataDisplay">${widgetData?.content || ''}</div>
    </div>
  `;

  dashboard.appendChild(widget);

  if (widgetData?.chartType) {
    widget.querySelector(".chartType").value = widgetData.chartType;
  }

  initializeWidget(widget);
}

function initializeWidget(widget) {
  widget.querySelector(".remove-widget").addEventListener("click", () => {
    widget.remove();
  });

  widget.querySelector(".loadData").addEventListener("click", async () => {
    const apiUrl = widget.querySelector(".apiUrl").value;
    const chartType = widget.querySelector(".chartType").value;
    const canvas = widget.querySelector("canvas");

    if (!apiUrl) {
      alert("Please enter a valid API URL");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ apiUrl })
      });

      const data = await response.json();

      const labels = Object.keys(data.bpi || data);
      const values = Object.values(data.bpi || data).map(val =>
        typeof val === "object" ? val.rate_float || val.value : val
      );

      const chartData = {
        labels,
        datasets: [{
          label: "Data",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }]
      };

      new Chart(canvas, {
        type: chartType,
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });

      widget.querySelector(".dataDisplay").innerText = JSON.stringify(data, null, 2);

    } catch (err) {
      console.error("Error loading API:", err);
      alert("Failed to fetch API data.");
    }
  });
}

async function saveLayout() {
  const widgets = document.querySelectorAll(".widget");
  const layout = Array.from(widgets).map(widget => ({
    id: widget.id,
    title: widget.querySelector(".widget-title")?.innerText || "Untitled",
    apiUrl: widget.querySelector(".apiUrl")?.value || "",
    chartType: widget.querySelector(".chartType")?.value || "bar",
    content: widget.querySelector(".dataDisplay")?.innerHTML || ""
  }));

  const userId = "ayan123";

  try {
    const response = await fetch("http://localhost:5000/api/saveLayout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, layout })
    });

    const result = await response.json();
    alert(result.message || "✅ Layout saved!");
  } catch (err) {
    console.error("❌ Save error:", err);
    alert("❌ Failed to save layout");
  }
}

async function loadLayout() {
  try {
    const response = await fetch("http://localhost:5000/api/loadLayout");
    const result = await response.json();
    const layout = result.layout || [];

    layout.forEach(widgetData => addWidget(widgetData));
  } catch (err) {
    console.error("❌ Load error:", err);
    alert("❌ Failed to load layout");
  }
}

// Handle widget remove with X button
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('remove-btn')) {
    const widget = e.target.closest('.widget');
    widget.remove();
    saveLayout();
  }
});

// Drag-and-drop logic
let draggedWidget = null;

document.addEventListener("dragstart", function (e) {
  if (e.target.classList.contains("widget")) {
    draggedWidget = e.target;
  }
});

document.addEventListener("dragover", function (e) {
  e.preventDefault();
});

document.addEventListener("drop", function (e) {
  if (draggedWidget && e.target.classList.contains("widget")) {
    const dashboard = document.getElementById("dashboard");
    dashboard.insertBefore(draggedWidget, e.target);
    saveLayout();
  }
});

// Help modal (optional)
const helpBtn = document.getElementById("helpBtn");
if (helpBtn) {
  helpBtn.onclick = () => {
    document.getElementById("helpModal").style.display = 'block';
  };
}
