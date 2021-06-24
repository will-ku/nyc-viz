const margin = { top: 20, right: 50, bottom: 30, left: 50 },
  width = 630 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const x = d3.scaleTime().range([0, width]);

const y = d3.scaleLinear().range([height, 0]);

const xAxis = d3
  .axisBottom()
  .scale(x)
  .ticks(5)
  .tickSizeInner(15)
  .tickSizeOuter(0);

const yAxis = d3
  .axisLeft()
  .scale(y)
  .tickFormat(d3.format("$.2f"))
  .ticks(5)
  .tickSizeInner(15)
  .tickSizeOuter(0);

const line = d3
  .line()
  .x(function (d) {
    return x(d.date);
  })
  .y(function (d) {
    return y(d.close);
  });

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

export const nycSalesData = async () => {
  // const allData = await d3.csv(
  //   "https://gist.githubusercontent.com/will-ku/87dc16f167af2d117ada33035c425d17/raw/08c396370ad39588f38fd6c79f6b1252d4def2e6/medianSalesPrice_All.csv"
  // );
  const allData = await d3.csv(
    "https://gist.githubusercontent.com/will-ku/87dc16f167af2d117ada33035c425d17/raw/08c396370ad39588f38fd6c79f6b1252d4def2e6/medianSalesPrice_All.csv",
    d3.autoType
  );

  let nycPrices;

  for (let i = 0; i < allData.length; i++) {
    if (allData[i].areaName === "NYC") nycPrices = arrayOfPrices(allData[i]);
  }

  // x.domain(d3.extent(allData.columns.slice(3)));
  // // if more than one data set, would need to combine y
  // y.domain(d3.extent(nycPrices));

  // svg
  //   .append("g")
  //   .attr("class", "x axis")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(xAxis);

  // svg.append("g").attr("class", "y axis").call(yAxis);
  // // debugger;
  // svg.append("line").attr({
  //   class: "horizontalGrid",
  //   x1: 0,
  //   x2: width,
  //   y1: y(0),
  //   y2: y(0),
  //   fill: "none",
  //   "shape-rendering": "crispEdges",
  //   stroke: "black",
  //   "stroke-width": "1px",
  //   "stroke-dasharray": "3, 3",
  // });

  // const combinedData = [];
  // combinedData[0] = { name: "NYC", data: nycPrices };

  // svg
  //   .selectAll(".plot-axis")
  //   .data(combinedData)
  //   .enter()
  //   .append("g")
  //   .attr("class", "plot-axis");

  // const path = svg
  //   .selectAll(".plot-axis")
  //   .append("path")
  //   .attr("class", "line")
  //   .attr("d", function (d) {
  //     return line(d.data);
  //   });

  // const totalLength = [path._groups[0][0].getTotalLength()];

  // console.log(totalLength);

  // d3.select(path._groups[0][0])
  //   .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0])
  //   .attr("stroke-dashoffset", totalLength[0])
  //   .transition()
  //   .duration(5000)
  //   .ease(d3.easeLinear)
  //   .attr("stroke-dashoffset", 0);
};

const arrayOfPrices = (dataObject) => {
  return Object.values(dataObject).slice(3);
};

const parseDate = d3.timeParse("%m/%d/%Y");
