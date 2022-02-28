import * as d3 from "d3"
import React from 'react';
import './styles.css';

class YearPie extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.drawChart(true);
    }

    componentDidUpdate() {
        this.drawChart(false);
    }

    drawChart(first) {

        if(first === false) {
            d3.selectAll("svg")["_groups"][0][8].remove()
        }

        var yearTimeData = {
            "Q1": [0, 0, 0],
            "Q2": [0, 0, 0],
            "Q3": [0, 0, 0],
            "Q4": [0, 0, 0]
        };

        var yearTimeDataList = [];

        const allYearTime = ["Q1", "Q2", "Q3", "Q4"];

        let str = "Hello";
        str = str.substring(2);

        for(let i=0; i<this.props.data["wins"].length; i++) {
            let num = this.props.data["wins"][i][1].toString();
            num = parseInt(num, 10)

            if(num <= 3) {
                yearTimeData["Q1"][0] += 1;
                yearTimeData["Q1"][1] += 1;
            } else if(num <= 6 && num > 3) {
                yearTimeData["Q2"][0] += 1;
                yearTimeData["Q2"][1] += 1;
            }
            if(num <= 9 && num > 6) {
                yearTimeData["Q3"][0] += 1;
                yearTimeData["Q3"][1] += 1;
            }
            if(num <= 12 && num > 9) {
                yearTimeData["Q4"][0] += 1;
                yearTimeData["Q4"][1] += 1;
            }
            
        }

        for(let i=0; i<this.props.data["losses"].length; i++) {
            let num = this.props.data["losses"][i][1].toString();
            num = parseInt(num, 10)

            if(num <= 3) {
                yearTimeData["Q1"][0] += 1;
                yearTimeData["Q1"][2] += 1;
            } else if(num <= 6 && num > 3) {
                yearTimeData["Q2"][0] += 1;
                yearTimeData["Q2"][2] += 1;
            } else if(num <= 9 && num > 6) {
                yearTimeData["Q3"][0] += 1;
                yearTimeData["Q3"][2] += 1;
            } else if(num <= 12 && num > 9) {
                yearTimeData["Q4"][0] += 1;
                yearTimeData["Q4"][2] += 1;
            }
        }

        allYearTime.map((yearTime) => {
            yearTimeDataList.push(yearTimeData[yearTime][0]);
        })

        var total = 0;

        for(let a of yearTimeDataList) {
            total += a;
        }

        const w = 400
        const h = 400
        const r = w/2

        // Define the div for the tooltip
        var tooltip = d3
            .select('#record-year-pie-graph')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        const svg = d3
            .select("#record-year-pie-graph")
            .append("svg")
            .attr("width", w)
            .attr("height", h)

        const g = svg.append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        var color = d3.scaleOrdinal(["#77D1D0", "#46A2B7", "#6A7A8E", "#D56170"]);

        // Generate the pie
        var pie = d3.pie();
    
        // Generate the arcs
        var arc = d3.arc()
                    .innerRadius(r/2)
                    .outerRadius(r);
    
                
        //Generate groups
        var arcs = g.selectAll("arc")
                    .data(pie(yearTimeDataList))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
    
        //Draw arc paths
        arcs.append("path")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", arc)
            .on('mouseover', function (event, d, i) {
                
                d.innerRadius = r/2;
                d.outerRadius = r*2;

                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.70');

                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip
                  .html(() => {
                        return `<div><p style="font-weight: 700;">${allYearTime[d.index]}</p><p>Matches: ${yearTimeDataList[d.index]}</p><p>${((yearTimeDataList[d.index] / total)*100).toString().slice(0, 4)}%</p></div>`;
                  })
                  .attr("transform", "translate(" + arc.centroid(d) + ")")
              })
            .on('mouseout', function () {
                tooltip.transition().duration(200).style('opacity', 0);
                d3.select(this).transition()
                    .duration('10')
                    .attr('opacity', '1');
            });
    }

    render(){
        return <div id={"#" + this.props.id}></div>
    }
}

export default YearPie;
