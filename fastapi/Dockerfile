FROM python:3.9

WORKDIR /src

COPY ./fastapi/requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./fastapi/src/ .

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8888"]