// データ保存用の配列
let records = [];

// テーブルのtbody要素
const recordTableBody = document.getElementById("recordTable").querySelector("tbody");

// 集計エリアの要素
const totalCountElement = document.getElementById("totalCount");
const successRateElement = document.getElementById("successRate");
const commitRateElement = document.getElementById("commitRate");

// ボタンが押されたらデータを記録
const recordData = (hitGuard, input) => {
    const timestamp = new Date().toISOString();
    const newRecord = { timestamp, hitGuard, input };
    records.push(newRecord);

    // テーブルに行を追加
    addRecordToTable(newRecord);

    // 集計を更新
    updateStats();
};

// テーブルに新しい行を追加する関数
const addRecordToTable = (record) => {
    const newRow = document.createElement("tr");

    // 成功/失敗パターンに応じてクラスを付与
    if ((record.hitGuard === 1 && record.input === 1) || (record.hitGuard === 0 && record.input === 0)) {
        newRow.classList.add("success-row"); // 成功パターン
    } else {
        newRow.classList.add("failure-row"); // 失敗パターン
    }

    const timestampCell = document.createElement("td");
    timestampCell.textContent = formatTimestamp(record.timestamp); // フォーマットされたタイムスタンプ
    newRow.appendChild(timestampCell);

    const hitGuardCell = document.createElement("td");
    hitGuardCell.textContent = record.hitGuard === 1 ? "ヒット" : "ガード";
    newRow.appendChild(hitGuardCell);

    const inputCell = document.createElement("td");
    inputCell.textContent = record.input === 1 ? "入力" : "未入力";
    newRow.appendChild(inputCell);

    const resultCell = document.createElement("td");
    resultCell.textContent = getResultText(record.hitGuard, record.input); // 結果を設定
    newRow.appendChild(resultCell);

    recordTableBody.prepend(newRow);
};

// 結果を判定する関数
const getResultText = (hitGuard, input) => {
    if (hitGuard === 1 && input === 1) {
        return "ヒット確認";
    } else if (hitGuard === 0 && input === 0) {
        return "ガード確認";
    } else if (hitGuard === 1 && input === 0) {
        return "技出ない";
    } else if (hitGuard === 0 && input === 1) {
        return "入れ込み暴発";
    }
    return "";
};

// 集計情報を更新する関数
const updateStats = () => {
    const totalCount = records.length;
    const successCount = records.filter(r => r.hitGuard === 1 && r.input === 1).length;
    const guardCount = records.filter(r => r.hitGuard === 0).length;
    const commitCount = records.filter(r => r.hitGuard === 0 && r.input === 1).length;

    const successRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(2) : 0;
    const commitRate = guardCount > 0 ? ((commitCount / guardCount) * 100).toFixed(2) : 0;

    totalCountElement.textContent = totalCount;
    successRateElement.textContent = `${successRate}%`;
    commitRateElement.textContent = `${commitRate}%`;
};

// Timestampをフォーマットする関数
const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 各ボタンのイベント設定
document.getElementById("hitInput").addEventListener("click", () => recordData(1, 1));
document.getElementById("hitNoInput").addEventListener("click", () => recordData(1, 0));
document.getElementById("guardInput").addEventListener("click", () => recordData(0, 1));
document.getElementById("guardNoInput").addEventListener("click", () => recordData(0, 0));

// CSVデータを作成してダウンロード
const downloadCSV = () => {
    if (records.length === 0) {
        alert("記録されたデータがありません！");
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," +
        ["Timestamp,Hit/Guard,Input Status"]
            .concat(records.map(r => `${r.timestamp},${r.hitGuard},${r.input}`))
            .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "counter_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

document.getElementById("download").addEventListener("click", downloadCSV);
