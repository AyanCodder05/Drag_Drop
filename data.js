export async function fetchLiveCryptoPrice(symbol = "bitcoin") {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = await res.json();
    return `$${data[symbol].usd}`;
  } catch (err) {
    console.error("API Fetch failed:", err);
    return "Unavailable";
  }
}

async function loadWeather(widget) {
  const res = await fetch('https://api.weatherapi.com/v1/current.json?key=API_KEY&q=London');
  const data = await res.json();
  widget.querySelector('.widget-body').innerText = `Temp: ${data.current.temp_c}°C`;
}
