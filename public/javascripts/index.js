const axios = require("axios");
import { renderMap } from "./map.js";
import { medianSales } from "./sales_line_graph";
import { salesVolume } from "./bubbles";

document.addEventListener("DOMContentLoaded", () => {
  renderMap();
  medianSales();
  salesVolume("Brooklyn");

  const lineGraphDropdown = document.querySelector("#line-graph-dropdown");
  lineGraphDropdown.addEventListener("change", () => {
    const currLineGraph = document.querySelector(".curr-line-graph");
    currLineGraph.remove();
    medianSales(
      lineGraphDropdown.options[lineGraphDropdown.selectedIndex].value
    );
  });
});
