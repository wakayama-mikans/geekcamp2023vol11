import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import { JSDOM } from 'jsdom'
import fetch from "node-fetch"
import base64 from 'urlsafe-base64'
import pkg from 'save-svg-as-png';

var DATA_FILE_PATH = './words.json'; // 読み込みデータファイル
// 仮想のDOM環境を作成
// const { window } = new JSDOM();
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const document = window.document;
const body = document.body;
registerFont('./font/NotoSansJP.ttf', { family: 'NotoSansJP' });  // font.ttfを登録する。フォント名は適当

// グローバル変数の設定
// global.window = window;
// global.document = window.document;


  // d3.json(DATA_FILE_PATH).then(function(data) { // v5
    const data = [
      { "word": "今日", "count": 2,"color":"#000000" },
      { "word": "晴れ", "count": 1,"color":"blue" },
      { "word": "領域", "count": 1,"color":"blue" },
      { "word": "展開", "count": 1,"color":"blue" },
      { "word": "怖い", "count": 1,"color":"red" },
      { "word": "ねむたい", "count": 1,"color":"blue" },
      { "word": "交流", "count": 2,"color":"blue" },
      { "word": "会", "count": 2,"color":"blue" },
      { "word": "あり", "count": 2,"color":"blue" },
      { "word": "開発", "count": 2,"color":"blue" },
      { "word": "楽しい", "count": 2,"color":"blue" },
      { "word": "寿司", "count": 1,"color":"blue" },
      { "word": "食べ", "count": 2,"color":"blue" },
      { "word": "ラーメン", "count": 1,"color":"blue" },
      { "word": "花見", "count": 1,"color":"blue" },
      { "word": "し", "count": 1,"color":"blue" },
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
  
    // const canvas = createCanvas(100, 100);
    const canvas = document.createElement('canvas');
    body.appendChild(canvas);
    canvas.setAttribute("id","canvasid")
    console.log(canvas.innerHTML);
    console.log(document.body.innerHTML);
    // cloud().size([w, h])
    //   .canvas(canvas)
    //   .words(words)
    //   .rotate(function() { return (~~(Math.random() * 6) - 3) * 30; })
    //   .font("Impact")
    //   .fontSize(function(d) { return d.size; })
    //   .on("end", draw) //描画関数の読み込み
    //   .start();

    cloud().size([100, 100])
      .canvas(() => canvas)
      .words(words)
      .padding(5)
      .rotate(() => Math.floor(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize(d => d.size)
      // .on("end", words => console.log(JSON.stringify(words)))
      // .on("end", draw(words)) //描画関数の読み込み
      .start()
      // .on("end", () => console.log("d3.draw!!が終わったはず"))
    
      console.log("ss" + canvas.innerHTML)
    draw(words)

    function draw() {

      const svg = document.createElement('svg');

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
          // .data(words)
          .data(words)
        .style("color", "blue")
        .enter().append("text")
          // .style("font-size", function(d) { return 200 + "px"; })
          .style("font-size", function(d) { return d.size + "px"; })

          // .style("font-family", "NotoSansJP")
          .style("fill", function(d, i) { return data[i].color; })
          // .style("fill", function(d) { return '#ff7f0e'; })
          // .style('fill',"#ff7f0e")
          // .style("fill", function(d, i) { return d3.schemeCategory10[i % 10]; })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            // return "translate(" + [10, 10] + ")rotate(" + 90 + ")";
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; })
          .on(function(d) { console.log("d3.draw!!が終わったはず"); })

      console.log("ガチselect後:",canvas.innerHTML)

      console.log("描写完了");
      save();
    }

    function save(){
      console.log('保存します');
      // const output = fs.createWriteStream('wordcloud.png');
      // const stream = canvas.createPNGStream();
      // stream.pipe(output);
      // output.on('finish', () => {
      //   console.log('WordCloud画像を保存しました。');
      // });

      console.log(canvas.innerHTML);
      const dataurl = canvas.toDataURL();
      var data = dataurl.split( ',' )[1];
      // npm i urlsafe-base64 でインストールしたモジュール。
      // これでBase64デコードするとimgにバイナリデータが格納される。
      var img = base64.decode( data );

      // 試しにファイルをsample.jpgにして保存。Canvasではjpeg指定でBase64エンコードしている。
      fs.writeFile('sample.svg', canvas.innerHTML, function (err) {
          console.log(err);
      });


      // fs.writeFile("targetPath.jpg", svg.innerHTML, (err) => {
      //   if(err){
      //       console.log("エラーが発生しました。" + err);
      //       throw err
      //   } else {
      //       console.log(
      //       "を保存しました");
      //   }

    // });
    }