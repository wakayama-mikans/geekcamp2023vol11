from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
import create_wordcloud as create_wordcloud # ワードクラウド生成のPythonファイルをインポート


class RequestData(BaseModel):
    text: str

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/test")
async def process_text(request_data: RequestData):
    input_text = request_data.text # node側からのデータ受取

    base64_data = create_wordcloud.create_wordcloud(input_text) # ワードクラウドの生成
    return {"image": str(base64_data)}

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}