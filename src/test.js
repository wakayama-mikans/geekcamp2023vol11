const { analysisSentiment } = require("./analysissentiment.js");

async function test(){
    await analysisSentiment(text);
}

let text = "美味しい";
test(text);