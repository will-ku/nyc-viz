const axios = require("axios");
import renderMap from "./map.js";
import { nycLineGraph } from "./line_graph";

document.addEventListener("DOMContentLoaded", () => {
  renderMap();
  nycLineGraph();
});
