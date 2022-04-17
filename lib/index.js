const { downloadByUrl, downloadByMid } = require("./download.js");
const download = async ({ downloadRange, downloadType, content }) => {
  try {
    if (downloadRange === "byMid") {
      await downloadByMid({ mid: content, type: downloadType });
    } else {
      const pathSplit = content.split("/");
      const title = pathSplit[pathSplit.length - 1].split("?")[0];
      await downloadByUrl({ url: content, type: downloadType, title });
    }
    console.log("\n下载完成！");
  } catch (e) {
    console.error("\n下载出错：", e);
  }
};
module.exports = {
  download,
};
