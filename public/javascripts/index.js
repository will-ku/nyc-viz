const axios = require("axios");
import renderMap from "./map.js";
import { boroughLineGraph } from "./line_graph";

document.addEventListener("DOMContentLoaded", () => {
  renderMap();
  boroughLineGraph();

  const lineGraphDropdown = document.querySelector("#line-graph-dropdown");
  lineGraphDropdown.addEventListener("change", () => {
    // function removeAllChildren(parent) {
    //   while (parent.firstChild) {
    //     parent.removeChild(parent.firstChild);
    //   }
    // }
    // removeAllChildren(lineGraphDropdown);
    const currLineGraph = document.querySelector(".curr-line-graph");
    currLineGraph.remove();

    boroughLineGraph(
      lineGraphDropdown.options[lineGraphDropdown.selectedIndex].value
    );
  });
});
