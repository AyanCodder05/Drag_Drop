export function createChart(container, data) {
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Example Chart",
          data: data.values,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderRadius: 5,
        },
      ],
    },
  });
}
