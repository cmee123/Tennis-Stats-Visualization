import * as d3 from "d3"
import React from 'react';
import './styles.css';

class RoundPie extends React.Component {

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
            d3.selectAll("svg")["_groups"][0][2].remove()
        }

        var roundData = {
            "Round Robin": 0,
            "1st Round Qualifying": 0,
            "2nd Round Qualifying": 0,
            "3rd Round Qualifying": 0,
            "Round of 128": 0,
            "Round of 64": 0,
            "Round of 32": 0,
            "Round of 16": 0,
            "Quarter-Finals": 0,
            "Semi-Finals": 0,
            "Finals": 0
        };
        var roundDataList = [];

        const allRounds = ["Round Robin", "1st Round Qualifying",  "2nd Round Qualifying", "3rd Round Qualifying", "Round of 128", "Round of 64", "Round of 32", "Round of 16", "Quarter-Finals", "Semi-Finals", "Finals"]


        for(let i=0; i<this.props.data["wins"].length; i++) {
            if(this.props.data["wins"][i][3].includes("Olympic") === false) {
                roundData[this.props.data["wins"][i][3]] += 1; 
            }
            
        }

        for(let i=0; i<this.props.data["losses"].length; i++) {
            if(this.props.data["losses"][i][3].includes("Olympic") === false) {
                roundData[this.props.data["losses"][i][3]] += 1; 
            }
            
        }

        allRounds.map((round) => {
            if(roundData.hasOwnProperty(round) === true) {
                roundDataList.push(roundData[round]);
            }
        })

        var total = 0;

        for(let a of roundDataList) {
            total += a;
        }

        const w = 400
        const h = 400
        const r = w/2


        // Define the div for the tooltip
        var tooltip = d3
            .select('#record-round-pie-graph')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        const svg = d3
            .select("#record-round-pie-graph")
            .append("svg")
            .attr("width", w)
            .attr("height", h)

        const g = svg.append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        
        var color = d3.scaleOrdinal(["#865d85", "#98d8f6", "#FE75A6", "#605D6F", "#3D394F","#5B736B","#5AC8AD","#F8BE52","#F67F46","#C3454E","#D94556","#79A8B7"]);
            
        // Optional Other Colors: ["#003f5c", "#2f4b7c", "#665191", "#a05195", "#d45087", "#f95d6a", "#ff7c43", "#ffa600"]
        // Generate the pie
        var pie = d3.pie();
    
        // Generate the arcs
        var arc = d3.arc()
                    .innerRadius(r/2)
                    .outerRadius(r);
    
                
        //Generate groups
        var arcs = g.selectAll("arc")
                    .data(pie(roundDataList))
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
                // d or datum is the height of the
                // current rect
                
                d.innerRadius = r/2;
                d.outerRadius = r*2;

                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.70');

                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip
                  .html(() => {
                        let ind = roundDataList.indexOf(d.value);
                        return `<div><p style="font-weight: 700;">${allRounds[ind]}</p><p>Matches: ${roundDataList[ind]}</p><p>${((roundDataList[ind] / total)*100).toString().slice(0, 4)}%</p></div>`;
                  }
                  )
                  .attr("transform", "translate(" + arc.centroid(d) + ")")
              })
            .on('mouseout', function () {
                tooltip.transition().duration(200).style('opacity', 0);
                d3.select(this).transition()
                    .duration('10')
                    .attr('opacity', '1');
            });

        /*
        
        svg.selectAll("rect")
           .data(yearsDataList)
           .enter()
           .append("rect")
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

            .on('mouseover', function (event, d, i) {
                // d or datum is the height of the
                // current rect
                
                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip
                  .html(() => {
                      let ind = yearsDataList.indexOf(d);
                      if(d[2] === "W") {
                        return `<div><p style="font-weight: 700;">${d[0]}</p><p style="color: #85A94E;">Wins: ${d[1]}</p><p style="color: #B33430;">Losses: ${yearsDataList[ind+1][1]}</p><p>Total: ${d[1] + yearsDataList[ind+1][1]}</p></div>`;
                      } else {
                        return `<div><p style="font-weight: 700;">${d[0]}</p><p style="color: #85A94E;">Wins: ${yearsDataList[ind-1][1]}</p><p style="color: #B33430;">Losses: ${d[1]}</p><p>Total: ${d[1] + yearsDataList[ind-1][1]}</p></div>`;
                      }
                  }
                  )
                  .style('left', (xScale(d[0]) + barWidth) + 'px')
                  .style('top', 300 + 'px')
                  .style('transform', 'translateX(60px)');
              })
              .on('mouseout', function () {
                tooltip.transition().duration(200).style('opacity', 0);
              }); */
    }

    render(){
        return <div id={"#" + this.props.id}></div>
    }
}

export default RoundPie;
