from wordcloud import WordCloud
import matplotlib.pyplot as plt 
import base64
import japanize_matplotlib
from PIL import Image
import numpy as np
import subprocess
import json
# import matplotlib

# ワードクラウドを生成する関数
def create_wordcloud(text):

    fpath = "/usr/share/fonts/opentype/ipaexfont-gothic/ipaexg.ttf" # 日本語フォントのパスを指定
    mask_array = np.array(Image.open('./mask.png')) # マスク画像の読み込み

    word_frequencies = json.loads(text) # json形式のテキストデータを辞書型に変換

    # ワードクラウドを生成
    wordcloud = WordCloud(font_path=fpath,
                          mask=mask_array,
                          contour_width=3,
                          contour_color="steelblue",
                          width=800,
                          height=400,
                          background_color='white',
                          # colormap='tab20'
                          ).generate_from_frequencies(word_frequencies)

    # プロットして表示
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")

    plt.savefig("image.png")

    # 画像をバイナリデータとして読み込む
    with open("./image.png", "rb") as f:
        image_data = f.read()
        base64_data = base64.b64encode(image_data).decode('utf-8')

    return base64_data