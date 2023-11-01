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
const { window } = new JSDOM();

registerFont('./font/NotoSansJP.ttf', { family: 'NotoSansJP' });  // font.ttfを登録する。フォント名は適当

// グローバル変数の設定
global.window = window;
global.document = window.document;

// saveSvgAsPng メソッドを取得
const saveSvgAsPng = pkg;
// const d3 = require('d3');
// const cloud = require('d3-cloud');


// const wordcloud_json = [
//   { word: "今日", count: 3 },
//   { word: "晴れ", count: 1 },
//   { word: "領域", count: 1 },
//   { word: "展開", count: 1 },
//   { word: "怖い", count: 1 },
//   { word: "ねむたい", count: 1 },
//   { word: "交流", count: 2 },
//   { word: "会", count: 2 },
//   { word: "あり", count: 2 },
//   { word: "開発", count: 2 },
//   { word: "楽しい", count: 2 },
//   { word: "寿司", count: 1 },
//   { word: "食べ", count: 2 },
//   { word: "ラーメン", count: 1 },
//   { word: "花見", count: 1 },
//   { word: "し", count: 1 },
//   { word: "富士山", count: 1 },
//   { word: "見て", count: 1 },
// ];
// // これでJSON形式を宣言できているか不明．多分似た形式になってるだけで宣言できてないっぽい．
// // wordcloudにはこの形式でデータを渡す必要がある．

// // ワードクラウドの生成
// // SVG要素の幅と高さ
// const width = 800;
// const height = 400;

// const canvas = createCanvas(1, 1);
// const layout = cloud()
//   .canvas(canvas)
//   .size([800, 400]) // ワードクラウドの幅と高さ
//   .words(wordcloud_json)
//   .padding(5) // ワード間の間隔
//   .rotate(() => 0) // ワードの回転角度
//   .font('Impact') // 使用するフォント
//   .fontSize(d => d.size) // ワードのサイズ
//   .on('end', drawWordCloud(wordcloud_json));

//   layout.start();

//   function drawWordCloud(wordcloud_json) {
//     const dom = new JSDOM();
//     const document = dom.window.document;
  
//     // // キャンバスを生成します。
//     // const canvas = createCanvas(layout.size()[0], layout.size()[1]);
//     const context = canvas.getContext('2d');
  
//     // ワードクラウドを描画します。
//     d3.select(document.body)
//       .append('div')
//       .attr('width', layout.size()[0])
//       .attr('height', layout.size()[1])
//       .append('svg')
//       .attr('width', layout.size()[0])
//       .attr('height', layout.size()[1])
//       .append('g')
//       .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
//       .selectAll('text')
//       .data(words)
//       .enter()
//       .append('text')
//       .style('font-size', d => `${d.size}px`)
//       .style('font-family', 'Impact')
//       .style('fill', 'black')
//       .attr('text-anchor', 'middle')
//       .attr('transform', d => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
//       .text(d => d.text);
  
//     // キャンバスを画像ファイルとして保存します。
//     const out = fs.createWriteStream('wordcloud.png');
//     const stream = canvas.createPNGStream();
//     stream.pipe(out);
//     out.on('finish', () => console.log('Word cloud image saved.'));
//   }

  // d3.json(DATA_FILE_PATH).then(function(data) { // v5
    const data = [
      { "word": "今日", "count": 3,"color":"blue" },
      { "word": "晴れ", "count": 1,"color":"blue" },
      { "word": "領域", "count": 1,"color":"blue" },
      { "word": "展開", "count": 1,"color":"blue" },
      { "word": "怖い", "count": 1,"color":"blue" },
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

    // const data = [
    //   { "word": "今日", "count": 3 },
    //   { "word": "晴れ", "count": 1 },
    //   { "word": "領域", "count": 1 },
    //   { "word": "展開", "count": 1 },
    //   { "word": "怖い", "count": 1 },
    //   { "word": "ねむたい", "count": 1 },
    //   { "word": "交流", "count": 2 },
    //   { "word": "会", "count": 2 },
    //   { "word": "あり", "count": 2 },
    //   { "word": "開発", "count": 2 },
    //   { "word": "楽しい", "count": 2 },
    //   { "word": "寿司", "count": 1 },
    //   { "word": "食べ", "count": 2 },
    //   { "word": "ラーメン", "count": 1 },
    //   { "word": "花見", "count": 1 },
    //   { "word": "し", "count": 1 },
    //   { "word": "富士山", "count": 1 },
    //   { "word": "見て", "count": 1 }
    // ];

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
  
    const canvas = createCanvas(960, 500);
    // cloud().size([w, h])
    //   .canvas(canvas)
    //   .words(words)
    //   .rotate(function() { return (~~(Math.random() * 6) - 3) * 30; })
    //   .font("Impact")
    //   .fontSize(function(d) { return d.size; })
    //   .on("end", draw) //描画関数の読み込み
    //   .start();

    cloud().size([960, 500])
      .canvas(() => canvas)
      .words(words)
      .padding(5)
      .rotate(() => Math.floor(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize(d => d.size)
      // .on("end", words => console.log(JSON.stringify(words)))
      .on("end", draw) //描画関数の読み込み
      .start();


            
    // const dataURL = canvas.toDataURL();

    // console.log("dataURL" + dataURL);
    // const b64img = dataURL.split( ',' )[1];
    // console.log(b64img);
    // const img = base64.decode( b64img );
    // console.log(img);
    // fs.writeFile('sample.png', img, function (err) {
    //   console.log("ERR:" + err);
    // });
    const output = fs.createWriteStream('wordcloud.png');
  const stream = canvas.createPNGStream();
  stream.pipe(output);
  output.on('finish', () => {
    console.log('WordCloud画像を保存しました。');
  });


    // console.log(canvas);
    // const dataURL = canvas.toDataURL();

    // console.log("dataURL" + dataURL);
    // const b64img = dataURL.split( ',' )[1];
    // console.log(b64img);
    // const img = base64.decode( b64img );

    // console.log(img);
    // fs.writeFile('sample.png', img, function (err) {
    //   console.log("ERR:" + err);
    // });

    // const dataURL = canvas.toDataURL();

    // console.log("dataURL" + dataURL);
    // const b64img = dataURL.split( ',' )[1];
    // console.log(b64img);
    // const img = base64.decode( b64img );
    //     console.log(img);
    // fs.writeFile('sample.png', img, function (err) {
    //   console.log("ERR:" + err);
    // });
    
    
    function draw(words) {
      console.log(words);
      d3.select()
        .append("svg")
          .attr("class", "ui fluid image") // style using semantic ui
          .attr("viewBox", "0 0 " + w + " " + h )  // ViewBox : x, y, width, height
          .attr("width", "100%")    // 表示サイズの設定
          .attr("height", "100%")   // 表示サイズの設定
        .append("g")
          .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "NotoSansJP")
          // .style("fill", function(d, i) { return data[i].color; })
          .style("fill", function(d, i) { return d3.schemeCategory10[i % 10]; })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    }