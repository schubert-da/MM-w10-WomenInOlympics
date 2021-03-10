var margin = {top: 10, right: 60, bottom: 30, left: 30},
    width  = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("Olympics_women_data.csv",

function(data){
    return {year: d3.timeParse("%Y")(data.year.replace(",","")), perc: data.perc}
},

function(data) {

// text content to be displayed
var textContent = {
    0: "<h1> Women in the Olympics </h1>In this visualisation we see how the Olympics since its conception in 1896 has made <b>great strides in the inclusion of female athletes</b>.<br><br> What started out as an event with a group of 242 male-only participants, has now grown to one with more than 11,000 athletes, 45% of whom are female.<br><br>Note that data is aggregated across 4 year periods to remain consistent with years when there wasn't a Winter Olympics<br><br> <b>Click to progress through the years.</b>",
    1: "<h1> 1900 Olympics - Paris</h1>The <b>first Olympic Games to feature female athletes</b> was the 1900 Games in Paris.<br><br>22 women competed in tennis, golf, sailing and croquet. At the time, women comprised only 2.2% of the total  participants.",
    2: "<h1> 1904 - 1916</h1> In the subsequent Olympic games, the number of female athletes grew steadily. Stockholm 1912 featured 47 women and saw the addition of swimming and diving, as well as the removal of figure skating and archery.<br><br>The 1916 Summer Olympics were scheduled to be held in Berlin but had to be <b>cancelled due to the outbreak of World War I</b> in 1914.",
    3: "<h1> 1920 - 1936</h1> 1924 saw the <b>inception of the Olympic Winter games</b> where women were able to only compete in figure skating. This period also saw the addition of fencing, javelin throw, athletics and gymnastics.<br><br>With the <b>outbreak of World War II</b>, the following evernts were all cancelled:<ul> <li>1940 Winter Olympics (Sapporo)</li><li>1940 Summer Olympics (Tokyo)</li><li>1944 Winter Olympics (Cortina d'Ampezzo)</li> <li>1944 Summer Olympics (London)</li></ul>",
    4: "<h1> 1948 - 2000</h1> After a period of 12 yeards without an Olympics event, once again the representation of women in the Olympics grew with the increasing number of womens' events.<br><br>In 1991, the IOC made it <b>mandatory for all new sports applying for Olympic recognition to have female competitors</b>.<br><br>Some <b>notable additions</b> to the womens' programme included: <ul> <li>Volleyball</li><li>Basketball</li><li>Cycling</li><li>Table Tennis</li><li>Football</li><li>Soccer</li></ul> ",
    5: "<h1> 2000 - 2016</h1> The London 2012 games were a milestone for women athletes from all around the world.<br><br>For the first time, <b>women would compete in every sport that their male counterparts did</b>. 2012 also marked the first time that all national Olympic Comittees sent at least one female athlete.<br><br>The most recent Olympics events in Rio de Janeiro (Summer 2016) and Pyeongchang (Winter 2018) recorded the highest female particpation shares of 45% and 41% respectively.",
}

// X axis
var x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.year; }))
  .range([ 0, width ])

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x)
  .ticks(d3.timeYear.every(8))
  .tickFormat(d3.timeFormat("%Y"))
  )

// Y axis
var y = d3.scaleLinear()
  .domain(d3.extent(data, function(d) { return +d.perc; }))
  .range([ height, 0 ])
  .nice();

svg.append("g")
.attr("transform", "translate("+(width + 2)+", 0)")
  .call(d3.axisRight(y)
  .tickFormat(d3.format(".0%"))
  )
  .call( g => g.append("text")
    .attr("x", -113)
    .attr("y", 5)
    .attr("fill","#4d4d4d")
    .style("font-size","11px")
    .text("Percentage of women"))

// Add the area for gradient
svg.append("path")
    .datum(data)
    .attr("class","gradientArea")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)      
    .attr("d", d3.area()
        .x(function(d) { return x(d.year) })
        .y0(function(d) { return y(d.perc) })
        .y1(function(d) { return y(0) })
        .defined( d => d.perc )
    )
    // invisible for now
    .style("opacity", 0)

// Add the line for the line chart
svg.selectAll("path.lineChart")
    .data(data)
    .enter()
    .append("path")
    .datum(data)
    .attr("class","lineChart")
    .attr("fill", "none")
    .attr("stroke", "#666")
    .attr("stroke-width", 1)      
    .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.perc) })
        .defined( d => d.perc )
    )
    // invisible for now
    .style("opacity", 0.0)

// Add linear gradient
svg.append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", '0%').attr("y1", '0%') 
    .attr("x2", '0%').attr("y2", '100%')
    .selectAll("stop")
    .data([
        {offset: "10%", color: "#08203E"},
        {offset: "95%", color: "#fff"}
    ])
.enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });

// Will be used to keep track of the page.
var counter = 0;

d3.select("#header").html(textContent[counter])

// Clicking will create the viz and text content to be updated
d3.select("body").on("click", () => updateViz(counter))


function updateViz(counterVal){

    counter = counter + 1;

    if (counter == 1){ drawViz(1900, 1900)}
    if (counter == 2){ drawViz(1900, 1914)}
    if (counter == 3){ drawViz(1914, 1936)}
    if (counter == 4){ drawViz(1944, 2000)}
    if (counter == 5){ drawViz(2000, 2020)}
}


function drawViz(prevDate, currentDate){
    // Data with date earlier than currentDate
    filteredData = data.filter( d =>  {return (d.year.getFullYear() <= currentDate)})

    // List of all the years in our data between the two dates
    yearsBetween = data.filter( d =>  {return (d.year.getFullYear() <= currentDate) && (d.year.getFullYear() >= prevDate)}).map(d => d.year.getFullYear())

    // Loop through yearsBetween and draw all years up till that year
    yearsBetween.map((d,i) => {
        // Data with earlier year than our current one in yearsBetween
        filteredData2 = data.filter( p =>  {return (p.year.getFullYear() <= d)})

        // Draw next section of line
        svg.selectAll("path.lineChart")
        .datum(filteredData2)
        .attr("class","lineChart")
        .attr("fill", "none")            
        .attr("stroke", "#666")
        .transition()
        .duration(3000)
        .delay(i * 250)
        .attr("stroke-width", 1)      
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.perc) })
            .defined( d => d.perc )
        )
        .style("opacity", 0.5)

        // Draw next section of gradient
        svg.selectAll("path.gradientArea")
        .datum(filteredData2)
        .attr("class","gradientArea")
        .style("opacity", 0)
        .attr("stroke-width", 0)      
        .attr("d", d3.area()
            .x(function(d) { return x(d.year) })
            .y0(function(d) { return y(d.perc) })
            .y1(function(d) { return y(0) })
            .defined( d => d.perc )
        )
        .style("opacity", 1)
    })

    // Draw the dot for the current year
    svg.selectAll("path.lineChart").attr("marker-end","url(#dot)") 

    // Change text content and scroll animation
    d3.select("#header")
        .html(textContent[counter-1])
        .transition()
        .duration(400)
        .delay(0)
        .style("top", "250px")
        .style("opacity", 0)
        // change content only after text is faded
        .on("end", () => d3.select("#header").html(textContent[counter]))
        .transition()
        .duration(10)
        .delay(0)
        .style("top", "-200px")
        .transition()
        .duration(400)
        .delay(0)
        .style("top", "70px")
        .style("opacity", 1)
         
}

})