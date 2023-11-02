from typing import Union
from fastapi import FastAPI
import create_wordcloud as create_wordcloud
# import matplotlib.pyplot as plt
# from wordcloud import WordCloud
# import base64

app = FastAPI()

@app.get("/")
def read_root():

    base64_data = create_wordcloud.create_wordcloud() # ワードクラウドの生成
    return {"image": str(base64_data)}

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}