import * as d3 from "d3"
import React from 'react';
import './styles.css';

class YearRecord extends React.Component {

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
            d3.selectAll("svg")["_groups"][0][1].remove()
        }

        var yearsData = {};
        var yearsDataList = [];

        for(let i=0; i<this.props.data["wins"].length; i++) {
            if(yearsData.hasOwnProperty(this.props.data["wins"][i][0])) {
                yearsData[this.props.data["wins"][i][0]][0] += 1; 
            } else {
                yearsData[this.props.data["wins"][i][0]] = [1, 0]
            }
        }

        for(let i=0; i<this.props.data["losses"].length; i++) {
            if(yearsData.hasOwnProperty(this.props.data["losses"][i][0])) {
                yearsData[this.props.data["losses"][i][0]][1] += 1; 
            } else {
                yearsData[this.props.data["losses"][i][0]] = [0, 1]
            }
        }

        Object.keys(yearsData).map((key, ind) => {
            yearsDataList.push([key, yearsData[key][0], "W"])
            yearsDataList.push([key, yearsData[key][1], "L"])
        })

        yearsDataList.push(["2023", 0, "W"]);
        yearsDataList.push(["2023", 0, "L"]);

        const w = 850
        const h = 500
        const padding = 60;
        const barWidth = 2 * ((w-padding-padding) / yearsDataList.length);
        

        const xScale = d3.scaleLinear()
            .domain([d3.min(yearsDataList, (d) => d[0]), d3.max(yearsDataList, (d) => d[0])])
            .range([padding, w - padding]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(yearsDataList, (d, i) => {
                if(i%2 === 0) {
                    return d[1] + yearsDataList[i+1][1];
                }
            })])
            .range([h - padding, padding]);

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(yScale);

        // Define the div for the tooltip
        var tooltip = d3
            .select('#record-year-graph')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        const svg = d3
            .select("#record-year-graph")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
        
        svg.selectAll("rect")
           .data(yearsDataList)
           .enter()
           .append("rect")
           .attr("id", (d, i) => {
               if(d[2] === "W") {
                   return `W${i}`;
               } else {
                   return `L${i}`;
               }
           })
           .attr("height", (d) => h - yScale(d[1]) - padding)
           .attr("width", barWidth)
           .attr("x", (d) => xScale(d[0]))
           .attr("y", (d, i) => {
               if(d[2] === "W") {
                  return yScale(d[1]); 
               } else {
                   return (yScale(d[1]) - (h - yScale(yearsDataList[i-1][1]) - padding));
               }
           })
           .attr("fill", (d) => {
            if(d[2] === "W") {
               return "#85A94E"; 
            } else {
                return "#B33430";
            }})

            .on('mouseover', function (event, d) {
                // d or datum is the height of the
                // current rect

                let ind = yearsDataList.indexOf(d);

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
                      if(d[2] === "W") {
                        return `<div><p style="font-weight: 700;">${d[0]}</p><p>Total: ${d[1] + yearsDataList[ind+1][1]}</p><p style="color: #85A94E;">Wins: ${d[1]}</p><p style="color: #B33430;">Losses: ${yearsDataList[ind+1][1]}</p><p>Win Rate: ${((d[1] / (d[1] + yearsDataList[ind+1][1]))*100).toString().slice(0, 4)}%</p></div>`;
                      } else {
                        return `<div><p style="font-weight: 700;">${d[0]}</p><p>Total: ${d[1] + yearsDataList[ind-1][1]}</p><p style="color: #85A94E;">Wins: ${yearsDataList[ind-1][1]}</p><p style="color: #B33430;">Losses: ${d[1]}</p><p>Win Rate: ${((yearsDataList[ind-1][1] / (d[1] + yearsDataList[ind-1][1]))*100).toString().slice(0, 4)}%</p></div>`;
                      }
                  }
                  )
                  .style('left', (xScale(d[0]) + barWidth) + 'px')
                  .style('top', 275 + 'px')
                  .style('transform', 'translateX(60px)');
            })

            .on('mouseout', function (event, d, i) {
                let ind = yearsDataList.indexOf(d);
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
            .attr("transform", "translate(0, " + (h - padding) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis)
    }

    render(){
        return <div id={"#" + this.props.id}></div>
    }
}

export default YearRecord;
