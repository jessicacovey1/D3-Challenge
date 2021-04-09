var svgWidth = 960;  //support vector graphics -- scaleable graphics
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
//define chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter") //append the svg wrapper to the scatter div id
  .append("svg") //append the svg elelment
  .attr("width", svgWidth) //add width element from variable above
  .attr("height", svgHeight);

  //append a group to adhere to the chart margins

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//========================================================

  // Import Data and create promise call data healthdata
d3.csv("assets/data/data.csv").then(function(healthData) {
  console.log(healthData);
  
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {

      data.healthcare = +data.healthcare;
      data.income = +data.income;
    });



    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.healthcare)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([30000, d3.max(healthData, d => d.income)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);



     // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData) 
    .enter() 
    .append("circle") 
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", "15")
    .attr("fill", "green")
    .attr("opacity", ".5");


// Step:  Create Abbreviations
// =======================================
    var textLabel = chartGroup.selectAll(null)
      .data(healthData)
      .enter()
      .append("text");

    textLabel
      .attr("dx", d => xLinearScale(d.healthcare))
      .attr("dy", d => yLinearScale(d.income))
      .text(d => d.abbr)
      .attr("text-anchor", "middle")
      .attr("fill", "darkgreen");

    

    // Add state abbreviations to the circles  do not do in the circles
    //var textGroup = chartGroup.selectAll("text.states")
      // .data(healthData) //.data brings in the data
      // .enter() //creates a placeholder for new data
      // .append("text.states") //appends the state text to the new placeholder
      // .attr("class", "states")
      // //need to add the abbr d.abbr
      // //.classed("states", true)
      // .text(d => d.abbr)   //function to change the text - as it loops through the lit  or .html
      // .attr("dx", d => xLinearScale(d.healthcare))
      // .attr("dy", d => yLinearScale(d.income));

    //chartGroup.call(textGroup);  //not a function
//what is classed  do I need it  .stateText in d3css where?
    
    

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("mouseover", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<hr>Healthcare: ${d.healthcare}<br>Income: ${d.income}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Healthcare");
  }).catch(function(error) {
    console.log(error);
  });

