const { downloadByVedioPath, downloadByHomePath } = require("./download.js");
const appRoot = require("app-root-path");
const path = require("path");
const download = async ({
  downloadRange,
  downloadType,
  downloadPath,
  downloadFolder,
}) => {
  try {
    const folder =
      downloadFolder ||
      path.join(appRoot.path, downloadType === "mp4" ? "video" : "audio");
    if (downloadRange === "byAuthor") {
      await downloadByHomePath({
        url: downloadPath,
        type: downloadType,
        folder,
      });
    } else {
      await downloadByVedioPath({
        url: downloadPath,
        type: downloadType,
        folder,
      });
    }
    console.log("\n下载完成！");
  } catch (e) {
    console.error("\n下载出错：", e);
  }
};
module.exports = {
  download,
  downloadByVedioPath,
  downloadByHomePath,
};
