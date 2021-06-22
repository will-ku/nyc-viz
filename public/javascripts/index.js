const axios = require("axios");
import renderMap from "./map.js";
// const MedianSales = require("./sales");

document.addEventListener("DOMContentLoaded", () => {
  //   window.MedianSales = MedianSales;
  // renderMap();

  window.renderMap = renderMap();
});
