from typing import Union
from fastapi import FastAPI
# from fastapi.responses import FileResponse
# from starlette.responses import FileResponse
import matplotlib.pyplot as plt
# from PIL import Image
# import io
# from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# # CORSを回避するために追加
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

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
    # return {"image": image_data}
    return {"Hello": "Hello"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}