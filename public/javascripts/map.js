import { salesVolume } from "./bubbles";

export const renderMap = () => {
  const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  d3.json(
    "https://gist.githubusercontent.com/will-ku/785bea3f2d9faaf7aa90c5c101062426/raw/6904b8580c10c7f69037cf4d6090e6929f1de785/nyc.json"
  ).then(function (nyc) {
    const path = d3
      .geoPath()
      .projection(
        d3
          .geoConicConformal()
          .parallels([33, 45])
          .rotate([96, -39])
          .fitSize([width, height], nyc)
      );

    const salesVolumeDummy = [
      ["Bedford-Stuyvesant", 4177],
      ["Sheepshead Bay", 3817],
      ["East New York", 3491],
      ["Williamsburg", 3236],
      ["Park Slope", 2957],
      ["East Flatbush", 2598],
      ["Bay Ridge", 2311],
      ["Midwood", 2204],
    ];
    // sales data in k:v pairs in obj
    const salesVolumeDummyObj = {};
    salesVolumeDummy.map((ele) => (salesVolumeDummyObj[ele[0]] = ele[1]));
    // just neighborhood name in array
    const salesVolumeNeighborhood = salesVolumeDummy.map((ele) => ele[0]);
    // creating a new nyc array with sales volume data
    const nycArrayWithVol = [];
    nyc.features.map((nycFeature) => {
      let updatedFeature = nycFeature;
      let neighborhood = nycFeature.properties.neighborhood;

      if (salesVolumeNeighborhood.includes(neighborhood)) {
        updatedFeature["salesVol"] = salesVolumeDummyObj[neighborhood];
        return nycArrayWithVol.push(nycFeature);
      }
    });

    const radius = d3.scaleSqrt().domain([0, 5000]).range([0, 20]);
    svg
      .selectAll("path")
      .data(nyc.features)
      .enter()
      .append("path")
      .attr("id", "map")
      .attr("d", path)
      .on("mouseenter", function (d) {
        console.log(d);

        const neighborhood = this.__data__.properties.neighborhood;
        d3.select(this).style("stroke-width", 1.5).style("stroke-dasharray", 0);

        d3.select("#neighborhoodPopover")
          .transition()
          .style("opacity", 1)
          .style("left", d.pageX + "px")
          .style("top", d.pageY + "px")
          .text(neighborhood);
      })
      .on("mouseleave", function (d) {
        // console.log(d);
        d3.select(this)
          .style("stroke-width", 0.25)
          .style("stroke-dasharray", 1);

        d3.select("#cneighborhoodPopoverountyText")
          .transition()
          .style("opacity", 0);
      });

    svg
      .append("g")
      .attr("class", "bubble")
      .selectAll("circle")
      .data(nycArrayWithVol)
      .enter()
      .append("circle")
      .attr("transform", function (d) {
        return "translate(" + path.centroid(d) + ")";
      })
      .attr("r", (d) => radius(d.salesVol));

    // console.log(nycArrayWithVol);
  });
};
