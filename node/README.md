# ホスティングまでの道のり
現状のディレクトリではうまくいく．
dockerの環境から公開までの手順が以下の通り．

- １）firebase login --no-localhost
- ２）firebase init functions
- ３）functionsに移行する「/src，package.jsoon，package-lock.json，.env，serviceAccountsKey.json」
- ４）cd functions　で移動する
- ５）npm i --save @line/bot-sdk express axios dotenv node-cron
- ６）デフォルトで生成されるindex.jsを削除
- ７）Pacakge.json書き換え「”main": "./src/index.js”,」
- ８）firebase deploy --only functions,hosting