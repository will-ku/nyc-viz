import { boroughs } from "./application";

export const salesVolume = (borough, numYears = 5) => {
  // fetch sales volume data
  d3.csv(
    "https://gist.githubusercontent.com/will-ku/6738acd6b2988fc93d62166da77c7979/raw/3d7f1f8f20059270c5d555d9e54976aceb4555b0/recordSalesVolumeAll"
  ).then((allData) => {
    let data = new Array();
    let boroughArr = new Array();
    // find all neighborhoods in borough (argument) and push object into boroughArr
    for (let i = 0; i < allData.length; i++) {
      if (
        allData[i].areaType === "neighborhood" &&
        allData[i].Borough === `${borough}`
      )
        boroughArr.push(allData[i]);
    }

    // Convert each object in boroughArr to [areaName: sumOfMonthlyVolumes]
    // Looks back # of years based on numYears argument
    let nbhdVols = boroughArr.map((neighborhood) => {
      let sliceVols = Object.entries(neighborhood).slice(
        Object.entries(neighborhood).length - numYears * 12
      );
      let sumOfMonthlyVolumes = sliceVols.reduce(
        (acc, curr) => acc + parseInt(curr[1]),
        0
      );
      return [neighborhood.areaName, sumOfMonthlyVolumes];
    });

    // Sort by descending (highest) volume. Returns top 8
    let highVolNbhd = nbhdVols
      .sort((a, b) => {
        return a[1] - b[1];
      })
      .reverse()
      .slice(0, 8);

    console.log(nbhdVols);
    console.log(highVolNbhd);

    const svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
  });
};
