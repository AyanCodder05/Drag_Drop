export function exportToCSV(widgets) {
  let csv = "ID,Title\n";
  widgets.forEach((w) => {
    csv += `${w.id},${w.title}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dashboard.csv";
  link.click();
}

export function exportToPDF(widgets) {
  alert("PDF export is not yet implemented.");
}
