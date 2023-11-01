/**
 * Generate a FlexMessage to confirm whether to send a rewritten question text
 * @param inputQuestionText - The question text to be sent
 */
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
              "text": "送った質問",
              "color": "#ffffffa6",
              "size": "sm",
              "weight": "bold"
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
              "text": "他の選択肢はありますか？",
              "gravity": "center",
              "flex": 4,
              "size": "md",
              "margin": "none"
            }
          ],
          "spacing": "xs",
          "cornerRadius": "30px",
          "margin": "xl"
        },
        {
          "type": "box",
          "layout": "vertical",
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
          "margin": "xl"
        }
      ]
    }
  }
}

module.exports = { otherOpinions };
