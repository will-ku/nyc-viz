const axios = require("axios");
import renderMap from "./map.js";
import { boroughLineGraph } from "./line_graph";
import { salesVolume } from "./bubbles";

document.addEventListener("DOMContentLoaded", () => {
  renderMap();
  boroughLineGraph();
  salesVolume("Brooklyn");

  const lineGraphDropdown = document.querySelector("#line-graph-dropdown");
  lineGraphDropdown.addEventListener("change", () => {
    const currLineGraph = document.querySelector(".curr-line-graph");
    currLineGraph.remove();
    boroughLineGraph(
      lineGraphDropdown.options[lineGraphDropdown.selectedIndex].value
    );
  });
});
