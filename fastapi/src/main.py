from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from src.create_wordcloud import create_wordcloud

# ここでnode側からのデータを受け取るためのクラスを定義
class RequestData(BaseModel):
    text: dict
    sentiment: str
    score: float

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/")
async def process_text(request_data: RequestData):
    request_json = vars(request_data)
    base64_data = create_wordcloud(request_json) # ワードクラウドの生成
    return {"image": str(base64_data)}

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}