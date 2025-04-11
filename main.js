import { createChart } from './chart.js';
import { saveLayout, loadLayout } from './layout.js';
import { exportToCSV, exportToPDF } from './export.js';
import { switchTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
  const addWidgetBtn = document.getElementById('add-widget');
  const saveLayoutBtn = document.getElementById('save-layout');
  const loadLayoutBtn = document.getElementById('load-layout');
  const exportCSVBtn = document.getElementById('export');
  const themeToggle = document.getElementById('theme-toggle');

  addWidgetBtn.addEventListener('click', () => {
    const dashboard = document.getElementById('dashboard');
    const widget = document.createElement('div');
    createChart(widget, {
      labels: ['A', 'B', 'C'],
      values: [10, 20, 30],
    });
    dashboard.appendChild(widget);
  });

  saveLayoutBtn.addEventListener('click', saveLayout);
  loadLayoutBtn.addEventListener('click', () => loadLayout());
  exportCSVBtn.addEventListener('click', () => exportToCSV(document.querySelectorAll('.widget')));

  themeToggle.addEventListener('click', () => {
    const theme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    switchTheme(theme);
  });
});
