const renderMap = () => {
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

    svg
      .selectAll("path")
      .data(nyc.features)
      .enter()
      .append("path")
      .attr("d", path)
      .on("mouseenter", function (d) {
        // console.log(d);

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
    // console.log(nyc);
  });
};

export default renderMap;
