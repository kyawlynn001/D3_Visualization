// @TODO: YOUR CODE HERE!

// Setion 1 pre-data setup

// Grab with container box
var width = parseInt(d3.select("#scatter").style("width"));

//Designate the height of the graph
var height = width - width / 3.9;

var margin = 20;

//spacing for placing words
var labelArea = 110;

//spacing for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width",width)
    .attr("height",height)
    .attr("class","chart")

var circRadius ;
function crGet(){
    if(width <= 530){
        circRadius = 5;
    }
    else {
        circRadius = 10
    }
}

crGet();

svg.append("g").attr("class","xText");

//xtext will allows us to select the group without excess code
var xText = d3.select(".xText");

function xTextRefresh(){
    xText.attr(
        "transform",
        "translate(" +
        ((width - labelArea) / 2 + labelArea) +
        "," +
        (height - margin -tPadBot) + 
        ")"
    )
}

xTextRefresh()

xText
    .append("text")
    .attr("y",-26)
    .attr("data-name","poverty")
    .attr("data-axis","x")
    .attr("class","aText active x")
    .text("In Poversty (%)")

xText
    .append("text")
    .attr("y",0)
    .attr("data-name","age")
    .attr("data-axis","x")
    .attr("class","aText inactive x")
    .text("Age (Median)")

xText
    .append("text")
    .attr("y",26)
    .attr("data-name","income")
    .attr("data-axis","x")
    .attr("class","aText inactive x")
    .text("Household Income(Median)")

//B) left Axis
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea)/2 - labelArea;

//We add a second  label group this time for axis left of the chart 
svg.append("g").attr("class","yText");

var yText = d3.select(".yText");

function yTextRefresh(){
    yText.attr(
        "transform",
        `translate(${leftTextX}, ${leftTextY}) rotate(-90)`
    )
}

yTextRefresh();

yText
    .append("text")
    .attr("y",-26)
    .attr("data-name","obesity")
    .attr("data-axis","y")
    .attr("class","aText active y")
    .text("Obese(%)")

yText
    .append("text")
    .attr("y",0)
    .attr("data-name","smoke")
    .attr("data-axis","y")
    .attr("class","aText inactive y")
    .text("Smoke(%)")

yText
    .append("text")
    .attr("y",26)
    .attr("data-name","healthcare")
    .attr("data-axis","y")
    .attr("class","aText inactive y")
    .text("Lack of Healthcare(%)")

//Import .csv file
d3.csv("assets/data/data.csv").then (function(data){
    //console.log(data);
    visualize(data);
})

//create a function to visulize 
function visualize(data){
    var curX = "poverty";
    var curY = "obseity";

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    var toolTip =d3
        .tip()
        .attr("class","d3-tip")
        .offset([40,-60])
        .html(function(d){
            var theX;
            var theState = `<div>${d.state}</div>`;
            var theY =`<div>${curY}: ${d[curY]}%</div>`

            if(curX === "poverty"){
                theX = `<div>${curX}: ${d[curX]}%</div>`
            }
            else{
                theX = `<div>${curX}: ${parseFloat(d[curX]).toLocaleString("en")}</div>`

            }

            return theState + theX + theY;
            
        })

    svg.call(toolTip);  
    
    //Part 2
    function xMinMax(){
        xMin = d3.min(data,function(d){
            return parseFloat(d[curX])* 0.90;
        })

        xMax= d3.max(data,function(d){
            return parseFloat(d[curX])* 1.10;
        })
    }
    
    function yMinMax(){
        yMin = d3.min(data,function(d){
            return parseFloat(d[curY])* 0.90;
        })

        yMax= d3.max(data,function(d){
            return parseFloat(d[curY])* 1.10; 
        })
    }

    // change classes and appearances of Label text when clicked
    function labelChange(axis, clickedText){
        d3.selectAll(".aText")
        .filter("." + axis)
        .filter(".active")
        .classed("active",false)
        .classed("inactive",true);

        clickedText.classed("inactive",false).classed("active",true);

    }
    //first grab the min and max values of x and y
    xMinMax()
    yMinMax();

    var xScale = d3
        .scaleLinear()
        .domain([xMin,xMax])
        .range([margin + labelArea, width-margin])

    var yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin - labelArea, margin])

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    function tickCount(){
        if (width <= 500){
            xAxis.ticks (5);
            yAxis.ticks (5);
        }

        else { 
            xAxis.ticks(10);
            yAxis.ticks(10);

        }
    }

    tickCount();

    svg
        .append("g")
        .call(xAxis)
        .attr("class","xAxis")
        .attr("transform",`translate(0,${height - margin-labelArea})`)

    svg
        .append("g")
        .call(yAxis)
        .attr("class","yAxis")
        .attr("transform",`translate(${margin + labelArea},0)`)
    
    var theCircles = svg.selectAll("g theCricles").data(data).enter()

    theCircles.append("circle")
        .attr("cx",function(d){
            return xScale(d[curX]);
        })
        .attr("cy",function(d){
            return yScale(d[curY]);
        })
        .attr("r",circRadius)
        attr("class",function(d){
            return `stateCircle ${d.abbr}`
        })
}

