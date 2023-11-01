const { createCanvas } = require("canvas");
const cloud = require("d3-cloud");
const fs = require('fs');

const words = ["Hello", "world", "normally", "you", "want", "more", "words", "than", "this"]
    .map(function(d) {
      return {text: d, size: 10 + Math.random() * 90};
    });

console.log(words);

// ワードクラウドのレイアウトを設定します。
const canvas = createCanvas(1, 1);
const layout = cloud()
  .canvas(canvas)
  .size([800, 400]) // ワードクラウドの幅と高さ
  .words(words)
  .padding(5) // ワード間の間隔
  .rotate(() => 0) // ワードの回転角度
  .font('Impact') // 使用するフォント
  .fontSize(d => d.size) // ワードのサイズ
  .on('end', drawWordCloud(words,canvas));

// ワードクラウドの生成を開始します。
layout.start();

function drawWordCloud(words,canvas) {
  // const dom = new JSDOM();
  // const document = dom.window.document;

  // // キャンバスを生成します。
  // const canvas = createCanvas(layout.size()[0], layout.size()[1]);
  const context = canvas.getContext('2d');

  // ワードクラウドを描画します。
  // d3.select(document.body)
  //   .append('div')
  //   .attr('width', layout.size()[0])
  //   .attr('height', layout.size()[1])
  //   .append('svg')
  //   .attr('width', layout.size()[0])
  //   .attr('height', layout.size()[1])
  //   .append('g')
  //   .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
  //   .selectAll('text')
  //   .data(words)
  //   .enter()
  //   .append('text')
  //   .style('font-size', d => `${d.size}px`)
  //   .style('font-family', 'Impact')
  //   .style('fill', 'black')
  //   .attr('text-anchor', 'middle')
  //   .attr('transform', d => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
  //   .text(d => d.text);

  // キャンバスを画像ファイルとして保存します。
  const out = fs.createWriteStream('wordcloud.png');
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('Word cloud image saved.'));
}