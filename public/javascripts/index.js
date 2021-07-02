const axios = require("axios");
import { renderMap } from "./map.js";
import { medianSales } from "./sales_line_graph";
import { appendBubblesToMap } from "./bubbles";
import { boroughDropdown, hardcodedWidth } from "./application";

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
        lineGraphFacts[i].removeChild(lineGraphFacts[i].lastElementChild);
      }
    }

    const mapFacts = document.querySelectorAll(".map-graph-fact");

    for (let i = mapFacts.length - 1; i > -1; i--) {
      while (mapFacts[i].childNodes.length > 0) {
        mapFacts[i].removeChild(mapFacts[i].lastElementChild);
      }
    }

    let headerDropDown = document.querySelector(".header-dropdown");
    headerDropDown.style.width = hardcodedWidth(
      lineGraphDropdown.options[lineGraphDropdown.selectedIndex].value
    );

    let mapFactMessage = document.querySelector(".map-fact-message");
    mapFactMessage.remove();

    appendBubblesToMap(
      lineGraphDropdown.options[lineGraphDropdown.selectedIndex].value
    );
  });
});
