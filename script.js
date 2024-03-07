import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const fetchdata = async () => {
    try {
        const res = await axios.get(
            "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

const render = async () => {
    const data = await fetchdata();
    const varianceData = data.monthlyVariance.map((item) => {
        return [item.year, item.month, item.variance];
    });

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const colors = [
        "black",
        "#151B54",
        "#1E90FF",
        "#82CAFF",
        "#98AFC7",
        "#f7f5bc",
        "#ece75f",
        "#e6cc00",
        "#e69b00",
        "#e47200",
        "#ff2c2c",
        "#A62A2A",
        "#8B0000",
    ];

    const h = 500;
    const w = 1000;

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(varianceData, (d) => d[0]))
        .range([0, w]);

    const yScale = d3.scaleLinear().domain([0, 11]).range([h, 0]);

    const svg = d3
        .select(".svg-container")
        .append("svg")
        .attr("id", "title")
        .attr("height", h)
        .attr("width", w);

    svg.selectAll("rect")
        .data(varianceData)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-year", (d) => d[0])
        .attr("data-month", (d) => d[1] - 1)
        .attr("data-temp", (d) => 8.66 + d[2])
        .attr("x", (d) => xScale(d[0]))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", 5)
        .attr("height", 500 / 11)
        .style("fill", (d) => {
            const temp = Math.floor(8.66 + d[2]) - 1;
            return colors[temp];
        })
        .on("mouseover", (d, i) => {
            d3
                .select("body")
                .append("div")
                .attr("id", "tooltip")
                .attr("data-year", i[0])
                .style("opacity", 0.9)
                .style("position", "absolute")
                .style("top", yScale(i[1] - 1) + 105 + "px")
                .style("left", xScale(i[0]) + 175 + "px").html(`
                <p>${months[i[1] - 1]} - ${i[0]}</p>
                <p>Temperature: ${(8.66 + i[2]).toFixed(1)}℃</p>
                <p>Variance: ${i[2]}℃</p>
                `);
        })
        .on("mouseout", () => d3.selectAll("#tooltip").remove());

    const legend = d3
        .select(".legend-container")
        .append("svg")
        .attr("id", "legend")
        .attr("width", 650)
        .attr("height", 30);

    legend
        .selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("height", 50)
        .attr("width", 50)
        .attr("x", (d, i) => i * 50)
        .attr("y", 10)
        .style("fill", (d, i) => colors[i]);

    const xAxis = d3.axisBottom(xScale).ticks(20).tickFormat(d3.format("d"));
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h})`)
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickFormat((d, i) => months[i]);
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(0, -23)")
        .call(yAxis);

    const xLegScale = d3.scaleLinear().domain([0, 13]).range([0, 650]);
    const xLegAxis = d3.axisBottom(xLegScale).tickFormat((d, i) => i + 1 + "℃");
    legend.append("g").attr("transform", "translate(0, 65)").call(xLegAxis);
};

render();
