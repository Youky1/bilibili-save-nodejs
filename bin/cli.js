#!/usr/bin/env node
(async () => {
  const inquirer = require("inquirer");
  const { download } = require("../lib");
  const args = require("minimist")(process.argv.slice(2));
  if (args.default || args.d) {
    download({
      downloadRange: "byAuthor",
      downloadType: "mp4",
      downloadPath: "https://space.bilibili.com/313580179",
    });
  } else {
    const { downloadRange } = await inquirer.prompt([
      {
        type: "list",
        name: "downloadRange",
        message: "要使用的下载方式",
        choices: [
          { name: "使用【UP主页URL】下载所有作品", value: "byAuthor" },
          { name: "使用【作品URL】下载单个作品", value: "byVideo" },
        ],
      },
    ]);
    const { downloadPath } = await inquirer.prompt([
      {
        name: "downloadPath",
        message: `请输入${
          downloadRange === "byAuthor" ? "【UP主页URL】" : "【视频URL】"
        }`,
        validate: (input) => (input ? true : "输入不能为空"),
      },
    ]);
    const { downloadType } = await inquirer.prompt([
      {
        type: "list",
        name: "downloadType",
        message: "下载视频 or 音频",
        choices: [
          { name: "视频", value: "mp4" },
          { name: "仅音频", value: "mp3" },
        ],
      },
    ]);
    download({ downloadRange, downloadPath, downloadType });
  }
})();
