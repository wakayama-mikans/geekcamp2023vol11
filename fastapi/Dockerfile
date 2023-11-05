FROM python:3.9
USER root

WORKDIR /app

RUN apt-get update
RUN apt-get -y install locales && \
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9
ENV TERM xterm

RUN apt-get install -y vim less
RUN apt install -y fonts-ipaexfont

COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# 日本語フォントのインストール
# RUN apt-get update && apt-get install -y fonts-ipafont
# RUN fc-cache -f -v

COPY ./ .

CMD ["uvicorn", "src.main:app", "--reload", "--host", "0.0.0.0", "--port", "8888"]