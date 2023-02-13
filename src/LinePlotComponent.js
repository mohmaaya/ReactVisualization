import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { extent } from "d3-array";

const LinePlotComponent = ({ open, point }) => {
    const svgRef2 = useRef();
    const [curve, setCurve] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/curves')
            .then((res) => res.json())
            .then((res) => {
              
                setCurve( res.filter((curve) => {
                    return (curve.id === point)
                }))
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    useEffect(() => {
        const w = 600, h = 400;

        const svg = d3.select(svgRef2.current).attr('width', w).attr('height', h)
            .style('overflow', 'visible')
            .style('margin-top', '100px')
            .style('margin-left', '100px')
            .style('margin-bottom', '100px')
            .style('overflow', 'visible')


        const xScale = d3.scaleLinear()
            .domain(extent(curve, d => d.x))
            .range([0, w]);

        const yScale = d3.scaleLinear()
            .domain(extent(curve, d => d.y))
            .range([h, 0]);

        const xAxis = d3.axisBottom(xScale).ticks(curve?.length);
        const yAxis = d3.axisLeft(yScale).ticks(curve?.length);

        const plot = svg.append('g').attr('transform', 'translate(50,50)');

        const line = d3.line()
                       .x(function(d){
                        return xScale(d.x)
                        })
                        .y(function(d){
                         return yScale(d.y)
                     });

        plot.append('path').attr('d', line(curve)); //Faulty, need some debugging
        plot.append('g').attr('class', 'x').attr('transform','translate(0,'+h+')').call(xAxis);
        plot.append('g').attr('class', 'y').call(yAxis);


    }, [point]); 

    return (
        <>
            {open && <svg ref={svgRef2}></svg>}
        </>
    );
}

export default LinePlotComponent;