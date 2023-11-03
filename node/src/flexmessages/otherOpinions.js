

function otherOpinions(inputQuestionText) {
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
              "text": "現在のトピック",
              "color": "#ffffffa6",
              "size": "sm"
            },
            {
              "type": "text",
              "text": inputQuestionText,
              "color": "#ffffff",
              "size": "xl",
              "flex": 4,
              "weight": "bold"
            }
          ]
        }
      ],
      "paddingAll": "20px",
      "backgroundColor": "#f4a460",
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
              "text": "他の選択肢はありますか？😎",
              "gravity": "center",
              "flex": 4,
              "size": "md"
            }
          ],
          "spacing": "xs",
          "cornerRadius": "30px",
          "margin": "lg"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "はい",
                "text": "はい"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "いいえ",
                "text": "いいえ"
              }
            }
          ],
          "margin": "lg"
        }
      ]
    }
  }
}

module.exports = { otherOpinions };
