document.addEventListener("DOMContentLoaded", function () {
    initializeDashboard();
    document.getElementById("exportCSV").addEventListener("click", exportToCSV);
    document.getElementById("exportPDF").addEventListener("click", exportToPDF);
    document.getElementById("refreshData").addEventListener("click", fetchLiveData);
    document.getElementById("chartTypeSelector").addEventListener("change", updateChartType);
    setInterval(fetchLiveData, 30000);
});

function initializeDashboard() {
    fetchLiveData();
}

async function fetchLiveData() {
    try {
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        updateCharts(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateCharts(data) {
    if (typeof myChart !== 'undefined') {
        myChart.data = data;
        myChart.update();
    }
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Column1,Column2\n";
    csvContent += "Value1,Value2\n";
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_data.csv");
    document.body.appendChild(link);
    link.click();
}

function exportToPDF() {
    const element = document.getElementById("dashboard");
    html2canvas(element).then((canvas) => {
        let imgData = canvas.toDataURL("image/png");
        let pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10);
        pdf.save("dashboard_report.pdf");
    });
}

function updateChartType() {
    let selectedType = document.getElementById("chartTypeSelector").value;
    if (typeof myChart !== 'undefined') {
        myChart.config.type = selectedType;
        myChart.update();
    }
}

function fetchData() {
    let apiUrl = document.getElementById("apiUrl").value;
    let dataDisplay = document.getElementById("dataDisplay");
    if (!apiUrl) {
        alert("Please enter a valid API URL!");
        return;
    }
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            dataDisplay.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            dataDisplay.textContent = "Error fetching data. Check the API URL.";
        });
}

function toggleSettings() {
    let panel = document.getElementById("settingsPanel");
    panel.classList.toggle("hidden");
}

function applySettings() {
    let title = document.getElementById("widgetTitleInput").value;
    let color = document.getElementById("widgetColor").value;
    if (title) document.getElementById("widgetTitle").textContent = title;
    document.querySelector(".widget").style.background = color;
}

let widget = document.querySelector(".resizable");
let resizer = document.querySelector(".resize-handle");

resizer.addEventListener("mousedown", function (event) {
    event.preventDefault();
    document.addEventListener("mousemove", resizeWidget);
    document.addEventListener("mouseup", stopResize);
});

function resizeWidget(event) {
    widget.style.width = event.clientX - widget.offsetLeft + "px";
    widget.style.height = event.clientY - widget.offsetTop + "px";
}

function stopResize() {
    document.removeEventListener("mousemove", resizeWidget);
    document.removeEventListener("mouseup", stopResize);
}

let intervalId = null;

function toggleAutoRefresh() {
    let autoRefresh = document.getElementById("autoRefresh").checked;
    if (autoRefresh) {
        intervalId = setInterval(fetchData, 5000);
    } else {
        clearInterval(intervalId);
    }
}

function saveDashboardLayout() {
    let widgets = document.querySelectorAll(".widget");
    let layoutData = [];

    widgets.forEach(widget => {
        layoutData.push({
            id: widget.id,
            width: widget.style.width,
            height: widget.style.height,
            top: widget.style.top,
            left: widget.style.left,
            title: widget.querySelector(".widget-title")?.textContent || "",
            color: widget.style.backgroundColor
        });
    });

    localStorage.setItem("dashboardLayout", JSON.stringify(layoutData));
}

function loadDashboardLayout() {
    let savedLayout = localStorage.getItem("dashboardLayout");

    if (savedLayout) {
        let layoutData = JSON.parse(savedLayout);
        
        layoutData.forEach(item => {
            let widget = document.getElementById(item.id);
            if (widget) {
                widget.style.width = item.width;
                widget.style.height = item.height;
                widget.style.top = item.top;
                widget.style.left = item.left;
                widget.style.backgroundColor = item.color;
                let titleElement = widget.querySelector(".widget-title");
                if (titleElement) titleElement.textContent = item.title;
            }
        });
    }
}

// Load layout when the page loads
document.addEventListener("DOMContentLoaded", loadDashboardLayout);

function resizeWidget(event) {
    widget.style.width = event.clientX - widget.offsetLeft + "px";
    widget.style.height = event.clientY - widget.offsetTop + "px";
    saveDashboardLayout();
}

function stopResize() {
    document.removeEventListener("mousemove", resizeWidget);
    document.removeEventListener("mouseup", stopResize);
    saveDashboardLayout();
}
