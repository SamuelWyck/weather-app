import icons from "./weatherIcons.js";


const singleDayPage = (function() {

    const contentDiv = document.querySelector(".content");
    let windUnit = "mph";
    const conditionIcons = icons;


    function createElement(element, className=null) {
        const ele = document.createElement(element);
        if (className !== null) {
            ele.classList.add(className);
        }
        return ele;
    };

    function getDegree() {
        const span = createElement("span", "degree");
        span.textContent = "°";
        return span;
    };

    function createTempSummary(hrData) {
        const tempDiv = createElement("div", "temp-div");
        
        const tempPara = createElement("p", "summary-temp");
        tempPara.textContent = `${Math.round(hrData.temp)}`;
        tempPara.appendChild(getDegree());
        tempDiv.appendChild(tempPara);

        const feelsLikeText = createElement("p");
        feelsLikeText.textContent = "Feels Like";
        tempDiv.appendChild(feelsLikeText);

        const feelsLikePara = createElement("p", "feels-like");
        feelsLikePara.textContent = `${Math.round(hrData.feelslike)}`;
        feelsLikePara.appendChild(getDegree());
        tempDiv.appendChild(feelsLikePara);
        
        return tempDiv;
    };

    function createIconSummary(hrData) {
        const div = createElement("div", "summary-icon");
        
        const img = createElement("img", "summary-icon-img");
        img.src = conditionIcons[hrData.icon];
        div.appendChild(img);

        const descriptionPara = createElement("p", "summary-description");
        descriptionPara.textContent = hrData.conditions;
        div.appendChild(descriptionPara);

        return div;
    };

    function createSummary(hrData) {
        const div = createElement("div", "summary");
        div.appendChild(createTempSummary(hrData));
        div.appendChild(createIconSummary(hrData));
        return div;
    };

    function createDataItem(img, title, data, deg=false) {
        const div = createElement("div", "data-item");

        div.appendChild(img);

        const titlePara = createElement("p", "data-title");
        titlePara.textContent = title;
        div.appendChild(titlePara);

        const dataPara = createElement("p", "data-data");
        dataPara.innerText = data;
        if (deg) {
            dataPara.appendChild(getDegree());
        }
        div.appendChild(dataPara);

        return div;
    };

    function createDataTempItem(img, title, min, max) {
        const div = createElement("div", "data-item");

        div.appendChild(img);

        const titlePara = createElement("p", "data-title");
        titlePara.textContent = title;
        div.appendChild(titlePara);

        const dataPara = createElement("p", "data-data");
        dataPara.innerHTML = `${min}<span class="degree">°</span>/${max}<span class="degree">°</span>`;
        div.appendChild(dataPara);

        return div;
    };

    function createDataSection(tempMin, tempMax, hrData) {
        const div = createElement("div", "data");
        
        const tempImg = createElement("img", "data-img");
        tempImg.src = "#";
        div.appendChild(createDataTempItem(tempImg, "High/Low", tempMin, tempMax));

        const dewImg = createElement("img", "data-img");
        dewImg.src = "#";
        div.appendChild(createDataItem(dewImg, "Dew Point", `${Math.round(hrData.dew)}`, true));

        const windImg = createElement("img", "data-img");
        windImg.src = "#";
        div.appendChild(createDataItem(windImg, "Wind Speed", `${hrData.windspeed} ${windUnit}`));

        const uvIndexImg = createElement("img", "data-img");
        uvIndexImg.src = "#";
        div.appendChild(createDataItem(uvIndexImg, "UV Index", `${hrData.uvindex}/10`));

        const humidImg = createElement("img", "data-img");
        humidImg.src = "#";
        div.appendChild(createDataItem(humidImg, "Humidity", `${Math.round(hrData.humidity)}%`));

        const precipImg = createElement("img", "data-img");
        precipImg.src = "#";
        div.appendChild(createDataItem(precipImg, "Precipitation", `${Math.round(hrData.precipprob)}%`));

        return div;
    };

    function createPage(local, tempMin, tempMax, hrData) {
        const localH1 = createElement("h1", "local");
        localH1.textContent = local;
        contentDiv.appendChild(localH1);

        const pageDiv = createElement("div", "single-page");
        pageDiv.appendChild(createSummary(hrData));
        pageDiv.appendChild(createDataSection(tempMin, tempMax, hrData));
        
        contentDiv.appendChild(pageDiv);
    };


    return {
        "createPage": createPage,
        "windUnit": windUnit,
    };
})();

export default singleDayPage;