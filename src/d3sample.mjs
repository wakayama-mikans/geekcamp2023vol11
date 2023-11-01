import * as d3 from 'd3'
import * as cloud from 'd3-cloud'
import { JSDOM } from 'jsdom'
import sharp from "sharp"

const document = new JSDOM().window.document
const svg = d3.select(document.body).append('svg')
svg.attr('width', 400)
svg.attr('height', 400)
svg.append('circle')
 .attr('cx', 200)
 .attr('cy', 200)
 .attr('r', 40)
 .attr('fill', "blue")

console.log(document.body.innerHTML)
console.log(svg)