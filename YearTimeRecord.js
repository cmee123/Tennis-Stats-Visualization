import * as d3 from "d3"
import React from 'react';
import './styles.css';

class YearTimeRecord extends React.Component {

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
            d3.selectAll("svg")["_groups"][0][10].remove()
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
            yearTimeDataList.push([yearTime, yearTimeData[yearTime][1], "W"]);
            yearTimeDataList.push([yearTime, yearTimeData[yearTime][2], "L"]);
        })

        const allTimes = ["Q1", "Q2", "Q3", "Q4", ""]

        const w = 850
        const h = 575
        const paddingSide = 60;
        const paddingBottom = 100;
        const barWidth = (w-paddingSide-paddingSide) / allTimes.length;

        const xScale = d3.scalePoint()
            .domain(allTimes)
            .range([paddingSide, w - paddingSide]);

        
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(yearTimeDataList, (d, i) => {
                if(i%2 === 0) {
                    return d[1] + yearTimeDataList[i+1][1];
                }
            })])
            .range([h - paddingBottom, paddingSide]);

        const yAxis = d3.axisLeft(yScale);

        // Define the div for the tooltip
        var tooltip = d3
            .select('#record-yeartime-graph')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        const svg = d3
            .select("#record-yeartime-graph")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
        
        svg.selectAll("rect")
           .data(yearTimeDataList)
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
                return (yScale(d[1]) - (h - yScale(yearTimeDataList[i-1][1]) - paddingBottom));
            }
        })
           .attr("fill", (d) => {
            if(d[2] === "W") {
               return "#85A94E"; 
            } else {
                return "#B33430";
            }})

            .on('mouseover', function (event, d) {

                let ind = yearTimeDataList.indexOf(d);

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
                      let ind = yearTimeDataList.indexOf(d);
                      if(d[2] === "W") {
                        return `<div><p style="font-weight: 700;">${d[0]}</p><p>Total: ${d[1] + yearTimeDataList[ind+1][1]}</p><p style="color: #85A94E;">Wins: ${d[1]}</p><p style="color: #B33430;">Losses: ${yearTimeDataList[ind+1][1]}</p><p>Win Rate: ${((d[1] / (d[1] + yearTimeDataList[ind+1][1]))*100).toString().slice(0, 4)}%</p></div>`;
                      } else {
                        return `<div><p style="font-weight: 700;">${d[0]}</p><p>Total: ${d[1] + yearTimeDataList[ind-1][1]}</p><p style="color: #85A94E;">Wins: ${yearTimeDataList[ind-1][1]}</p><p style="color: #B33430;">Losses: ${d[1]}</p><p>Win Rate: ${((yearTimeDataList[ind-1][1] / (d[1] + yearTimeDataList[ind-1][1]))*100).toString().slice(0, 4)}%</p></div>`;
                      }
                  }
                  )
                  .style('left', () => xScale(d[0]) + "px")
                  .style('top', 300 + 'px')
                  .style('transform', 'translateX(' + (barWidth + 30 ) + 'px)');
              })
              .on('mouseout', function (event, d) {
                let ind = yearTimeDataList.indexOf(d);
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
                .attr("transform", "translate(5,10)")
                .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", "translate(" + paddingSide + ", 0)")
            .call(yAxis)
    }

    render(){
        return <div id={"#" + this.props.id}></div>
    }
}

export default YearTimeRecord;
