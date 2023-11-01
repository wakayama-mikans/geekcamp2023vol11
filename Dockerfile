# ベースイメージとして、PythonおよびNode.jsをインストールするイメージを使用
FROM python:3.9

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y nodejs npm

# Pythonの作業ディレクトリを設定
WORKDIR /app/python

# Pythonの依存パッケージをインストール
COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Node.jsの作業ディレクトリを設定
WORKDIR /app/node

# Node.jsのパッケージをインストール
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

# ローカルのソースコードをコピー
WORKDIR /app
COPY . .

# 実行コマンド（Node.jsアプリケーションを実行）
CMD ["npm", "run", "start"]
