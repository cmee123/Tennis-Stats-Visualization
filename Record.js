import * as d3 from "d3"
import React from 'react';
import './styles.css';

class Record extends React.Component {

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
            d3.selectAll("svg")["_groups"][0][0].remove();
        }

        const total = this.props.data[0] + this.props.data[1]
        const winPct = this.props.data[0] / total
        const lossPct = this.props.data[1] / total

        const w = 600
        const h = 75

        const svg = d3
            .select("#recordWrapper")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        svg
            .selectAll("rect")
            .data(this.props.data)
            .enter()
            .append("rect")
            .attr("x", (d) => {
                if(d === this.props.data[0]){
                    return 0;
                } else{
                    return winPct*w;
                }
            })
            .attr("y", h - (15))
            .attr("width", (d, i) => (d/total)*w)
            .attr("height", 15)
            .attr("fill", (d) => {
                if(d === this.props.data[0]){
                    return "#85A94E";
                } else{
                    return "#B33430";
                }
            })
        
        svg
            .selectAll("foreignObject")
            .data(this.props.data)
            .enter()
            .append("foreignObject")
            .attr("x", (d) => {
                if(d === this.props.data[0]){
                    return (winPct*w)/2 - 75;
                } else{
                    return (lossPct*w)/2 + winPct*w - 75;
                }
            })
            .attr("y", 15)
            .attr("height", 40)
            .attr("width", 150)

            .append("xhtml:div")
            .style("text-anchor", "middle")
            .html((d) => {
                var num = (d/total)*100;
                let color = "";
                num = num.toString().slice(0, 4) + "%";
                if(d === this.props.data[0]) {
                    var lengthStr = d + " Won";
                    color = "#85A94E";
                } else {
                    var lengthStr = d + " Lost";
                    color = "#B33430";
                }
                return `<h2 style='font-size: 25px; text-align: center; color: ${color};'>${num}<p style='font-size: 15px; text-align: center;'>${lengthStr}</p></h2>`;
            })
    }

    render(){
        return <div id={"#" + this.props.id}></div>
    }
}

export default Record;



