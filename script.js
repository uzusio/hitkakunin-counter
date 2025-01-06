// データ保存用の配列
let records = [];
let knuckleName = "弱ナックル"; // 初期値

// テーブルとボタンの要素を取得
const knuckleHeader = document.getElementById("knuckleHeader");
const knuckleNameInput = document.getElementById("knuckleNameInput");

// ボタンラベルを更新する関数
const updateButtonLabels = () => {
    document.getElementById("hitWithKnuckle").textContent = `ヒット + ${knuckleName}`;
    document.getElementById("hitNoKnuckle").textContent = `ヒット + ${knuckleName}未入力`;
    document.getElementById("guardWithKnuckle").textContent = `ガード + ${knuckleName}`;
    document.getElementById("guardNoKnuckle").textContent = `ガード + ${knuckleName}未入力`;
    knuckleHeader.textContent = `${knuckleName}入力`;
};

// テキスト入力のイベントリスナー
knuckleNameInput.addEventListener("input", (event) => {
    knuckleName = event.target.value || "弱ナックル"; // 空の場合はデフォルト値
    updateButtonLabels();
});

// 初期表示のボタンラベルを更新
updateButtonLabels();

// テーブルのtbody要素
const recordTableBody = document.getElementById("recordTable").querySelector("tbody");

// 集計エリアの要素
const totalCountElement = document.getElementById("totalCount");
const successRateElement = document.getElementById("successRate");
const commitRateElement = document.getElementById("commitRate");

// ボタンが押されたらデータを記録
const recordData = (hitGuard, weakKnuckle) => {
    const timestamp = new Date().toISOString();
    const newRecord = { timestamp, hitGuard, weakKnuckle };
    records.push(newRecord);

    // テーブルに行を追加
    addRecordToTable(newRecord);

    // 集計を更新
    updateStats();

    console.log("データ記録:", records);
};

// テーブルに新しい行を追加する関数
const addRecordToTable = (record) => {
    const newRow = document.createElement("tr");

    const timestampCell = document.createElement("td");
    timestampCell.textContent = record.timestamp;
    newRow.appendChild(timestampCell);

    const hitGuardCell = document.createElement("td");
    hitGuardCell.textContent = record.hitGuard === 1 ? "ヒット" : "ガード";
    newRow.appendChild(hitGuardCell);

    const weakKnuckleCell = document.createElement("td");
    weakKnuckleCell.textContent = record.weakKnuckle === 1 ? knuckleName : `${knuckleName}未入力`;
    newRow.appendChild(weakKnuckleCell);

    // 先頭に追加
    recordTableBody.prepend(newRow);
};

// 集計情報を更新する関数
const updateStats = () => {
    const totalCount = records.length;

    // 成功回数 = (1,1) or (0,0)
    const successCount = records.filter(r =>
        (r.hitGuard === 1 && r.weakKnuckle === 1) || (r.hitGuard === 0 && r.weakKnuckle === 0)
    ).length;

    // ガードされた回数
    const guardCount = records.filter(r => r.hitGuard === 0).length;

    // 入れ込み暴発回数 = (0,1)
    const commitCount = records.filter(r => r.hitGuard === 0 && r.weakKnuckle === 1).length;

    // 成否確率
    const successRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(2) : 0;

    // 入れ込み暴発率（ガードされた回数が母数）
    const commitRate = guardCount > 0 ? ((commitCount / guardCount) * 100).toFixed(2) : 0;

    // 集計エリアに反映
    totalCountElement.textContent = totalCount;
    successRateElement.textContent = `${successRate}%`;
    commitRateElement.textContent = `${commitRate}%`;
};

// 各ボタンのイベント設定
document.getElementById("hitWithKnuckle").addEventListener("click", () => recordData(1, 1));
document.getElementById("hitNoKnuckle").addEventListener("click", () => recordData(1, 0));
document.getElementById("guardWithKnuckle").addEventListener("click", () => recordData(0, 1));
document.getElementById("guardNoKnuckle").addEventListener("click", () => recordData(0, 0));

// CSVデータを作成してダウンロード
const downloadCSV = () => {
    if (records.length === 0) {
        alert("記録されたデータがありません！");
        return;
    }

    // CSV形式に変換
    const csvContent = "data:text/csv;charset=utf-8," +
        ["Timestamp,Hit/Guard,Additional Input"]
            .concat(records.map(r => `${r.timestamp},${r.hitGuard},${r.weakKnuckle}`))
            .join("\n");

    // ダウンロードリンクを作成してクリック
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "counter_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

document.getElementById("download").addEventListener("click", downloadCSV);
