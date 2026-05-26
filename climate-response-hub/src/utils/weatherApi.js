function riskFromFeelsLike(feelsLike) {
  if (feelsLike >= 42) return 95;
  if (feelsLike >= 38) return 85;
  if (feelsLike >= 34) return 70;
  if (feelsLike >= 30) return 55;
  if (feelsLike >= 25) return 40;
  return 25;
}

export async function getCurrentWeatherRisk(lat, lng) {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}` +
      `&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature` +
      `&timezone=America%2FToronto`;

    const response = await fetch(url);
    const data = await response.json();
    return riskFromFeelsLike(data.current?.apparent_temperature);
  } catch (error) {
    console.error("Current weather API error:", error);
    return 50;
  }
}

export async function getForecastRisk(lat, lng, hoursAhead = 12) {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}` +
      `&longitude=${lng}` +
      `&hourly=temperature_2m,relative_humidity_2m,apparent_temperature` +
      `&timezone=America%2FToronto`;

    const response = await fetch(url);
    const data = await response.json();
    return riskFromFeelsLike(data.hourly?.apparent_temperature?.[hoursAhead]);
  } catch (error) {
    console.error("Forecast weather API error:", error);
    return 50;
  }
}

export async function getDemoWeatherRisk(mode) {
  return mode === "current" ? 25 : 95;
}
