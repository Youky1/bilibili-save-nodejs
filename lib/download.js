const fs = require("fs");
const path = require("path");
const axios = require("axios");
const appRoot = require("app-root-path");

const downloadVideo = async ({ url, referer, folder, title }) => {
  if (fs.existsSync(path.join(folder, `${title}.mp4`))) {
    console.log(`视频 ${title} 已存在`);
    return Promise.resolve();
  }
  const res = await axios.get(url, {
    headers: {
      referer,
    },
    responseType: "stream",
  });
  console.log(`开始下载：${title}`);
  const writer = fs.createWriteStream(path.join(folder, `${title}.mp4`));
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const getRefererByBvid = (bvid) => `https://www.bilibili.com/video/${bvid}`;

// 根据bvid获取cid数组
const getCidByBvid = async (bvid) => {
  const res = await axios.get("https://api.bilibili.com/x/web-interface/view", {
    params: {
      bvid,
    },
  });
  return res.data.data.pages.map((item) => item.cid);
};

// 根据bvid获取视频下载地址数组
const getDownloadPathById = async (bvid) => {
  const cidList = await getCidByBvid(bvid);
  const result = [];
  for (const cid of cidList) {
    const res = await axios.get("https://api.bilibili.com/x/player/playurl", {
      params: {
        bvid,
        cid,
        qn: 112,
      },
    });
    result.push(res.data.data.durl[0].url);
  }
  return result;
};

// 根据bvid下载视频，默认目录为根目录下的resource文件夹
const downloadVideoByBvid = async ({ bvid, title, folder }) => {
  const downloadList = await getDownloadPathById(bvid);
  for (const downloadPath of downloadList) {
    await downloadVideo({
      url: downloadPath,
      referer: getRefererByBvid(bvid),
      folder,
      title,
    });
    console.log("done");
  }
};

// 根据mid获取主页地址
const getHomeUrl = (id, currentPage) =>
  `https://api.bilibili.com/x/space/arc/search?mid=${id}&ps=30&pn=${currentPage}`;

// 根据UP主mid下载所有视频
const downloadByMid = async ({ mid, folder }) => {
  const downloadFolder = path.join(appRoot.path, folder || "resource");
  // 如果目录不存在，则创建
  if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder);
  }
  let cur = 1;
  while (true) {
    try {
      const res = await axios.get(getHomeUrl(mid, cur));
      const {
        data: {
          data: {
            list: { vlist },
          },
        },
      } = res;
      if (vlist.length === 0) {
        return;
      }
      const { author } = vlist[0];
      console.log(`开始下载UP主『${author}』的第${cur++}页视频`);
      for (let i = 0; i < vlist.length; i++) {
        const { bvid, title } = vlist[i];
        console.log(`[${i}/${vlist.length}] ${title}下载中`);
        await downloadVideoByBvid({ bvid, title, folder: downloadFolder });
      }
    } catch (e) {
      console.error(e);
      return;
    }
  }
};

// 根据视频URL下载视频
const downloadByUrl = async ({ url, title }) => {
  const urlList = url.split("/");
  const bvid = urlList[urlList.length - 1].split("?")[0];
  return downloadVideoByBvid({ bvid, title });
};

module.exports = { downloadByMid, downloadByUrl };
