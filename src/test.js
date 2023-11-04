
const userTimeouts = {};
function startTimeoutTimer(userId, timeoutInSeconds) {
    console.log("startTimeoutTimer")
    const timeoutId = setTimeout(() => {
        // タイムアウト時の処理をここに記述
        // 例: タイムアウト時にメッセージを送信し、ステータスをリセット
        console.log(userId, "タイムアウトして，statusをリセットします。");
        // setUserStatus(userId, null); // ステータスをリセット
    }, timeoutInSeconds * 10); // timeoutInSecondsは秒単位の時間

    // タイムアウトIDをユーザーごとに保存
    userTimeouts[userId] = timeoutId;
}

// メッセージを受信したときにタイムアウトタイマーをキャンセル
function onMessageReceived(userId, message) {
    // 何らかのメッセージ処理を行う

    // タイムアウトタイマーをキャンセル
    if (userTimeouts[userId]) {
        clearTimeout(userTimeouts[userId]);
        delete userTimeouts[userId];
    }else{
        startTimeoutTimer(userId, 500);
    }

    // ここでメッセージに対する処理を続行
}

function debugtimer(userId){
    console.log("debugtimer")
    console.log(userTimeouts)
    const timeoutId = setTimeout(() => {
        console.log(userId, "2回目の送信");
        onMessageReceived(userId, "test")
    }, 30 * 10); // timeoutInSecondsは秒単位の時間
}

onMessageReceived(1, "test")
debugtimer(1)