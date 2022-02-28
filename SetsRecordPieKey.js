import * as d3 from "d3"
import React from 'react';
import './styles.css';

class SetsRecordPieKey extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.drawChart(true);
    }

    drawChart() {

        const allSets = ["2 Sets", "3 Sets", "4 Sets", "5 Sets"];

        const w = 250
        const h = 200

        var color = d3.scaleOrdinal(["#57167E", "#9B3192", "#EA5F89", "#F7B7A3"]);

        const svg = d3
            .select("#record-sets-pie-graph-key")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("background", "#fff");

        // Add one dot in the legend for each name.
        svg.selectAll("mydots")
            .data(allSets)
            .enter()
            .append("circle")
            .attr("cx", 100)
            .attr("cy", function(d,i){ return 60 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return color(d)})

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(allSets)
            .enter()
            .append("text")
            .attr("x", 120)
            .attr("y", function(d,i){ return 60 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    }

    render(){
        return <div id={"#" + 3}></div>
    }
}

export default SetsRecordPieKey;
