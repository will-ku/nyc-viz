import { boroughs, nycMap, salesVolume, mappableNeighborhood } from "./util";

export const appendBubblesToMap = (
  borough = "NYC",
  numYears = 5,
  numBubbles = 5
) => {
  Promise.all([d3.json(nycMap), d3.csv(salesVolume)]).then((promises) => {
    const [nyc, salesVolumeData] = promises;
    let data = new Array();
    let boroughArr = new Array();

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

    // Object representation of high volume neighborhood array (highVolNbdhArr)
    const highVolNbhdObj = {};
    highVolNbhdArr.map((ele) => (highVolNbhdObj[ele[0]] = ele[1]));
    // Array with just neighborhood names
    let highVolNbhdNames = [];
    highVolNbhdNames = highVolNbhdArr.map((ele) => ele[0]);

    // Array that will contain geo features. To be fed to d3 function to create bubbles
    const highVolFeatures = [];
    nyc.features.map((nycFeature) => {
      let updatedFeature = nycFeature;
      let neighborhood = nycFeature.properties.neighborhood;
      if (highVolNbhdNames.includes(neighborhood)) {
        {
          updatedFeature["salesVol"] = highVolNbhdObj[neighborhood];
        }
        return highVolFeatures.push(nycFeature);
      }
    });
    // console.log(highVolFeatures);

    const radius = d3.scaleSqrt().domain([0, 5000]).range([0, 20]);
    const svg = d3.select("#nyc-map"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    const path = d3
      .geoPath()
      .projection(
        d3
          .geoConicConformal()
          .parallels([33, 45])
          .rotate([96, -39])
          .fitSize([width, height], nyc)
      );

    svg
      .selectAll("path")
      .data(nyc.features)
      .enter()
      .append("path")
      .attr("id", "map")
      .attr("d", path);

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
      .on("mouseenter", function (d) {
        // console.log(d);

        const neighborhood = this.__data__.properties.neighborhood;
        const salesVol = this.__data__.salesVol;
        d3.select(this).style("stroke-width", 1.5).style("stroke-dasharray", 0);

        d3.select("#neighborhoodPopover")
          .text("")
          .style("opacity", 0)
          .exit()
          .remove();

        d3.select("#bubblePopover")
          .transition()
          .style("opacity", 1)
          .style("left", d.pageX + "px")
          .style("top", d.pageY + "px")
          .text(`${neighborhood}, Sales Volume: ${salesVol}`);
      })
      .on("mouseleave", function (d) {
        // console.log(d);
        d3.select(this)
          .style("stroke-width", 0.25)
          .style("stroke-dasharray", 1);

        d3.select("#bubblePopoverountyText")
          .transition()
          .style("opacity", 0)
          .text("")
          .remove();
      });
    const mapFactHeader = document.querySelector(".map-graph-header");
    mapFactHeader.textContent = "Highest Volume in Sales";
    const mapUL = document.querySelector(".map-graph-fact");

    if (borough === "Staten Island") {
      let mapListItem = document.createElement("li");
      mapListItem.setAttribute("class", "map-li");
      mapUL.append(mapListItem);
      let sorrySI = document.createElement("div");
      sorrySI.setAttribute("class", "map-li-unavailable");
      sorrySI.textContent =
        "Oops, we don't have any historical sales volume data for Staten Island yet. Sorry for the inconvenience! 🥺";
      mapListItem.append(sorrySI);
    }

    highVolNbhdArr.map((neighborhood) => {
      let mapListItem = document.createElement("li");
      mapListItem.setAttribute("class", "map-li");
      mapUL.append(mapListItem);

      let mapListItemNbd = document.createElement("div");
      mapListItemNbd.setAttribute("class", "map-li-nbhd");
      mapListItemNbd.textContent = neighborhood[0];

      let mapListItemNum = document.createElement("div");
      mapListItemNum.setAttribute("class", "map-li-num");
      mapListItemNum.textContent = neighborhood[1];

      mapListItem.append(mapListItemNbd);
      mapListItem.append(mapListItemNum);
    });

    const mapFactSubContainer = document.querySelector(".map-fact-container");
    const salesVolumeMessage = document.createElement("div");
    salesVolumeMessage.setAttribute("class", "map-fact-message");
    salesVolumeMessage.textContent =
      "Sales volume is calculated by summing the past 5 years of monthly sales volume per neighborhood, as provided by StreetEasy. Sales volume data may not be available in all boroughs.";
    mapFactSubContainer.append(salesVolumeMessage);
  });
};
