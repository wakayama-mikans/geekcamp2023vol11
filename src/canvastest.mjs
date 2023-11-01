import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import { JSDOM } from 'jsdom'
import fetch from "node-fetch"
import base64 from 'urlsafe-base64'
import pkg from 'save-svg-as-png';


const canvas = createCanvas(400, 200); // Canvasの幅と高さを指定
const ctx = canvas.getContext('2d');

registerFont('./font/NotoSansJP.ttf', { family: 'NotoSansJP' });  // font.ttfを登録する。フォント名は適当

// テキストスタイルを設定
ctx.font = '30px NotoSansJP';
ctx.fillStyle = 'red';

// テキストを描画
ctx.fillText('Hello, Node.js Canvas!', 50, 100);

// Canvasをファイルに保存する例
console.log(ctx);
const out = fs.createWriteStream("text.png");
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('The PNG file was created.'));