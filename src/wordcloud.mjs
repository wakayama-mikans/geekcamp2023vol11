import * as d3 from 'd3';
import {cloud} from 'd3-cloud';
import {createCanvas} from 'canvas';


// const d3 = require('d3');
// const cloud = require('d3-cloud');


const wordcloud_json = [
  { word: "今日", count: 3 },
  { word: "晴れ", count: 1 },
  { word: "領域", count: 1 },
  { word: "展開", count: 1 },
  { word: "怖い", count: 1 },
  { word: "ねむたい", count: 1 },
  { word: "交流", count: 2 },
  { word: "会", count: 2 },
  { word: "あり", count: 2 },
  { word: "開発", count: 2 },
  { word: "楽しい", count: 2 },
  { word: "寿司", count: 1 },
  { word: "食べ", count: 2 },
  { word: "ラーメン", count: 1 },
  { word: "花見", count: 1 },
  { word: "し", count: 1 },
  { word: "富士山", count: 1 },
  { word: "見て", count: 1 },
];
// これでJSON形式を宣言できているか不明．多分似た形式になってるだけで宣言できてないっぽい．
// wordcloudにはこの形式でデータを渡す必要がある．

// ワードクラウドの生成
// SVG要素の幅と高さ
const width = 800;
const height = 400;

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