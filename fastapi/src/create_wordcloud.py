from wordcloud import WordCloud
import matplotlib.pyplot as plt 
import base64
import japanize_matplotlib
from PIL import Image
import numpy as np

import subprocess
import matplotlib

# ワードクラウドを生成する関数
def create_wordcloud(text):

    # path_to_delete = matplotlib.get_cachedir()

    # # コマンドを実行する
    # result = subprocess.run(['rm', '-rf', path_to_delete], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    # # コマンドの終了コードを取得
    # return_code = result.returncode

    # ワードクラウドを生成
    fpath = "/usr/share/fonts/opentype/ipaexfont-gothic/ipaexg.ttf"
    mask_array = np.array(Image.open('./mask.png'))
    wordcloud = WordCloud(font_path=fpath,mask=mask_array, width=800, height=400, background_color='white').generate(text)

    # プロットして表示
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")
    plt.title("WordCloud!!!")

    plt.savefig("image.png")

    # 画像をバイナリデータとして読み込む
    with open("./image.png", "rb") as f:
        image_data = f.read()
        base64_data = base64.b64encode(image_data).decode('utf-8')

    return base64_data