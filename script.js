const config = {
  timezone: "Europe/Berlin",
};

// -------------------------------------------------
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

setTimeAndDate();
refreshCalendar();

setInterval(() => {
  setTimeAndDate();
  refreshCalendar();
}, 10000);
