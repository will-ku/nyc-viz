import { salesVolume } from "./bubbles";
import { nycMap, salesVolume } from "./util";

export const renderMap = () => {
  Promise.all([d3.json(nycMap), d3.csv(salesVolume)]).then((promises) => {
    const [nyc, medianSales] = promises;

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

    const radius = d3.scaleSqrt().domain([0, 5000]).range([0, 20]);
    svg
      .selectAll("path")
      .data(nyc.features)
      .enter()
      .append("path")
      .attr("id", "map")
      .attr("d", path)
      .on("mouseenter", function (d) {
        // console.log(d);
        const neighborhood = this.__data__.properties.neighborhood;
        d3.select(this).style("stroke-width", 1.5).style("stroke-dasharray", 0);

        d3.select("#bubblePopover")
          .text("")
          .style("opacity", 0)
          .exit()
          .remove();

        d3.select("#neighborhoodPopover")
          .transition()
          .style("opacity", 1)
          .style("background-color", "white")
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

        d3.select("#neighborhoodPopover")
          .text("")
          .style("opacity", 0)
          .style("background-color", "transparent")
          .exit()
          .remove();
      });
  });
};
