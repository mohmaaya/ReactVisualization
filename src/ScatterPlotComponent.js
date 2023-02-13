import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { extent } from "d3-array";
import Popup from './Popup'
import LinePlotComponent from './LinePlotComponent'

const ScatterPlotComponent = () => {
    const [data, setData] = useState([]); //Points
    const svgRef = useRef(); //User story 1 scatter plot ref
    const tooltipRef = useRef(); // Hovering tooltip; Does not work at the moment
    const [isOpen, setIsOpen] = useState(false)  //For Popup
    const [point, setPoint] = useState([]); //clicked point
    const [curves, setCurvePoints] = useState([]); //Curves
    const [curve, setCurve] = useState([]); //clicked point curve
    const [isLinePlot, setIsLinePlotOpen] = useState(false); //Adding linePlot component; not working at the moment


    //Fetching the Data; HTTP Get Reqs
    useEffect(() => {
        fetch('http://localhost:3000/points')
            .then((res) => res.json())
            .then((res) => {
                setData(res);
            })
            .catch((err) => {
                console.log(err.message);
            });

        fetch('http://localhost:3000/curves')
            .then((res) => res.json())
            .then((res) => {
                setCurvePoints(res);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    //User story 1 Scatter plot
    useEffect(() => {
        const w = 600, h = 400;

        const svg = d3.select(svgRef.current).attr('width', w).attr('height', h)
            .style('overflow', 'visible')
            .style('margin-top', '100px')
            .style('margin-left', '100px')


        const xScale = d3.scaleLinear()
            .domain(extent(data, d => d.row))
            .range([0, w]);

        const yScale = d3.scaleLinear()
            .domain(extent(data, d => d.col))
            .range([h, 0]);

        const xAxis = d3.axisBottom(xScale).ticks(data.length);
        const yAxis = d3.axisLeft(yScale).ticks(data.length);


        svg.append('g').call(xAxis).attr('transform', `translate(0, ${h})`);
        svg.append('g').call(yAxis);

        svg.append('text')
            .attr('x', w / 2)
            .attr('y', h + 50)
            .text('Row')

        svg.append('text')
            .attr('x', -50)
            .attr('y', h / 2)
            .text('Col')


        svg.selectAll().data(data).enter().append('circle')
            .attr('cx', d => xScale(d.row))
            .attr('cy', d => yScale(d.col))
            .attr('r', 4)

            //On left click
            .on('click', function (event, d) {
                setPoint(d)
                setIsOpen(true) //For PopUp
                setIsLinePlotOpen(true); //For the linePlot
            })

            //On right click
            .on('contextmenu', function (event, d) {
                event.preventDefault();
                setCurve(
                    curves.filter((curve) => {
                        return curve.id === d.id;
                    }))
            })

            //On hovering
            .on('mouseover', function (event, d) {

                const tooltipDiv = tooltipRef.current;
                if (tooltipDiv) {
                    d3.select(this).transition()
                        .duration('100')
                        .attr("r", 7);
                    d3.select(tooltipDiv).transition()
                        .duration('100')
                        .style("opacity", 1);
                    d3.select(tooltipDiv).html("Id is " + d.id)
                        .style('left', event.clientX + 'px')
                        .style('top', event.clientY + 'px')

                }
            })
            //On leaving the hover
            .on('mouseout', function () {
                const tooltipDiv = tooltipRef.current;
                if (tooltipDiv) {
                    d3.select(this).transition()
                        .duration('200')
                        .attr("r", 4);
                    d3.select(tooltipDiv).transition()
                        .duration('200')
                        .style("opacity", 0);
                }
            });


    }, [data, point]);



    return (
        <div className="App">
            <svg ref={svgRef}></svg>
            <div className="tooltip" ref={tooltipRef} />
            <br></br>
            <div>
                {curve.map(d => (<p key={d.id}> ID {d.id}, X coord {d.x}, Y coord {d.y}</p>))}
            </div>
            <Popup open={isOpen} onClose={() => setIsOpen(false)}>
                {point}
            </Popup>

            <LinePlotComponent open={isLinePlot} point={point?.id} />



        </div>
    );
};

export default ScatterPlotComponent;
