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
    const currBubbles = document.querySelector(".bubble");
    currBubbles.remove();

    const lineGraphFacts = document.querySelectorAll(".line-graph-fact");

    for (let i = lineGraphFacts.length - 1; i > -1; i--) {
      while (lineGraphFacts[i].childNodes.length > 0) {
        // debugger;
        lineGraphFacts[i].removeChild(lineGraphFacts[i].lastElementChild);
      }
    }

    appendBubblesToMap(
      lineGraphDropdown.options[lineGraphDropdown.selectedIndex].value
    );
  });
});
