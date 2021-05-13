
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
                finalAsianData.push({ key: key, value: barChartDataAsian[key] })
            }
            for (let key in barChartDataAll) {
                if (key != "") {
                    maxYAll = Math.max(maxYAll, barChartDataAll[key])
                    finalAllData.push({ key: key, value: barChartDataAll[key] })
                }

            }
            console.log(finalAllData)
            createVis(finalAsianData, maxYAsian, "#asian_edu_chart",'#F05314')
            createVis(finalAllData, maxYAll, '#everyone_edu_chart','#F0145A')
        });

    url = "data/diabetes_readmission/diabetic_data.csv";
    // TO-DO: LOAD DATA
    d3.csv(url)
        .then(function (data) {
            console.log(data)
            whiteCount = 0
            blackCount = 0
            otherCount = 0
            whiteLess30Count = 0
            blackLess30Count = 0
            otherLess30Count = 0
            whiteMore30Count = 0
            blackMore30Count = 0
            otherMore30Count = 0
            whiteData = {}
            blackData = {}
            otherData = {}
            for (let i = 0; i < data.length; i++) {
                if (data[i]['race'] === 'Caucasian' && data[i]['gender'] === 'Male') {
                    if (data[i]['readmitted'] === '<30') {
                        whiteLess30Count++;
                    }
                    else if(data[i]['readmitted'] === '>30'){
                        whiteMore30Count++;
                    }
                    else{
                        whiteCount++;
                    }
                }
                else if (data[i]['race'] === 'AfricanAmerican' && data[i]['gender'] === 'Male') {
                    if (data[i]['readmitted'] === '<30') {
                        blackLess30Count++;
                    }
                    else if(data[i]['readmitted'] === '>30'){
                        blackMore30Count++;
                    }
                    else{
                        blackCount++;
                    }
                }
                else if (data[i]['race'] === 'Other' && data[i]['gender'] === 'Male') {
                    if (data[i]['readmitted'] === '<30') {
                        otherLess30Count++;
                    }
                    else if(data[i]['readmitted'] === '>30'){
                        otherMore30Count++;
                    }
                    else{
                        otherCount++;
                    }
                }
            }
            // whitePieChartData = { notReadmitted: Math.round(((whiteCount-whiteLess30Count)/whiteCount)*100), readmission: Math.round((whiteLess30Count/whiteCount)*100) }
            // blackPieChartData = { notReadmitted: Math.round(((blackCount-blackLess30Count)/blackCount)*100), readmission: Math.round((blackLess30Count/blackCount)*100) }
            // otherPieChartData = { notReadmitted: Math.round(((otherCount-otherLess30Count)/otherCount)*100), readmission: Math.round((otherLess30Count/otherCount)*100) }
            
            let whiteDiabetesData = []
            whiteDiabetesData.push({key: "Not Readmitted", value: whiteCount})
            whiteDiabetesData.push({key: "Readmitted <30 days", value: whiteLess30Count})
            whiteDiabetesData.push({key: "Readmitted >30 days", value: whiteMore30Count})

            
            let blackDiabetesData = []
            blackDiabetesData.push({key: "Not Readmitted", value: blackCount})
            blackDiabetesData.push({key: "Readmitted <30 days", value: blackLess30Count})
            blackDiabetesData.push({key: "Readmitted >30 days", value: blackMore30Count})

            let otherDiabetesData = []
            otherDiabetesData.push({key: "Not Readmitted", value: otherCount})
            otherDiabetesData.push({key: "Readmitted <30 days", value: otherLess30Count})
            otherDiabetesData.push({key: "Readmitted >30 days", value: otherMore30Count})

            createVis(whiteDiabetesData,Math.max(whiteCount,whiteLess30Count,whiteMore30Count),'#white_diabetes_charts','#14F05D')
            createVis(blackDiabetesData,Math.max(blackCount,blackLess30Count,blackMore30Count),'#black_diabetes_charts', '#14ADF0')
            createVis(otherDiabetesData,Math.max(otherCount, otherLess30Count,otherMore30Count),'#other_diabetes_charts','#BE14F0')
        });

}

function createVis(data, maxY, div, color) {
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
        .domain(data.map(function (d) { return d.key; }))
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
        .attr("x", function (d) { return x(d.key); })
        .attr("width", x.bandwidth())
        .attr("fill", color)
        // no bar at the beginning thus:
        .attr("height", function (d) { return height - y(0); }) // always equal to 0
        .attr("y", function (d) { return y(0); })

    // Animation
    svg.selectAll("rect")
        .transition()
        .duration(1000)
        .attr("y", function (d) { return y(d.value); })
        .attr("height", function (d) { return height - y(d.value); })
        .delay(function (d, i) {//console.log(i) 
            return (i * 100)
        })
}

