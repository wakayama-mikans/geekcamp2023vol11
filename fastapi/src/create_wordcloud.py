from wordcloud import WordCloud
import matplotlib.pyplot as plt 
import base64

# ワードクラウドを生成する関数
def create_wordcloud():
    # テキストデータ（ここではサンプルのテキストを使用）
    # text = "Python is a powerful programming language used for various applications. It is known for its simplicity and readability."
    text = "Python Python Python Java Java C C C C TypeScript TypeScript TypeScript TypeScript TypeScript"

    # ワードクラウドを生成
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)

    # プロットして表示
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")

    plt.savefig("image.png")

        # 画像をバイナリデータとして読み込む
    with open("./image.png", "rb") as f:
        image_data = f.read()
        base64_data = base64.b64encode(image_data).decode('utf-8')

    return base64_data