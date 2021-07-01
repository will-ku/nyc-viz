const axios = require("axios");
import { renderMap } from "./map.js";
import { medianSales } from "./sales_line_graph";
import { appendBubblesToMap } from "./bubbles";
import { boroughDropdown } from "./application";

document.addEventListener("DOMContentLoaded", () => {
  boroughDropdown();
  renderMap();
  medianSales();
  appendBubblesToMap();

  const lineGraphDropdown = document.querySelector("#borough-dropdown");
  lineGraphDropdown.addEventListener("change", () => {
    const currLineGraph = document.querySelector(".curr-line-graph");
    currLineGraph.remove();
    medianSales(
      lineGraphDropdown.options[lineGraphDropdown.selectedIndex].value
    );
    debugger;
    const currBubbles = document.querySelector(".bubble");
    currBubbles.remove();

    const factNumbersArr = document.querySelectorAll(".fact-num");
    const factDetailsArr = document.querySelectorAll(".fact-details");
    // while (factNumbersArr[0]) {
    //   factNumbersArr[0];
    // }

    // factNumbers.remove();
    // factDetails.remove();
    appendBubblesToMap(
      lineGraphDropdown.options[lineGraphDropdown.selectedIndex].value
    );
  });
});
