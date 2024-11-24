# jkapi

一個支援 jkf 的 API，包含作者與圖片連結及下載

## 快速使用

clone 完成後，安裝本依賴包

```
bun i
```

啟動程式

```
bun src/index.ts
```

接著照著 terminal 的指示就可以了!

### API

value:

```json
title: string,
url: string,
author : {
    "name": string,
    "avatar": string,
},
time: string,
img: string[]
```

method:

- downloadImage(page: number, path:string) - download one page in jkAPI.img which you choose page number

- downloadAllImage(path) - download all image in jkAPI.img

This project was created using `bun init` in bun v1.1.24. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
