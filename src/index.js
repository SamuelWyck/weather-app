import "./styles.css";
import {findTimeZone, getZonedTime} from "timezone-support";
import singleDayPage from "./singleDay.js";
import forecast from "./8DayForecast.js";



const app = (function() {
    const contentDiv = document.querySelector(".content");
    const input = document.querySelector("input");
    const searchDiv = document.querySelector(".search");
    const siteNav = document.querySelector("nav");
    const usBtn = document.querySelector(".us");
    const metricBtn = document.querySelector(".metric");

    const api_key = "DKKLXNUXBA4FFTVRUQNVV2529";
    const contentType = "json";
    const baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    const usUnits = "us";
    const metricUnits = "metric";
    const tooManyRequestsError = 429;
    const invalidLocalError = 400;
    let units = usUnits;
    let usSelected = true;
    let weatherData = null;
    let lastLocal = input.value;
    let singlePageShowing = true;


    function toggleUnits() {
        if (units === usUnits) {
            units = metricUnits;
            usSelected = false;
        } else {
            units = usUnits;
            usSelected = true;
        }
    };

    function updateUnitBtns() {
        if (usSelected) {
            usBtn.classList.add("selected");
            metricBtn.classList.remove("selected");
        } else {
            usBtn.classList.remove("selected");
            metricBtn.classList.add("selected");
        }
    };

    function getZonedHour(timezoneCode) {
        const timezone = findTimeZone(timezoneCode);
        return getZonedTime(Date.now(), timezone).hours;
    };

    function getLocal() {
        return input.value;
    };

    function getCurrentLocal() {
        const localTitleH1 = document.querySelector(".local");
        if (localTitleH1 === null) {
            return null;
        }
        return localTitleH1.textContent;
    };

    function showErrorToUser(error) {
        if (error === tooManyRequestsError) {
            alert("Too many requests, come back tomorrow.");
        } else if (error === invalidLocalError) {
            alert("Invalid location.");
        } else {
            alert("Something went wrong.");
        }
    };

    function clearPage() {
        contentDiv.innerHTML = "";
    };

    async function fetchWeatherData(location) {
        const url = `${baseUrl}${location}/next7days?unitGroup=${units}&key=${api_key}&contentType=${contentType}`;

        const response = await fetch(url, {mode: "cors"});
        if (!response.ok) {
            throw response.status;
        }
        const jsonResponse = await response.json();
        
        return jsonResponse;
    };

    async function showSingleDayPage(setLocation=null) {
        if (weatherData === null) {
            let local = (setLocation === null) ? getLocal() : setLocation;
            try {
                weatherData = await fetchWeatherData(local);
            } catch (error) {
                console.log(error);
                showErrorToUser(error);
                return;
            }
        }

        const timezoneCorrectedHour = getZonedHour(weatherData.timezone);
        const currentDay = weatherData.days[0];
        clearPage();
        singleDayPage.createPage(
            weatherData.resolvedAddress,
            currentDay.tempmin,
            currentDay.tempmax,
            currentDay.hours[timezoneCorrectedHour],
            currentDay.hours,
            usSelected
        );
    };

    async function showForecastPage(setLocation=null) {
        if (weatherData === null) {
            let local = (setLocation === null) ? getLocal() : setLocation;
            try {
                weatherData = await fetchWeatherData(local);
            } catch (error) {
                console.log(error);
                showErrorToUser(error);
                return;
            }
        }

        clearPage();
        forecast.createPage(
            weatherData.days,
            weatherData.resolvedAddress
        );
    };


    searchDiv.addEventListener("click", function(event) {
        if (event.target.matches(".unit-btn")) {
            if (usSelected && event.target.matches(".us")) {
                return;
            } else if (!usSelected && event.target.matches(".metric")) {
                return;
            }
            toggleUnits();
            updateUnitBtns();
            const location = getCurrentLocal();
            weatherData = null;
            if (singlePageShowing) {
                showSingleDayPage(location);
            } else {
                showForecastPage(location);
            }
        }
    });

    siteNav.addEventListener("click", function(event) {
        if (event.target.matches(".today-btn")) {
            showSingleDayPage();
            singlePageShowing = true;
        } else if (event.target.matches(".forecast-btn")) {
            showForecastPage();
            singlePageShowing = false;
        }
    });

    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && input.value !== "") {
            if (input.value === lastLocal) {
                return;
            }
            lastLocal = input.value;
            weatherData = null;
            if (singlePageShowing) {
                showSingleDayPage();
            } else {
                showForecastPage();
            }
        }
    });

    showSingleDayPage();

})();