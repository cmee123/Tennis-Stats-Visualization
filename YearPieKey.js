import * as d3 from "d3"
import React from 'react';
import './styles.css';

class YearPieKey extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.drawChart(true);
    }

    drawChart() {

        const allYearTimes = ["Q1", "Q2", "Q3", "Q4"];
        const months = {
            "Q1": "(Jan-Mar)",
            "Q2": "(Apr-Jun)",
            "Q3": "(Jul-Sep)",
            "Q4": "(Oct-Dec)"
        }

        const w = 250
        const h = 200

        var color = d3.scaleOrdinal(["#77D1D0", "#46A2B7", "#6A7A8E", "#D56170"]);

        const svg = d3
            .select("#record-year-pie-graph-key")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("background", "#fff");

        // Add one dot in the legend for each name.
        svg.selectAll("mydots")
            .data(allYearTimes)
            .enter()
            .append("circle")
            .attr("cx", 75)
            .attr("cy", function(d,i){ return 60 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return color(d)})

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(allYearTimes)
            .enter()
            .append("text")
            .attr("x", 95)
            .attr("y", function(d,i){ return 60 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return (d + " " + months[d])})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    }

    render(){
        return <div id={"#" + 3}></div>
    }
}

export default YearPieKey;
