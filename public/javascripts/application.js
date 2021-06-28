import { boroughs } from "./util";

export const boroughDropdown = () => {
  if (document.getElementsByClassName("curr-borough-dropdown").length === 6) {
    null;
  } else {
    d3.select("#borough-dropdown")
      .selectAll("myOptions")
      .data(boroughs)
      .enter()
      .append("option")
      .attr("class", "curr-borough-dropdown")
      .text(function (d) {
        if (d === "NYC") return "All New York City";
        return d;
      }) // text showed in the menu
      .attr("value", function (d) {
        return d;
      }); // corresponding value returned by the button
  }
};
