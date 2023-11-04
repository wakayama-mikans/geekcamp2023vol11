function selectJanalMode() {
  return{
		"type": "bubble",
		"size": "mega",
		"header": {
			"type": "box",
			"layout": "horizontal",
			"contents": [
				{
					"type": "box",
					"layout": "vertical",
					"contents": [
						{
							"type": "text",
							"text": "ジャーナルサポート",
							"color": "#ffffff66",
							"size": "sm"
						},
						{
							"type": "text",
							"text": "テーマを選んでね🤖",
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
			"height": "80px",
			"paddingTop": "22px",
			"alignItems": "center"
		},
		"body": {
			"type": "box",
			"layout": "vertical",
			"contents": [
				{
					"type": "button",
					"action": {
						"type": "message",
						"label": "未来について",
						"text": "未来について"
					},
					"margin": "none",
					"height": "md"
				},
				{
					"type": "button",
					"action": {
						"type": "message",
						"label": "今日について",
						"text": "今日について"
					},
					"height": "md"
				},
				{
					"type": "button",
					"action": {
						"type": "message",
						"label": "自由につぶやく",
						"text": "自由につぶやく"
					},
					"height": "md"
				}
			],
			"paddingAll": "none",
			"height": "160px",
			"alignItems": "center",
			"justifyContent": "center"
		}
	}
}

module.exports = { selectJanalMode };
