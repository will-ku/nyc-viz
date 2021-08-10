# NYC Viz

![alt text](https://github.com/will-ku/nyc-viz/blob/main/public/styles/NYC%20Viz%20Home.png)

# Background
NYC Viz provides a high level overview of the real estate data in New York City since 2010. This project uses Javascript library D3.js to offer an interactive way to consume the information. Users are able to analyze sales price and sales volume data. Users can also filter by borough or view data for all of New York City. All data is provided by [StreetEasy](https://streeteasy.com/blog/data-dashboard/?agg=Total&metric=Inventory&type=Sales&bedrooms=Any%20Bedrooms&property=Any%20Property%20Type&minDate=2010-01-01&maxDate=2021-06-01&area=Flatiron,Brooklyn%20Heights). 

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

To accomplish this, median sales price data fetched from an external CSV using `d3.csv()` has to be cleaned and built into Javascript objects that can be rendered onto map.

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

The tooltip for the line graph will display when a user hovers over the graph.
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

Orange bubbles represent the neighborhoods with the highest sales volumes over the past 5 years. The size of the bubble is directly related to the sales volume.

![alt text](https://github.com/will-ku/nyc-viz/blob/main/public/styles/NYC%20Viz%20Sales%20Volume.png)

The map is constructed by fetching geoJSON data of New York City from an external source.

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

Bubbles only appear for the 5 neighborhoods with the highest volume in sales, based on the user's selection.

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
