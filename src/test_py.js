// var { PythonShell } = require("python-shell");

// PythonShell.run("../py/src/sample.py", null, function (err, result) {
//   if (err) throw err;

//   console.log(result);
// });

const { exec } = require("child_process");

exec("python ../py/src/sample.py", (error, stdout, stderr) => {
  if (error) {
    console.error(`エラー: ${error}`);
    return;
  }
  console.log(`Python スクリプトの出力: ${stdout}`);
});
