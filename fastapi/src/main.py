from typing import Union
from fastapi import FastAPI
import matplotlib.pyplot as plt
import json

app = FastAPI()


@app.get("/")
def read_root():
    x = [1, 2, 3, 4, 5]
    y = [2, 4, 6, 8, 10]

    plt.scatter(x, y)
    plt.savefig("image.png")

    # 画像をバイナリデータとして読み込む
    with open("./image.png", "rb") as f:
        image_data = f.read()

    print(image_data)

    # # バイナリデータを文字列に変換（バイナリデータをテキストとして扱う場合）
    # text_data = image_data.decode('utf-8')
    # print(text_data)

    return {"image": str(image_data)}
    # return {"Hello": "Hello"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}