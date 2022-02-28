import * as d3 from "d3"
import React from 'react';
import './styles.css';

class RoundRecordKey extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.drawChart(true);
    }

    drawChart() {

        const allRounds = ["Round Robin", "1st Round Qualifying",  "2nd Round Qualifying", "3rd Round Qualifying", "Round of 128", "Round of 64", "Round of 32", "Round of 16", "Quarter-Finals", "Semi-Finals", "Finals"];

        const w = 300
        const h = 400

        var color = d3.scaleOrdinal(["#865d85", "#98d8f6", "#FE75A6", "#605D6F", "#3D394F","#5B736B","#5AC8AD","#F8BE52","#F67F46","#C3454E","#D94556","#79A8B7"]);

        const svg = d3
            .select("#record-round-pie-graph-key")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("background", "#fff");

        // Add one dot in the legend for each name.
        svg.selectAll("mydots")
            .data(allRounds)
            .enter()
            .append("circle")
            .attr("cx", 70)
            .attr("cy", function(d,i){ return 75 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return color(d)})

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(allRounds)
            .enter()
            .append("text")
            .attr("x", 90)
            .attr("y", function(d,i){ return 75 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    }

    render(){
        return <div id={"#" + 3}></div>
    }
}

export default RoundRecordKey;
