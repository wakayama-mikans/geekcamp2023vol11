

function choiceSpan(){
  return {
    "type": "bubble",
    "size": "mega",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "ここ何書くか相談しよ",
              "color": "#ffffff66",
              "size": "sm"
            },
            {
              "type": "text",
              "text": "結果を見てみよう！📝",
              "color": "#ffffff",
              "size": "xl",
              "flex": 4,
              "weight": "bold"
            }
          ]
        }
      ],
      "paddingAll": "20px",
      "backgroundColor": "#F3A074",
      "spacing": "md",
      "height": "100px",
      "paddingTop": "22px"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": "期間を選択してね",
              "gravity": "center",
              "flex": 4,
              "size": "md",
              "margin": "none"
            }
          ],
          "spacing": "lg",
          "cornerRadius": "30px",
          "margin": "md"
        },
        {
          "type": "button",
          "action": {
            "type": "message",
            "label": "一日の結果を見る",
            "text": "一日の結果を見せて！"
          },
          "margin": "lg"
        },
        {
          "type": "button",
          "action": {
            "type": "message",
            "label": "一週間の結果を見る",
            "text": "一週間の結果を見せて！"
          }
        },
        {
          "type": "button",
          "action": {
            "type": "message",
            "label": "一か月の結果を見る",
            "text": "一ヶ月の結果を見せて！"
          }
        }
      ]
    }
  }
}

module.exports = { choiceSpan };