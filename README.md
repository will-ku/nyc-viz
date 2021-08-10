# NYC Viz

![alt text](https://github.com/will-ku/nyc-viz/blob/main/public/styles/NYC%20Viz%20Home.png)

# Background
NYC Viz is a _data visualization application_ that provides a high level overview of the real estate data in New York City since 2010. This project uses Javascript library D3.js to offer an interactive way to consume the information. Users are able to analyze sales price and sales volume data. Users can also filter by borough or view data for all of New York City. All data is provided by [StreetEasy](https://streeteasy.com/blog/data-dashboard/?agg=Total&metric=Inventory&type=Sales&bedrooms=Any%20Bedrooms&property=Any%20Property%20Type&minDate=2010-01-01&maxDate=2021-06-01&area=Flatiron,Brooklyn%20Heights). 

Have a look around! You can access the live demo [here](https://will-ku.github.io/nyc-viz/).

# Technologies
The project will be implemented with the following technologies:
* HTML/CSS
* Javascript
* D3.js (SVG rendering)

# Features

## Median Sales Prices
A line graph with tooltip is used to display monthly median sales prices in New York City from January 2010 - May 2021. Users are able to:
* Filter by a specific borough or view all NYC
* Hover over the line graph to view the median sales price for any particular month

![alt text](https://github.com/will-ku/nyc-viz/blob/main/public/styles/NYC%20Viz%20Median%20Prices.png)

To accomplish this, median sales price data fetched from an external CSV using `d3.csv()` has to be scrubbed and built into a Javascript object defined by `data`.

```javascript
      let boroughPrices;

      // find a particular object aka neighborhood or area (ex: just NYC)
      for (let i = 0; i < allData.length; i++) {
        if (allData[i].areaName === `${area}`) boroughPrices = allData[i];
      }
      // removing extra k-v pairs that won't be shown on the line graph
      delete boroughPrices["areaName"];
      delete boroughPrices["Borough"];
      delete boroughPrices["areaType"];

      // building data object
      data = Object.entries(boroughPrices).map((entry) => {
        let parseDates = d3.timeParse("%Y-%m");
        return {
          date: parseDates(entry[0]),
          value: parseInt(entry[1]),
        };
      });

```

D3.js functions (`d3.scaleUtc()` and `d3.scaleLiner()`) were used to construct the _x_ and _y_ coordinates, respectively, from the scrubbed data. These coordinates are used to draw the line onto the graph.

```javascript
      const x = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => d.date))
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.value - 100000),
          d3.max(data, (d) => d.value),
        ])
        .nice()
        .range([height - margin.bottom, margin.top])
 ```

The tooltip for the line graph displays when a user hovers over the graph.

```javascript
svg.on("touchmove mousemove", function (event) {
          const { date, value } = bisect(d3.pointer(event, this)[0]);
          tooltip.attr("transform", `translate(${x(date)},${y(value)})`).call(
            callout,
            `${formatValue(value)}
        ${formatDate(date)}`
          );
        });
```


## Sales Volume
Monthly sales volume data is overlaid onto a geoJSON map of New York City. Hovering over the map will expose a tooltip that displays the neighborhood you are hovering over.

![alt text](https://github.com/will-ku/nyc-viz/blob/main/public/styles/NYC%20Viz%20Sales%20Volume.png)

GeoJSON data used for the map of New York City is provided by [BetaNYC](http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson).

```javascript
    const path = d3
      .geoPath()
      .projection(
        d3
          .geoConicConformal()
          .parallels([33, 45])
          .rotate([96, -39])
          .fitSize([width, height], nyc)
      );
```

Orange bubbles represent the 5 neighborhoods with the highest sales volumes over the past 5 years. The size of the bubble is directly related to the sales volume.

```javascript
svg
      .append("g")
      .attr("class", "bubble")
      .selectAll("circle")
      .data(highVolFeatures)
      .enter()
      .append("circle")
      .attr("transform", function (d) {
        return "translate(" + path.centroid(d) + ")";
      })
      .attr("r", (d) => radius(d.salesVol))
```

To retrieve data for the map bubbles, two API calls (one to a CSV containing StreetEasy's sales volume data, another to [BetaNYC's geoJSON data](http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson)). A seperate call to the geoJSON object is required to give `d3.path` references to high volume sales neighborhoods. Once the promise resolves successfully, the data is scrubbed before total sales volume numbers are calculated.

```javascript
// find all neighborhoods in borough (argument) and push object into boroughArr
    for (let i = 0; i < salesVolumeData.length; i++) {
      switch (borough) {
        case "NYC":
          if (salesVolumeData[i].areaType === "neighborhood")
            boroughArr.push(salesVolumeData[i]);
          break;
        default:
          if (
            salesVolumeData[i].areaType === "neighborhood" &&
            salesVolumeData[i].Borough === `${borough}`
          )
            boroughArr.push(salesVolumeData[i]);
          break;
      }
    }

    let nbhdVols = boroughArr.map((neighborhood) => {
      let sliceVols = Object.entries(neighborhood).slice(
        Object.entries(neighborhood).length - numYears * 12
      );
      let sumOfMonthlyVolumes = sliceVols.reduce(
        (acc, curr) => acc + parseInt(curr[1]),
        0
      );
      return [mappableNeighborhood(neighborhood.areaName), sumOfMonthlyVolumes];
    });

    // Sort by descending (highest) volume. Returns top 8 neighborhoods. Ex: [["Williamsburg, 1000"], ["Greenpoint, 500"]]
    const highVolNbhdArr = nbhdVols
      .sort((a, b) => {
        return a[1] - b[1];
      })
      .reverse()
      .slice(0, numBubbles);
```



## Filter by Borough
By default, the application will display data for all of New York City. However, users have the option to filter down by a particular using a dropdown menu. An event listener will remove and re-render elements from the DOM to represent the user's selection.

```javascript
const boroughSelection = document.querySelector("#borough-dropdown");
  boroughSelection.addEventListener("change", () => {
    const currLineGraph = document.querySelector(".curr-line-graph");
    currLineGraph.remove();
    medianSales(boroughSelection.options[boroughSelection.selectedIndex].value);
    const currBubbles = document.querySelector(".bubble");
    currBubbles.remove();
  ```
  
  To render the data based on selection, a helper function called `boroughDropdown()` was created.
```javascript
const boroughDropdown = () => {
    d3.select("#borough-dropdown")
      .selectAll("myOptions")
      .data(boroughs)
      .enter()
      .append("option")
      .attr("class", "curr-borough-dropdown")
      .text(function (d) {
        if (d === "NYC") return "All New York City";
        if (d === "Bronx") return "The Bronx";
        return d;
      })
      .attr("value", function (d) {
        return d;
      }); 
}
```
