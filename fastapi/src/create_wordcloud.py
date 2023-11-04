from wordcloud import WordCloud
import base64
import urllib.request 
from PIL import Image
import numpy as np
import subprocess
import io
import requests
from dotenv import load_dotenv
import os

load_dotenv()

# ワードクラウドを生成する関数
def create_wordcloud(inputData):

    urllib.request.urlretrieve( 
        os.getenv("MASK_URL"),
        "mask.png") 
    
    img_mask = Image.open("mask.png") 

    mask_array = np.array(img_mask) # マスク画像の読み込み

    word_frequencies = inputData["text"]
    sentiment = inputData["sentiment"] # 感情分析の結果
    score = inputData["score"] # 感情分析の結果

    # 感情分析の結果によってワードクラウドの色を変える
    if sentiment == "Positive":
        if(score > 0.6):
            sentiment_color = "autumn"
        elif(score > 0.5):
            sentiment_color = "Spectral_r"
        elif(score > 0.4):
            sentiment_color = "Set2"
        elif(score > 0.3):
            sentiment_color = "PiYG_r"
        else:
            sentiment_color = "spring"
    elif sentiment == "Negative":
        if(score > 0.5):
            sentiment_color = "winter"
        else:
            sentiment_color = "cool"
    else:
        sentiment_color = "summer"
    # print(sentiment_color)

    # GoogleフォントのダウンロードURL
    font_url = os.getenv("FONT_URL")

    # ダウンロードして一時ファイルとして保存
    r = requests.get(font_url)
    with open("notosans_font.ttf", 'wb') as f:
        f.write(r.content)

    # ダウンロードしたフォントを使用してWordCloudを生成
    fpath = 'notosans_font.ttf'

    # ワードクラウドを生成
    wordcloud = WordCloud(font_path=fpath,
                          mask=mask_array,
                          contour_width=3,
                          contour_color="pink",
                          width=800,
                          height=800,
                          background_color='white',
                          colormap=sentiment_color
                          ).generate_from_frequencies(word_frequencies)

    # 画像をPillowのImageオブジェクトに変換
    wordcloud_image = wordcloud.to_image()

    buffer = io.BytesIO()
    wordcloud_image.save(buffer, format='PNG')
    buffer.seek(0)
    image_data = buffer.read()
    base64_data = base64.b64encode(image_data).decode('utf-8')

    return base64_data