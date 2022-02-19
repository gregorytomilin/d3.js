let states, senators, statesNames,
$senatorsList, $stateName;

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
    //Width and height of map
    var width = 960;
    var height = 500;

    // D3 Projection
    var projection = d3.geo.albersUsa()
        .translate([width / 2, height / 2])
        // translate to center of screen
        .scale([1000]);
    // scale things down so see entire US

    // Define path generator
    var path = d3.geo.path()
    // path generator that will convert GeoJSON to SVG paths
        .projection(projection);
        // tell path generator to use albersUsa projection


    //Создание svg и добавление в .usaStates__map
    var svg = d3.select(".usaStates__map")
        .append("svg")
        // .attr("width", width)
        // .attr("height", height);


           // Load GeoJSON data and merge with states data
        d3.json("js/states.json", function (json) {
            // Bind the data to the SVG and create one path per GeoJSON feature
            svg
            .attr("viewBox", '0 0 900 500')
            .attr("x", '0px')
            .attr("y", '0px')
            .attr("xmlns", 'http://www.w3.org/2000/svg')
            // .attr("width", '100%')
            // .attr("height", '100%')

            svg.selectAll("path")
                .data(json.features)
                .enter()
                // выполняется код столько сколько штатов
                .append("path")
                .attr("d", path)
                .attr("id", (d)=>d.id)

                // .style("stroke", "#fff")
                // .style("stroke-width", "1")
                // .style("fill", "rgb(54, 255, 144)")
                .on('click', function (d) {
                    d3.select(this)
                    getSenators(d.properties.name);
                })
                .on('mouseover', function (d) {
                    showNameOfState(d.properties.name)
                })
                .on('mouseout', function (d) {
                    clearName()
                })


        });
})


function getSenators(stateName){

    let stateSenators = [];

    senators.objects.forEach(item => {
        if(item.state == statesNames[stateName]){
            stateSenators.push(item);
        }
    });
    createSenatorInfo(stateSenators, stateName);

}
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

function showNameOfState(stateName){
    $stateName.innerHTML = `State ${stateName}`;
}
function clearName(){
    $stateName.innerHTML = 'USA';
}
