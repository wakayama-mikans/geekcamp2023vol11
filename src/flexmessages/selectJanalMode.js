function selectJanalMode() {
  return {
    type: "bubble",
    size: "mega",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "ここ何書くか相談しよ",
              color: "#ffffff66",
              size: "sm",
            },
            {
              type: "text",
              text: "ジャーナルサポート✏️",
              color: "#ffffff",
              size: "xl",
              flex: 4,
              weight: "bold",
            },
          ],
        },
      ],
      paddingAll: "20px",
      backgroundColor: "#F3A074",
      spacing: "md",
      height: "100px",
      paddingTop: "22px",
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "ジャーナルのテーマを選んでね",
              gravity: "center",
              flex: 4,
              size: "md",
              margin: "none",
            },
          ],
          spacing: "lg",
          cornerRadius: "30px",
          margin: "md",
        },
        {
          type: "button",
          action: {
            type: "message",
            label: "未来について",
            text: "未来について",
          },
          margin: "lg",
        },
        {
          type: "button",
          action: {
            type: "message",
            label: "今日について",
            text: "今日について",
          },
        },
      ],
    },
  };
}

module.exports = { selectJanalMode };
