#!/usr/bin/env node

const inquirer = require("inquirer");
const { download } = require("../lib");
const args = require("minimist")(process.argv.slice(2));
if (args.default || args.d) {
  download({
    downloadRange: "byMid",
    downloadType: "mp4",
    content: "313580179",
  });
} else {
  inquirer
    .prompt([
      {
        type: "list",
        name: "downloadRange",
        message: "要使用的下载方式",
        choices: [
          { name: "使用【作者mid】下载所有作品", value: "byMid" },
          { name: "使用【URL】下载单个作品", value: "byUrl" },
        ],
      },
      {
        type: "list",
        name: "downloadType",
        message: "下载视频 or 音频",
        choices: [
          { name: "视频", value: "mp4" },
          { name: "仅音频", value: "mp3" },
        ],
      },
      {
        name: "content",
        message: "请输入【视频URL】 或 【UP主mid】",
        validate: (input) => (input ? true : "输入不能为空"),
      },
    ])
    .then((args) => download(args));
}
