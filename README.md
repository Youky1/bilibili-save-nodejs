# bilibili-download-nodejs

[仓库地址](https://github.com/Youky1/bilibili-save-nodejs)

## 安装

```shell
npm i bilibili-save-nodejs
```

## 功能

- [x] 根据 URL 下载单个作品
- [x] 根据 UP 主的主页 URL 下载所有作品
- [x] 可选择下载视频或音频

## 使用方法

### 使用命令行工具

```
bili-download
```

根据命令行菜单选择要下载的内容和形式

> 夹带私货：一键追星，下载[九三](https://space.bilibili.com/313580179)的所有视频：

```
bili-download -d
```

### 使用 Node.js API

| 函数名                | 作用                      |
| --------------------- | ------------------------- |
| `download`            | 下载                      |
| `downloadByVedioPath` | 根据视频 URL 下载单个作品 |
| `downloadByHomePath`  | 根据 UP 主页下载所有作品  |

### API 参数

注：三个函数的参数都为对象形式。

#### download

| 参数名         | 是否必须 | 取值范围                 | 含义                                     |
| -------------- | -------- | ------------------------ | ---------------------------------------- |
| downloadRange  | 是       | `['byAuthor','byVedio']` | 根据**作者主页 URL**或**作品 URL**       |
| downloadType   | 是       | `['mp4','mp3']`          | 下载**视频**或**音频**                   |
| downloadPath   | 是       | 无                       | 合法的**作品 URL**或**UP 主页 URL**      |
| downloadFolder | 否       | 无                       | 存储目录的**完整路径**，缺省时使用默认值 |

目录默认值：

- 视频：根目录下`/video`文件夹中
- 音频：根目录下`/audio`文件夹中

**demo：**

```javascript
const { download } = require("bilibili-download-nodejs");
download({
  downloadRange: "byAuthor",
  downloadType: "mp4",
  downloadPath: "https://space.bilibili.com/313580179",
})
  .then(() => console.log("下载成功"))
  .catch((e) => console.log("下载出错"));
```

#### downloadByVedioPath & downloadByHomePath

| 参数名 | 是否必须 | 取值范围        | 含义                   |
| ------ | -------- | --------------- | ---------------------- |
| type   | 是       | `['mp4','mp3']` | 下载**视频**或**音频** |
| url    | 是       | 无              | 合法的**作品 URL**     |
| folder | 是       | 无              | 存储目录的**完整路径** |

**demo：**

```javascript
const { downloadByVedioPath, downloadByHomePath } = require("./download.js");
const path = require("path");

// 下载单个作品的视频
downloadByVedioPath({
  url: "https://www.bilibili.com/video/BV1AL4y1L7cg",
  type: "mp4",
  folder: path.join(__dirname, "/foo"),
})
  .then(() => console.log("下载成功"))
  .catch((e) => console.log("下载出错"));

// 下载UP主所有作品的音频
downloadByHomePath({
  url: "https://space.bilibili.com/313580179",
  type: "mp3",
  folder: path.join(__dirname, "/bar"),
})
  .then(() => console.log("下载成功"))
  .catch((e) => console.log("下载出错"));
```
