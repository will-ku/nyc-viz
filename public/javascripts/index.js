const axios = require("axios");
import { renderMap } from "./map.js";
import { medianSales } from "./sales_line_graph";
import { appendBubblesToMap } from "./bubbles";

document.addEventListener("DOMContentLoaded", () => {
  renderMap();
  medianSales();
  setTimeout(() => appendBubblesToMap("Manhattan"), 100);

  const lineGraphDropdown = document.querySelector("#line-graph-dropdown");
  lineGraphDropdown.addEventListener("change", () => {
    const currLineGraph = document.querySelector(".curr-line-graph");
    currLineGraph.remove();
    medianSales(
      lineGraphDropdown.options[lineGraphDropdown.selectedIndex].value
    );
  });
});
