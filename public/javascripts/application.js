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
        if (d === "Bronx") return "The Bronx";
        return d;
      }) // text showed in the menu
      .attr("value", function (d) {
        return d;
      }); // corresponding value returned by the button
  }
};

export const hardcodedWidth = (borough) => {
  switch (borough) {
    case "NYC":
      return "17ch";
    case "Bronx":
      return "11ch";
    case "Brooklyn":
      return "10ch";
    case "Queens":
      return "8.25ch";
    case "Staten Island":
      return "13.2ch";
    case "Manhattan":
      return "11.25ch";
    default:
      break;
  }
};
