
loadData()

function loadData() {
    //Asian-Pac-Islander
    let url = "data/us_income/adult-training.csv";
    // TO-DO: LOAD DATA
    d3.csv(url)
        .then(function (data) {
            let EduDataAsian = []
            let barChartDataAsian = {}
            let finalAsianData = []
            let EduDataAll = []
            let barChartDataAll = {}
            let finalAllData = []
            for (let i = 0; i < data.length; ++i) {
                EduDataAll.push({ race: data[i][" White"], education: data[i][" Bachelors"] })
                if (data[i][" Bachelors"] in barChartDataAll) {
                    barChartDataAll[data[i][" Bachelors"]] = barChartDataAll[data[i][" Bachelors"]] + 1
                }
                else {
                    barChartDataAll[data[i][" Bachelors"]] = 1;
                }
                if (data[i][' White'] === ' Asian-Pac-Islander') {
                    let income = 0;
                    if (data[i][' <=50K'] === ' <=50K') {
                        income = 0;
                    }
                    else {
                        income = 1;
                    }
                    EduDataAsian.push({ race: data[i][" White"], education: data[i][" Bachelors"], income: income })
                    if (data[i][" Bachelors"] in barChartDataAsian) {
                        barChartDataAsian[data[i][" Bachelors"]] = barChartDataAsian[data[i][" Bachelors"]] + 1
                    }
                    else {
                        barChartDataAsian[data[i][" Bachelors"]] = 1;
                    }
                }
            }
            maxYAsian = 0
            maxYAll = 0
            for (let key in barChartDataAsian) {
                maxYAsian = Math.max(maxYAsian, barChartDataAsian[key])
                finalAsianData.push({ education: key, value: barChartDataAsian[key] })
            }
            for (let key in barChartDataAll) {
                if (key != "") {
                    maxYAll = Math.max(maxYAll, barChartDataAll[key])
                    finalAllData.push({ education: key, value: barChartDataAll[key] })
                }

            }

            createVis(finalAsianData, maxYAsian, "#asian_edu_chart")
            createVis(finalAllData, maxYAll, '#everyone_edu_chart')
        });

    url = "data/diabetes_readmission/diabetic_data.csv";
    // TO-DO: LOAD DATA
    d3.csv(url)
        .then(function (data) {
            console.log(data)
            whiteCount = 0
            blackCount = 0
            otherCount = 0
            whiteReAdminCount = 0
            blackReAdminCount = 0
            otherReAdminCount = 0
            whiteData = {}
            blackData = {}
            otherData = {}
            for (let i = 0; i < data.length; i++) {
                if (data[i]['race'] === 'Caucasian' && data[i]['gender'] === 'Male') {
                    whiteCount++;
                    if (data[i]['readmitted'] === '<30') {
                        whiteReAdminCount++;
                    }
                }
                else if (data[i]['race'] === 'AfricanAmerican' && data[i]['gender'] === 'Male') {
                    blackCount++;
                    if (data[i]['readmitted'] === '<30') {
                        blackReAdminCount++;
                    }
                }
                else if (data[i]['race'] === 'Other' && data[i]['gender'] === 'Male') {
                    otherCount++;
                    if (data[i]['readmitted'] === '<30') {
                        otherReAdminCount++;
                    }
                }
            }
            whitePieChartData = { notReadmitted: Math.round(((whiteCount-whiteReAdminCount)/whiteCount)*100), readmission: Math.round((whiteReAdminCount/whiteCount)*100) }
            blackPieChartData = { notReadmitted: Math.round(((blackCount-blackReAdminCount)/blackCount)*100), readmission: Math.round((blackReAdminCount/blackCount)*100) }
            otherPieChartData = { notReadmitted: Math.round(((otherCount-otherReAdminCount)/otherCount)*100), readmission: Math.round((otherReAdminCount/otherCount)*100) }

            console.log(whitePieChartData)
            console.log(blackPieChartData)
            console.log(otherPieChartData)

            // createPieVis(whitePieChartData, "#pieChart1")
            // createPieVis(blackPieChartData, "#pieChart2")
            // createPieVis(otherPieChartData, "#pieChart3")
        });

}

function createVis(data, maxY, div) {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 90, left: 40 },
        width = 460 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(div)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) { return d.education; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, maxY])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.education); })
        .attr("width", x.bandwidth())
        .attr("fill", "#69b3a2")
        // no bar at the beginning thus:
        .attr("height", function (d) { return height - y(0); }) // always equal to 0
        .attr("y", function (d) { return y(0); })

    // Animation
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function (d) { return y(d.value); })
        .attr("height", function (d) { return height - y(d.value); })
        .delay(function (d, i) {//console.log(i) 
            return (i * 100)
        })
}

function createPieVis(datat, div){
// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin


var svg = d3.select(div)
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var data = [{a: 9}, {b: 20}, {c:30}, {d:8}, {e:12}]
// set the color scale
var color = d3.scaleOrdinal()
  .domain(data)
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {
      console.log(d[1])
      return d.value; })
var data_ready = pie(Object.entries(data))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('whatever')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)


}