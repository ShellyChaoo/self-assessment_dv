 // set the dimensions and margins of the graph
 const margin = {top: 10, right: 30, bottom: 30, left: 40},
 width = 260 - margin.left - margin.right,
 height = 250 - margin.top - margin.bottom;

// append the svg object to the body of the page
const histo_svg = d3.select("#my_dataviz")
.append("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
.append("g")
 .attr("transform",
       `translate(${margin.left}, ${margin.top})`);

// get the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv").then( function(data) {
d3.csv("https://raw.githubusercontent.com/ShellyChaoo/self-assessment_dv/master/data/data.csv").then(function(data) {

// X axis: scale and draw:
const x = d3.scaleLinear()
   .domain([1, 11])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
   .range([0, width]);
histo_svg.append("g")
   .attr("transform", `translate(0, ${height})`)
   .call(d3.axisBottom(x));

// set the parameters for the histogram
const histogram = d3.histogram()
   .value(function(d) { return d.score; })   // I need to give the vector of value
   .domain(x.domain())  // then the domain of the graphic
   .thresholds(x.ticks(10)); // then the numbers of bins

// And apply this function to data to get the bins
const bins = histogram(data);

// Y axis: scale and draw:
const y = d3.scaleLinear()
   .range([height, 0]);
   y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
histo_svg.append("g")
   .call(d3.axisLeft(y));

// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
// Its opacity is set to 0: we don't see it by default.
const tooltip = d3.select("#my_dataviz")
 .append("div")
 .style("opacity", 0)
 .attr("class", "tooltip")
 .style("background-color", "black")
 .style("color", "white")
 .style("border-radius", "5px")
 .style("padding", "10px")

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
const showTooltip = function(event,d) {
 tooltip
   .transition()
   .duration(100)
   .style("opacity", 1)
 tooltip
   .html("Range: " + d.x0 + " - " + d.x1)
   .style("left", (event.x)/2+ "px")
   .style("top", (event.y)/2 + "px")
}
const moveTooltip = function(event,d) {
 tooltip
 .style("left", (event.x) + "px")
 .style("top", (event.y)/2+ "px")
}
// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
const hideTooltip = function(event,d) {
 tooltip
   .transition()
   .duration(100)
   .style("opacity", 0)
}

// append the bar rectangles to the histo_svg element
histo_svg.selectAll("rect")
   .data(bins)
   .join("rect")
     .attr("x", 1)
     .attr("transform", function(d) { return `translate(${x(d.x0)}, ${y(d.length)})`})
     .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
     .attr("height", function(d) { return height - y(d.length); })
     .style("fill", function(d){ if(d.x0==3){return "orange"} else {return "#69b3a2"}})
     // Show tooltip on hover
    //  .on("mouseover", showTooltip )
    //  .on("mousemove", moveTooltip )
    //  .on("mouseleave", hideTooltip )
histo_svg
 .append("line")
 .attr("x1", x(3.5) )
 .attr("x2", x(3.5) )
 .attr("y1", y(0))
 .attr("y2", y(10))
 .attr("stroke", "grey")
 .attr("stroke-dasharray", "3")
histo_svg
 .append("text")
 .attr("x", x(2))
 .attr("y", y(8))
 .text("You are here: 3")
 .style("font-size", "15px")

 // Add X axis label:
 histo_svg.append("text")
     .attr("text-anchor", "end")
     .attr("x", width)
     .attr("y", height + margin.top + 20)
     .text("Score")
     .style("font-size", "12px");

 // Y axis label:
 histo_svg.append("text")
     .attr("text-anchor", "end")
     .attr("transform", "rotate(-90)")
     .attr("y", -margin.left+20)
     .attr("x", -margin.top)
     .text("Count")
     .style("font-size", "12px");

});

// append the svg object to the body of the page
const scatter_svg = d3.select("#scatter")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

// Add the grey background that makes ggplot2 famous
scatter_svg
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", width)
    .style("fill", "white")

//Read the data
d3.csv("https://raw.githubusercontent.com/ShellyChaoo/self-assessment_dv/master/data/data.csv").then(function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 11])
    .range([ 0, width ]);
  scatter_svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
  scatter_svg.append("g")
    .call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  const color = d3.scaleOrdinal()
    .domain(["male", "female" ])
    .range([ "#404080", "#69b3a2"]);

//   // create a tooltip
//   const scaTooltip = d3.select("#scatter")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "2px")
//     .style("border-radius", "5px")
//     .style("padding", "5px")

//     // Three function that change the tooltip when user hover / move / leave a cell
//     const scaMouseover = function(event,d) {
//     scaTooltip
//     .style("opacity", 1)
//     d3.select(this)
//     .style("stroke", "black")
//     .style("opacity", 1)
//     }
//     const scaMousemove = function(event,d) {
//     scaTooltip
//     .html("Age: "+ d.age+ "<br>Score: " + d.score)
//     .style("left", (event.x)/2 + "px")
//     .style("top", (event.y)/2 + "px")
//     }
//     const scaMouseleave = function(event,d) {
//     scaTooltip
//     .style("opacity", 0)
//     d3.select(this)
//     .style("stroke", "none")
//     .style("opacity", 0.8)
//     }

  // Add dots
  scatter_svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
      .attr("cx", function (d) { return x(d.score); } )
      .attr("cy", function (d) { return y(d.age); } )
      .attr("r", 5)
      .style("fill", function(d){ if(d.name=="z"){return "orange"} else {return "#69b3a2"}})
    //   .style("fill", function (d) { return color(d.sex) } )

scatter_svg
 .append("line")
 .attr("x1", x(3) )
 .attr("x2", x(3) )
 .attr("y1", y(0))
 .attr("y2", y(30))
 .attr("stroke", "grey")
 .attr("stroke-dasharray", "3");
scatter_svg
 .append("line")
 .attr("x1", x(0) )
 .attr("x2", x(3) )
 .attr("y1", y(30))
 .attr("y2", y(30))
 .attr("stroke", "grey")
 .attr("stroke-dasharray", "3");
scatter_svg
 .append("text")
 .attr("x", x(3.5))
 .attr("y", y(29))
 .text("Age: 30")
 .style("font-size", "12px");
scatter_svg
 .append("text")
 .attr("x", x(3.5))
 .attr("y", y(24))
 .text("Score: 3")
 .style("font-size", "12px");

// Add X axis label:
 scatter_svg.append("text")
     .attr("text-anchor", "end")
     .attr("x", width)
     .attr("y", height + margin.top + 20)
     .text("Score")
     .style("font-size", "12px");

 // Y axis label:
 scatter_svg.append("text")
     .attr("text-anchor", "end")
     .attr("transform", "rotate(-90)")
     .attr("y", -margin.left+15)
     .attr("x", -margin.top)
     .text("Age")
     .style("font-size", "12px");

});

// set the dimensions and margins of the graph
const piewidth = 226,
    pieheight = 226,
    piemargin = 25;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(piewidth, pieheight) / 2 - piemargin

// append the svg object to the div called 'pie'
const pie_svg = d3.select("#pie")
  .append("svg")
    .attr("width", piewidth)
    .attr("height", pieheight)
  .append("g")
    .attr("transform", `translate(${piewidth / 2},${pieheight / 2})`);

// Create dummy data
const piedata1 = {"Not at all": 9, "Several days": 10, "More than half days":20, "Nearly every day":8}
// set the color scale
const piecolor = d3.scaleOrdinal()
  .domain(["Not at all", "Several days", "More than half days", "Nearly every day"])
  .range(["#B3CC66", "#69b3a2", "#612163", "#D6CB85"])
function update(data){
    // Compute the position of each group on the pie:
    const pie = d3.pie()
    .sort(null)
    .value(d=>d[1])

    const data_ready = pie(Object.entries(data))

    // The arc generator
    const arc = d3.arc()
    .innerRadius(radius * 0.5)         // This is the size of the donut hole
    .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
    .innerRadius(radius * 0.8)
    .outerRadius(radius * 0.8)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    pie_svg
    .selectAll('allSlices')
    .data(data_ready)
    .join('path')
    .attr('d', arc)
    .attr('fill', d => piecolor(d.data[1]))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    // .style("opacity", 0.7)

    pie_svg.append("circle").attr("cx",-105).attr("cy",85).attr("r", 6).style("fill", "#B3CC66")
    pie_svg.append("circle").attr("cx",-105).attr("cy",100).attr("r", 6).style("fill", "#69b3a2")
    pie_svg.append("circle").attr("cx",0).attr("cy",85).attr("r", 6).style("fill", "#612163")
    pie_svg.append("circle").attr("cx",0).attr("cy",100).attr("r", 6).style("fill", "#D6CB85")
    pie_svg.append("text").attr("x", -95).attr("y", 85).text("Not at all").style("font-size", "15px").attr("alignment-baseline","middle")
    pie_svg.append("text").attr("x", -95).attr("y", 100).text("Several days").style("font-size", "15px").attr("alignment-baseline","middle")
    pie_svg.append("text").attr("x", 10).attr("y", 85).text("More than half day").style("font-size", "15px").attr("alignment-baseline","middle")
    pie_svg.append("text").attr("x", 10).attr("y", 100).text("Every day").style("font-size", "15px").attr("alignment-baseline","middle")

}
update(piedata1)
