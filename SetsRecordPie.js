import * as d3 from "d3"
import React from 'react';
import './styles.css';

class SetsRecordPie extends React.Component {

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
            d3.selectAll("svg")["_groups"][0][5].remove()
        }

        var setsData = {
            "2 Sets": [0, 0, 0],
            "3 Sets": [0, 0, 0],
            "4 Sets": [0, 0, 0],
            "5 Sets": [0, 0, 0]
        };

        var setsDataList = [];
        var setsResultsData = [];

        const allSets = ["2 Sets", "3 Sets", "4 Sets", "5 Sets"];


        for(let i=0; i<this.props.data["wins"].length; i++) {
            if(setsData.hasOwnProperty(this.props.data["wins"][i][6] + " Sets") === true) {
                setsData[(this.props.data["wins"][i][6] + " Sets")][0] += 1; 
                setsData[(this.props.data["wins"][i][6] + " Sets")][1] += 1; 
            }
            
        }

        for(let i=0; i<this.props.data["losses"].length; i++) {
            if(setsData.hasOwnProperty(this.props.data["losses"][i][6] + " Sets") === true) {
                setsData[(this.props.data["losses"][i][6] + " Sets")][0] += 1; 
                setsData[(this.props.data["losses"][i][6] + " Sets")][2] += 1; 
            }
            
        }

        allSets.map((sets) => {
            setsDataList.push(setsData[sets][0]);
            setsResultsData.push([setsData[sets][1], setsData[sets][2]])
        })

        const w = 400
        const h = 400
        const r = w/2

        var total = 0;

        for(let a of setsDataList) {
            total += a;
        }


        // Define the div for the tooltip
        var tooltip = d3
            .select('#record-sets-pie-graph')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        const svg = d3
            .select("#record-sets-pie-graph")
            .append("svg")
            .attr("width", w)
            .attr("height", h)

        const g = svg.append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        var color = d3.scaleOrdinal(["#57167E", "#9B3192", "#EA5F89", "#F7B7A3"]);

        // Generate the pie
        var pie = d3.pie();
    
        // Generate the arcs
        var arc = d3.arc()
                    .innerRadius(r/2)
                    .outerRadius(r);
    
                
        //Generate groups
        var arcs = g.selectAll("arc")
                    .data(pie(setsDataList))
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
                        return `<div><p style="font-weight: 700;">${allSets[d.index]}</p><p>Matches: ${setsDataList[d.index]}</p><p>${((setsDataList[d.index] / total)*100).toString().slice(0, 4)}%</p></div>`;
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

export default SetsRecordPie;
