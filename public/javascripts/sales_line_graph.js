import { boroughDropdown } from "./application";
import { boroughs } from "./util";

export const medianSales = (area = "NYC", numYears) =>
  d3
    .csv(
      "https://gist.githubusercontent.com/will-ku/87dc16f167af2d117ada33035c425d17/raw/08c396370ad39588f38fd6c79f6b1252d4def2e6/medianSalesPrice_All.csv"
    )
    .then((allData) => {
      let data = new Array();
      // define variable for what I'm interested in
      let boroughPrices;

      // find a particular object aka neighborhood or area (ex: just NYC)
      for (let i = 0; i < allData.length; i++) {
        if (allData[i].areaName === `${area}`) boroughPrices = allData[i];
      }
      // removing extra k-v pairs that won't be shown on the line graph
      delete boroughPrices["areaName"];
      delete boroughPrices["Borough"];
      delete boroughPrices["areaType"];

      // building data object
      data = Object.entries(boroughPrices).map((entry) => {
        let parseDates = d3.timeParse("%Y-%m");
        return {
          date: parseDates(entry[0]),
          value: parseInt(entry[1]),
        };
      });
      const margin = { top: 20, right: 60, bottom: 45, left: 55 };
      const height = 450;
      const width = 700;

      const bisect = function (mx) {
        const bisect = d3.bisector((d) => d.date).left;
        const date = x.invert(mx);
        const index = bisect(data, date, 1);
        const a = data[index - 1];
        const b = data[index];
        return b && date - a.date > b.date - date ? b : a;
      };

      function formatDate(date) {
        return date.toLocaleString("en", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        });
      }

      function formatValue(value) {
        return value.toLocaleString("en", {
          style: "currency",
          currency: "USD",
        });
      }

      function callout(g, value) {
        if (!value) return g.style("display", "none");

        g.style("display", null)
          .style("pointer-events", "none")
          .style("font", "10px sans-serif");

        const path = g
          .selectAll("path")
          .data([null])
          .join("path")
          .attr("fill", "white")
          .attr("stroke", "black");

        const text = g
          .selectAll("text")
          .data([null])
          .join("text")
          .call((text) =>
            text
              .selectAll("tspan")
              .data((value + "").split(/\n/))
              .join("tspan")
              .attr("x", 0)
              .attr("y", (d, i) => `${i * 1.1}em`)
              .style("font-weight", (_, i) => (i ? null : "bold"))
              .style("font-size", "0.9rem")
              .text((d) => d)
          );

        const { x, y, width: w, height: h } = text.node().getBBox();

        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr(
          "d",
          `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`
        );
      }

      const xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 50)
            .tickSizeOuter(2)
        );

      // const prefix = d3.formatPrefix(1.21e6);

      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(
            d3
              .axisLeft(y)
              .ticks(7)
              .tickFormat((d) => {
                let formatValue = d3.format(".2s");
                return formatValue(d);
              })
          )
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .select(".tick:last-of-type text")
              .clone()
              .attr("x", 3)
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .text(data.y)
          );

      const myColor = d3.scaleOrdinal().domain(boroughs).range(d3.schemeSet2);

      const x = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => d.date))
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.value - 100000),
          d3.max(data, (d) => d.value),
        ])
        // .domain([0, d3.max(data, (d) => d.value)])
        // .domain([200000, 1500000])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line()
        .defined((d) => !isNaN(d.value))
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      function chart() {
        const svg = d3
          .select(".line-graph")
          .append("svg")
          .attr("viewBox", [0, 0, width, height])
          .attr("class", "curr-line-graph");

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "orange")
          // .attr("stroke", "#079FB4")
          .attr("stroke-width", 2)
          .attr("stroke-linejoin", "round")
          .attr("stroke-lincap", "round")
          .attr("d", line);

        const tooltip = svg.append("g");

        svg.on("touchmove mousemove", function (event) {
          const { date, value } = bisect(d3.pointer(event, this)[0]);
          tooltip.attr("transform", `translate(${x(date)},${y(value)})`).call(
            callout,
            `${formatValue(value)}
        ${formatDate(date)}`
          );
        });

        svg.on("touchend mouseleave", () => tooltip.call(callout, null));

        return svg.node();
      }

      // Line Graph facts

      const percentIncreaseSinceTwentyTen =
        `${(
          ((data[data.length - 1].value - data[0].value) / data[0].value) *
          100
        ).toFixed(2)}` + "%";

      const avgOf2021MedianSales =
        "$" +
        `${(
          data
            .slice(data.length - (data.length - 12 * (2021 - 2010))) // 11 stands for 2021 - 2010
            .reduce((acc, d) => acc + d.value, 0) /
          data.slice(data.length - (data.length - 12 * (2021 - 2010))).length /
          1000
        ).toFixed(0)}` +
        "k";

      const lineGraphHeader = document.querySelector(".line-graph-header");
      lineGraphHeader.textContent = "Median Sales";

      const factOne = document.querySelector("#line-graph-fact-1");
      const factOneDiv = document.createElement("div");
      factOneDiv.textContent = percentIncreaseSinceTwentyTen;
      factOneDiv.setAttribute("class", "fact-num");
      factOne.append(factOneDiv);
      const factOneDetails = document.createElement("div");
      factOneDetails.textContent =
        "Percentage median sales price increase from January 2010 to May 2021.";
      factOneDetails.setAttribute("class", "fact-details");
      factOne.append(factOneDetails);

      const factTwo = document.querySelector("#line-graph-fact-2");
      const factTwoDiv = document.createElement("div");
      factTwoDiv.textContent = avgOf2021MedianSales;
      factTwoDiv.setAttribute("class", "fact-num");
      factTwo.append(factTwoDiv);
      const factTwoDetails = document.createElement("div");
      factTwoDetails.textContent = "Average of median sales prices YTD.";
      factTwoDetails.setAttribute("class", "fact-details");
      factTwo.append(factTwoDetails);

      chart();
    });

// const salesFacts = () => {
//   const facts = document.querySelector(".facts");
// };
