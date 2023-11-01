import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import { JSDOM } from 'jsdom'
import base64 from 'urlsafe-base64'

const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const document = window.document;
const body = document.body;
registerFont('./font/NotoSansJP.ttf', { family: 'NotoSansJP' });  // font.ttfを登録する。フォント名は適当



    const data = [
      { "word": "今日", "count": 13,"color":"#000000" },
      { "word": "晴れ", "count": 14,"color":"blue" },
      { "word": "領域", "count": 35,"color":"blue" },
      { "word": "展開", "count": 49,"color":"blue" },
      { "word": "怖い", "count": 35,"color":"red" },
      { "word": "ねむたい", "count": 6,"color":"blue" },
      { "word": "交流", "count": 5,"color":"blue" },
      { "word": "会", "count": 12,"color":"blue" },
      { "word": "あり", "count": 32,"color":"blue" },
      { "word": "開発", "count": 24,"color":"blue" },
      { "word": "楽しい", "count": 62,"color":"blue" },
      { "word": "寿司", "count": 31,"color":"blue" },
      { "word": "食べ", "count": 24,"color":"blue" },
      { "word": "ラーメン", "count": 21,"color":"blue" },
      { "word": "花見", "count": 23,"color":"blue" },
      { "word": "し", "count": 23,"color":"blue" },
      { "word": "富士山", "count": 1,"color":"blue" },
      { "word": "見て", "count": 1,"color":"blue" }
    ];

    var h = 490;
    var w = 600;
  
    var countMax = d3.max(data, function(d){ return d.count} );
    var sizeScale = d3.scaleLinear().domain([0, countMax]).range([10, 100])
  
    var words = data.map(function(d) {
      return {
      text: d.word,
      size: sizeScale(d.count) //頻出カウントを文字サイズに反映
      };
    });
  
    const canvas = document.createElement('canvas');
    body.appendChild(canvas);
    canvas.setAttribute("id","canvasid")
    cloud().size([w, h])
      .canvas(() => canvas)
      .words(words)
      .padding(2)
      .rotate(() => Math.floor(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize(d => d.size)
      .on("end", words => console.log(JSON.stringify(words)))
      .start()
    
    draw(words)
    save();

    function draw() {
      d3.select(canvas)
        .append("svg")
          .attr("class", "ui fluid image") // style using semantic ui
          .attr("xmlns",'http://www.w3.org/2000/svg')
          .attr("viewBox", "0 0 " + w + " " + h )  // ViewBox : x, y, width, height
          .attr("width", "100%")    // 表示サイズの設定
          .attr("height", "100%")   // 表示サイズの設定
        .append("g")
          .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
        .selectAll("text")
          .data(words)
        .style("color", "blue")
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "NotoSansJP")
          .style("fill", function(d, i) { return data[i].color; })
          // .style("fill", function(d, i) { return d3.schemeCategory10[i % 10]; })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; })
    }

    function save(){
      fs.writeFile('sample.svg', canvas.innerHTML, function (err) {
          console.log(err);
      });
    }