import * as d3 from 'd3'
import * as cloud from 'd3-cloud'
import { JSDOM } from 'jsdom'
import sharp from "sharp"

// const document = new JSDOM().window.document
// const svg = d3.select(document.body).append('svg')
// svg.attr('width', 400)
// svg.attr('height', 400)
// svg.append('circle')
//  .attr('cx', 200)
//  .attr('cy', 200)
//  .attr('r', 40)
//  .attr('fill', "blue")


var words = [
{ text: "apple", size: 30 },
{ text: "banana", size: 20 },
// 他の単語データ
];

cloud().size([width, height])
.words(words)
.padding(5)
.rotate(function() { return 0; }) // ワードの回転を設定
.fontSize(function(d) { return d.size; })
.on("end", draw);



// console.log(document.body.innerHTML)
// console.log(svg)
// // convert

// var svg_ = document.querySelector("svg");
// var svgData = new XMLSerializer().serializeToString(svg_);
// var canvas = document.createElement("canvas");
// canvas.width = svg_.width.baseVal.value;
// canvas.height = svg_.height.baseVal.value;

// var ctx = canvas.getContext("2d");
// var image = new Image;
// image.onload = function(){
//     ctx.drawImage( image, 0, 0 );
//     var a = document.createElement("a");
//     a.href = canvas.toDataURL("image/png");
//     a.setAttribute("download", "image.png");
// }
// image.src = "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(svgData))); 


var width = 800;
var height = 400;

function draw(words) {
    svg.append("g")
      .attr("transform", "translate(" + 100 / 2 + "," + 100 / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("fill", "steelblue")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }