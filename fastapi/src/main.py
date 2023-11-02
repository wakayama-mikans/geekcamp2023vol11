from typing import Union
from fastapi import FastAPI
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import base64

app = FastAPI()


@app.get("/")
def read_root():
    # テキストデータ（ここではサンプルのテキストを使用）
    text = "Python is a powerful programming language used for various applications. It is known for its simplicity and readability."

    # ワードクラウドを生成
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)

    # プロットして表示
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")


    # plt.scatter(x, y)
    plt.savefig("image.png")

    # 画像をバイナリデータとして読み込む
    with open("./image.png", "rb") as f:
        image_data = f.read()
        base64_data = base64.b64encode(image_data).decode('utf-8')

    return {"image": str(base64_data)}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}