let states, senators, statesNames,
$senatorsList, $stateName;
// через $ объявляем переменные содержащие DOM элементы

// получаем данные по штатам, сенаторам
async function getDetails(){
    states = await fetch('js/states.json').then(res => res.json());
    senators = await fetch('js/senators.json').then(res => res.json());
    statesNames = await fetch('js/statesNames.json').then(res => res.json());

    let statesNamesConverted = {}
    for (key in statesNames) {
       statesNamesConverted[statesNames[key]] = key;
    }
    statesNames = statesNamesConverted;
}
getDetails();




document.addEventListener('DOMContentLoaded', () => {
    $senatorsList = document.querySelector('.usaStates__senatorsList');
    $stateName = document.querySelector('.stateName');

    const width = 960;
    const height = 500;

    // D3 Projection

    const projection = d3.geo.albersUsa()
        .translate([width / 2, height / 2])
        // цетровка по цетру экрана
        .scale([1000]);
    // масшатабирование по центру карты США

    // Объявление генератора путей
    const path = d3.geo.path()
    // path generator that will convert GeoJSON to SVG paths
    // генератор paths конвертирует геоjson в svg paths
        .projection(projection);
        // tell path generator to use albersUsa projection


    //Создание svg и добавление в .usaStates__map
    let svg = d3.select(".usaStates__map")
        .append("svg")
        // .attr("width", width)
        // .attr("height", height);


        // Загрузка gejson
        d3.json("js/states.json", function (json) {
            svg
            .attr("viewBox", '0 0 960 500')
            .attr("x", '0px')
            .attr("y", '0px')
            .attr("xmlns", 'http://www.w3.org/2000/svg')
            // .attr("width", '100%')
            // .attr("height", '100%')


            // Привязка данных к SVG
            svg.selectAll("path")
                .data(json.features)
                .enter()
                // выполняется код столько сколько штатов
                .append("path")
                .attr("d", path)
                .attr("id", (d)=>d.id)

                // Стили присваиваем через CSS
                // .style("stroke", "#fff")
                // .style("stroke-width", "1")
                // .style("fill", "rgb(54, 255, 144)")
                .on('click', function (d) {
                    d3.select(this)
                    getSenators(d.properties.name);
                })
                // Обработчики движения и действия мышью
                .on('mouseover', function (d) {
                    showNameOfState(d.properties.name)
                })
                .on('mouseout', function (d) {
                    clearName()
                })


        });
})

// Получаем сенаторов штата по Названию штата
function getSenators(stateName){

    let stateSenators = [];

    senators.objects.forEach(item => {
        if(item.state == statesNames[stateName]){
            stateSenators.push(item);
        }
    });
    createSenatorInfo(stateSenators, stateName);

}

// Создание DOM элементов с информацией о сенаторах штата
function createSenatorInfo(stateSenators, state){
    $senatorsList.innerHTML = '';
    $senatorsList.innerHTML = `
        <div class="stateName">Senators of the ${state}</div>
    `
    stateSenators.forEach(item => {
        let div = document.createElement('div');
        div.classList.add('senator');
        div.innerHTML = `
            <div class="senator__info">
                <span class="senator__infoTitle">Description:</span>
                ${item.description}
            </div>
            <div class="senator__info">
                <span class="senator__infoTitle">Party:</span>
                ${item.party}
             </div>
            <div class="senator__info">
                <span class="senator__infoTitle">Senator_rank_label:</span>
                ${item.senator_rank_label}
             </div>
            <div class="senator__info">
                <span class="senator__infoTitle">Website:</span>
                <a href="${item.website}" target="_blank">${item.website}</a>
            </div>
            <div class="senator__info">
                <span class="senator__infoTitle">Person.name:</span>
                ${item.person.name}
            </div>
        `
        $senatorsList.appendChild(div);
    })
}

// Вывод названия штата на onmouseover
function showNameOfState(stateName){
    $stateName.innerHTML = `State ${stateName}`;
}
function clearName(){
    $stateName.innerHTML = 'USA';
}
