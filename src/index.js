import testData from "./testData.js";
import "./styles.css";



const app = (function() {

    const api_key = "DKKLXNUXBA4FFTVRUQNVV2529";
    const contentType = "json";
    const baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    let units = "us";

    async function fetchWeatherData(location) {
        const url = `${baseUrl}${location}/next7days?unitGroup=${units}&key=${api_key}&contentType=${contentType}`;

        const response = await fetch(url, {mode: "cors"});
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response;
    };

    function testFetch() {
        return testData;
    };

    // fetchWeatherData("berlin")
    // .then(function(res) {
    //     return res.json();
    // })
    // .then(function(res) {
    //     console.log(res);
    // })
    // .catch(function(err) {
    //     console.log(err)
    // })

    console.log(testFetch())

})();