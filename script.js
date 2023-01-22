import {
  tabsItem,
  tabsBlock,
  form,
  input,
  temperature,
  img,
  nameCity,
  searchImg,
  ListLocation,
  detailsCity,
  detailsTemperature,
  deatailsLike,
  detailsWeather,
  detailsSunrise,
  detailsSunset,
} from "./const.js";

const serverUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "f660a2fb1e4bad108d6160b7f58c555f";
const cityList = JSON.parse(localStorage.getItem("cityes")) || [];

eventList();

function eventList() {
  document.addEventListener("DOMContentLoaded", () => {
    addLocationRender();
  });
}

for (let item of tabsItem) {
  item.addEventListener("click", () => {
    for (let elem of tabsBlock) {
      elem.classList.add("hidden");
    }

    const content = document.querySelector("#" + item.dataset.tab);
    content.classList.remove("hidden");
  });
}

form.addEventListener("submit", onFormSubmitHandler);
searchImg.addEventListener("click", onFormSubmitHandler);

function onFormSubmitHandler(event) {
  event.preventDefault();

  const cityName = input.value;
  let url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

  checkCityName(cityName, url);
}

function checkCityName(cityName, url) {
  if (!cityName) {
    alert("Введите корректный город");
  } else {
    changeNow(url);
    details(url);
  }
}

function changeNow(url) {
  fetch(url)
    .then((response) => response.json())
    .then((obj) => {
      temperature.textContent = Math.round(obj.main.temp) + "°";
      nameCity.textContent = obj.name;
      const icon = obj.weather[0].icon;

      let url = "https://openweathermap.org/img/w/" + icon + ".png";

      img.src = url;

      const Heartslogo = document.createElement("img");
      Heartslogo.classList.add("now__city-img");
      Heartslogo.src = "img/Hearts.svg";
      nameCity.append(Heartslogo);

      Heartslogo.addEventListener("click", (event) => {
        event.preventDefault();

        if (event.target) {
          addCity();
        }
      });
    })
    .catch(alert);
}

function addCity() {
  let nowCity = nameCity.textContent;
  let position = cityList.findIndex((city) => city === nowCity);
  if (position === -1) {
    cityList.push(nowCity);
  } else {
    alert("Город уже добавлен");
  }
  localStorage.setItem("cityes", JSON.stringify(cityList));

  addLocationRender();
}

function addLocationRender() {
  document.querySelectorAll(".list-item").forEach(function (city) {
    city.remove();
  });
  cityList.forEach((city) => {
    let li = document.createElement("li");
    let p = document.createElement("p");
    let button = document.createElement("button");
    let span = document.createElement("span");

    li.classList.add("list-item");
    p.classList.add("locations__text");
    button.classList.add("locations__delete", "btn-3");

    p.textContent = city;
    span.textContent = "X";

    ListLocation.append(li);
    li.append(p);
    li.append(button);
    button.append(span);

    li.addEventListener("click", () => {
      let url = `${serverUrl}?q=${p.textContent}&appid=${apiKey}&units=metric`;
      changeNow(url);
      details(url);
    });

    button.addEventListener("click", btnStorage);

    function btnStorage(nowCity) {
      let index = cityList.findIndex((item) => item === nowCity);
      cityList.splice(index, 1);
      li.remove();

      localStorage.removeItem("cityes");
    }
  });
}

function details(url) {
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      detailsCity.textContent = result.name;
      detailsTemperature.textContent =
        "Temperature: " + Math.round(result.main.temp) + "°";
      deatailsLike.textContent =
        "Feels like: " + Math.round(result.main.feels_like) + "°";
      detailsWeather.textContent = "Weather: " + result.weather[0].main;
      let sunrise = new Date(result.sys.sunrise * 1000);
      sunrise = sunrise.toLocaleTimeString();
      detailsSunrise.textContent = "Sunrise: " + sunrise.slice(0, -3);
      let sunset = new Date(result.sys.sunset * 1000);
      sunset = sunset.toLocaleTimeString();
      detailsSunset.textContent = "Sunset: " + sunset.slice(0, -3);
    })
    .catch(alert);
}
