

function askToContinue(){
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
              "text": "他にもありそう？🤔",
              "color": "#ffffff",
              "size": "lg",
              "flex": 4,
              "weight": "bold",
              "gravity": "center"
            }
          ]
        }
      ],
      "paddingAll": "20px",
      "backgroundColor": "#f3a074",
      "spacing": "md",
      "height": "80px",
      "paddingTop": "22px"
    },
    "body": {
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
      "height": "80px"
    }
  }
}

module.exports = { askToContinue };