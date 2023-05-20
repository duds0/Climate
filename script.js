document.querySelector(".busca").addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputValue = document.querySelector("#searchInput").value;

    if (inputValue !== "") {
        clearInfo();
        loading("Loading...");

        const urlGeocoding = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURI(inputValue)}&appid=95b9027fe9d1f6c19c6b21c7a2d3f521`;
        const latLon = await fetch(urlGeocoding);
        const jsonGeo = await latLon.json();

        if (jsonGeo[0] !== undefined) {
            const lat = await jsonGeo[0].lat;
            const lon = await jsonGeo[0].lon;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURI(lat)}&lon=${encodeURI(lon)}&appid=95b9027fe9d1f6c19c6b21c7a2d3f521&units=metric&lang=pt_br`;
            const response = await fetch(url);
            const json = await response.json();
            //console.log(json);
            //console.log(jsonGeo);

            showInfo({
                name: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                icon: json.weather[0].icon,
                windAngle: json.wind.deg,
                windSpeed: json.wind.speed
            })
        } else if (jsonGeo[0] == undefined) {
            clearInfo();
            loading("Não conseguimos encontrar esta localização 🗺️");
        }
    } else {
        clearInfo();
    }
});

function showInfo(json) {
    loading("");

    document.querySelector(".titulo").innerHTML = `${json.name}, ${json.country}`;
    document.querySelector(".tempInfo").innerHTML = `${json.temp} <sup>ºC</sup>`;
    document.querySelector(".ventoInfo").innerHTML = `${json.windSpeed} <span>km/h</span>`;
    document.querySelector(".temp img").setAttribute("src", `https://openweathermap.org/img/wn/${json.icon}@2x.png`);
    document.querySelector(".ventoPonto").style.transform = `rotate(${json.windAngle - 90}deg)`;
    document.querySelector(".resultado").style.display = "block";
};

function loading(msg) {
    document.querySelector(".aviso").innerHTML = msg;
};

function clearInfo() {
    loading("");
    document.querySelector(".resultado").style.display = "none";
};