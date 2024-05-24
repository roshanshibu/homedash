const DateFromTZ = () => {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: config.timezone })
  );
};
const setTimeAndDate = () => {
  let now = DateFromTZ();
  let timeText = now.toLocaleString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });
  let dateArray = now.toDateString().split(" ");
  let dateText = `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`;

  const timeAndDate = document.getElementsByClassName("timeAndDate")[0];
  timeAndDate.children[0].innerHTML = timeText;
  timeAndDate.children[1].innerHTML = dateText;
};

const refreshCalendar = () => {
  const calendar = document.getElementsByClassName("calendar")[0].children[1];
  Array.from(calendar.children).forEach((child, index) => {
    if (index >= 7) calendar.removeChild(child);
  });
  let now = DateFromTZ();
  let numberOfDays = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  let firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  for (i = 1; i < firstDay; i++) {
    calendar.innerHTML += `<p></p>`;
  }
  for (i = 1; i <= numberOfDays; i++) {
    calendar.innerHTML += `<p${
      i == now.toDateString().split(" ")[2] ? " class='today'" : ""
    }>${i}</p>`;
  }
};

const refreshWeather = () => {
  let weatherDescription = "";
  let currentTemperature = "";
  let feelsLikeTemperature = "";
  let city = "";
  const weather = document.getElementsByClassName("weather")[0];
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${config.lat}&lon=${config.lon}&appid=${config.apiKey}&units=metric`
  ).then((res) =>
    res.json().then((data) => {
      weatherDescription = data.weather[0].description;
      currentTemperature = data.main.temp;
      feelsLikeTemperature = data.main.feels_like;
      city = data.name;
      weather.children[0].innerHTML = weatherDescription;
      weather.children[1].innerHTML = `Feels like ${~~feelsLikeTemperature}°C in ${city}`;
    })
  );
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${config.lat}&longitude=${config.lon}&hourly=temperature_2m,precipitation_probability&forecast_days=1`
  ).then((res) =>
    res.json().then((data) => {
      console.log(data);
      let nowHour24 = DateFromTZ().getHours();
      let lowerLimit = nowHour24 - 6;
      let upperLimit;
      if (lowerLimit < 0) {
        upperLimit = nowHour24 + 6 + (lowerLimit < 0 ? -lowerLimit - 1 : 0);
      } else {
        upperLimit = nowHour24 + 5;
      }
      if (upperLimit > 23) {
        let diff = upperLimit - 23;
        upperLimit = 23;
        lowerLimit -= diff;
      }
      lowerLimit = lowerLimit < 0 ? 0 : lowerLimit;

      const temperatureBars =
        document.getElementsByClassName("temperatureBars")[0];
      const precipitationBars =
        document.getElementsByClassName("precipitationBars")[0];
      temperatureBars.innerHTML = "";
      precipitationBars.innerHTML = "";

      temps = [];
      let maxTemp = data.hourly.temperature_2m[lowerLimit];
      let currentTempIndex = 0;
      for (i = lowerLimit; i <= upperLimit; i++) {
        temps.push(data.hourly.temperature_2m[i]);
        if (data.hourly.temperature_2m[i] > maxTemp)
          maxTemp = data.hourly.temperature_2m[i];
        if (i == nowHour24) currentTempIndex = temps.length - 1;
        console.log(i, data.hourly.precipitation_probability[i]);
        precipitationBars.innerHTML += `<div style="height: ${
          data.hourly.precipitation_probability[i]
        }%;">${
          i == nowHour24
            ? `<p>${data.hourly.precipitation_probability[i]}%</p>`
            : ""
        }</div>`;
      }

      for (i = 0; i < temps.length; i++) {
        temperatureBars.innerHTML += `<div style="height: ${
          (temps[i] / maxTemp) * 100
        }%;">${i == currentTempIndex ? `<p>${temps[i]}°</p>` : ""}</div>`;
      }

      const convert24hTo12h = (hour) => {
        if (hour > 12) return `${hour - 12}pm`;
        else if (hour == 0) return `12am`;
        else return `${hour}am`;
      };
      const timeAxis = document.getElementsByClassName("timeAxis")[0];
      timeAxis.children[0].innerHTML = convert24hTo12h(lowerLimit);
      timeAxis.children[1].innerHTML = convert24hTo12h(lowerLimit + 5);
      timeAxis.children[2].innerHTML = convert24hTo12h(upperLimit);
    })
  );
};

setTimeAndDate();
refreshCalendar();
refreshWeather();

const tenSeconds = 10000;
setInterval(() => {
  setTimeAndDate();
  refreshCalendar();
}, tenSeconds);

const twentyMins = 1000 * 60 * 20;
setInterval(() => {
  refreshWeather();
}, twentyMins);
