//// =require ../../node_modules/d3/dist/d3.min.js

document.addEventListener('DOMContentLoaded', () => {


    let states, senators;

    let usStates = fetch('js/states.json')
        .then(data => data.json())
        .then(geo => { states = geo; console.log(states); });

    let senatorsFetch = fetch('js/senators.json')
        .then(data => data.json())
        .then(senators => { senators = senators; });



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
        .projection(projection);  // tell path generator to use albersUsa projection


    //Создание svg и добавление в .usaStates__map
    var svg = d3.select(".usaStates__map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);



    // Load in my states data!


        // Load GeoJSON data and merge with states data
        d3.json("js/states.json", function (json) {

            // Bind the data to the SVG and create one path per GeoJSON feature
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke", "#fff")
                .style("stroke-width", "1")
                .style("fill", function () {
                        return "rgb(213,222,217)";

                });


        });




})
