import * as d3 from "d3"
import React from 'react';
import './styles.css';

class RoundRecord extends React.Component {

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
            d3.selectAll("svg")["_groups"][0][4].remove()
        }

        var roundData = {};
        var roundDataList = [];

        for(let i=0; i<this.props.data["wins"].length; i++) {
            if(this.props.data["wins"][i][2].includes("Olympic") === false) {
                if(roundData.hasOwnProperty(this.props.data["wins"][i][3])) {
                roundData[this.props.data["wins"][i][3]][0] += 1; 
                } else {
                    roundData[this.props.data["wins"][i][3]] = [1, 0]
                }
            }
            
        }

        for(let i=0; i<this.props.data["losses"].length; i++) {
            if(this.props.data["losses"][i][2].includes("Olympic") === false) {
                if(roundData.hasOwnProperty(this.props.data["losses"][i][3])) {
                    roundData[this.props.data["losses"][i][3]][1] += 1; 
                } else {
                    roundData[this.props.data["losses"][i][3]] = [0, 1]
                }
            }
        }

        const allRounds = ["Round Robin", "1st Round Qualifying",  "2nd Round Qualifying", "3rd Round Qualifying", "Round of 128", "Round of 64", "Round of 32", "Round of 16", "Quarter-Finals", "Semi-Finals", "Finals", ""]

        allRounds.map((round) => {
            if(roundData.hasOwnProperty(round) === true) {
                roundDataList.push([round, roundData[round][0], "W"]);
                roundDataList.push([round, roundData[round][1], "L"]);
            } else {
                roundDataList.push([round, 0, "W"])
                roundDataList.push([round, 0, "L"])
            }
        })

        const w = 850
        const h = 575
        const paddingSide = 60;
        const paddingBottom = 100;
        const barWidth = (w-paddingSide-paddingSide) / allRounds.length;

        const xScale = d3.scalePoint()
            .domain(allRounds)
            .range([paddingSide, w - paddingSide]);

        
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(roundDataList, (d, i) => {
                if(i%2 === 0) {
                    return d[1] + roundDataList[i+1][1];
                }
            })])
            .range([h - paddingBottom, paddingSide]);

        const yAxis = d3.axisLeft(yScale);

        // Define the div for the tooltip
        var tooltip = d3
            .select('#record-round-graph')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        const svg = d3
            .select("#record-round-graph")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
        
        svg.selectAll("rect")
           .data(roundDataList)
           .enter()
           .append("rect")
           .attr("id", (d, i) => {
                if(d[2] === "W") {
                    return `W${i}`;
                } else {
                    return `L${i}`;
                }
            })
           .attr("height", (d) => h - yScale(d[1]) - paddingBottom)
           .attr("width", barWidth)
           .attr("x", (d, i) => xScale(d[0]))
           .attr("y", (d, i) => {
            if(d[2] === "W") {
               return yScale(d[1]); 
            } else {
                return (yScale(d[1]) - (h - yScale(roundDataList[i-1][1]) - paddingBottom));
            }
        })
           .attr("fill", (d) => {
            if(d[2] === "W") {
               return "#85A94E"; 
            } else {
                return "#B33430";
            }})

            .on('mouseover', function (event, d) {

                let ind = roundDataList.indexOf(d);

                if(d[2] === "W") {
                    svg.select(`#W${ind}`)
                        .transition()
                        .duration(50)
                        .style("opacity", "0.70")
                    svg.select(`#L${ind+1}`)
                        .transition()
                        .duration(50)
                        .style("opacity", "0.70")
                } else if (d[2] === "L") {
                    svg.select(`#W${ind-1}`)
                        .transition()
                        .duration(50)
                        .style("opacity", "0.70")
                    svg.select(`#L${ind}`)
                        .transition()
                        .duration(50)
                        .style("opacity", "0.70")
                }
                
                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip
                  .html(() => {
                      let ind = roundDataList.indexOf(d);
                      if(d[2] === "W") {
                        return `<div><p style="font-weight: 700;">${d[0]}</p><p>Total: ${d[1] + roundDataList[ind+1][1]}</p><p style="color: #85A94E;">Wins: ${d[1]}</p><p style="color: #B33430;">Losses: ${roundDataList[ind+1][1]}</p><p>Win Rate: ${((d[1] / (d[1] + roundDataList[ind+1][1]))*100).toString().slice(0, 4)}%</p></div>`;
                      } else {
                        return `<div><p style="font-weight: 700;">${d[0]}</p><p>Total: ${d[1] + roundDataList[ind-1][1]}</p><p style="color: #85A94E;">Wins: ${roundDataList[ind-1][1]}</p><p style="color: #B33430;">Losses: ${d[1]}</p><p>Win Rate: ${((roundDataList[ind-1][1] / (d[1] + roundDataList[ind-1][1]))*100).toString().slice(0, 4)}%</p></div>`;
                      }
                  }
                  )
                  .style('left', () => xScale(d[0]) + "px")
                  .style('top', 300 + 'px')
                  .style('transform', 'translateX(' + (barWidth + 30 ) + 'px)');
              })
              .on('mouseout', function (event, d) {
                let ind = roundDataList.indexOf(d);
                if(d[2] === "W") {
                    svg.select(`#W${ind}`)
                        .transition()
                        .duration(50)
                        .style("opacity", "1")
                    svg.select(`#L${ind+1}`)
                        .transition()
                        .duration(50)
                        .style("opacity", "1")
                } else if (d[2] === "L") {
                    svg.select(`#W${ind-1}`)
                        .transition()
                        .duration(50)
                        .style("opacity", "1")
                    svg.select(`#L${ind}`)
                        .transition()
                        .duration(50)
                        .style("opacity", "1")
                }
                tooltip.transition().duration(200).style('opacity', 0);
              });

        svg.append("g")
            .attr("transform", "translate(0, " + (h - paddingBottom) + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
                .attr("transform", "translate(-10,10)rotate(-45)")
                .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", "translate(" + paddingSide + ", 0)")
            .call(yAxis)
    }

    render(){
        return <div id={"#" + this.props.id}></div>
    }
}

export default RoundRecord;
