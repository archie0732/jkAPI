import { load } from "cheerio";
import { JKError } from "./error";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { input, number, select } from "@inquirer/prompts";
import type { Setting } from "./setting.interface";

export interface JK {
  title: string;
  url: string;
  author: {
    name: string;
    avatar: string;
  };
  time: string;
  img: string[];
}

const trytoget = async (url = ""): Promise<JKAPI> => {
  if (url == "") {
    url = await input({ message: "enter JK forum url:" });
  }

  const res = await fetch(url);

  if (res.status != 200) {
    throw new JKError("💀 [JK] get url error", res.status);
  }

  const data = await res.text();
  const $ = load(data);

  const title = $("h1").text();
  const userAvatar = $(".a-img").find("img").attr("src");
  const userName = $("a.name.xi2").attr("title");
  const lastTime = $(".u-add.link0.cl").find("span.subline").text().split("|").pop()?.trim();
  const img: string[] = [];
  $("td.t_f ignore_js_op").each((_, e) => {
    const a = $(e).find("img").attr("file");
    img.push(a!);
  });

  return new JKAPI({
    title,
    url,
    author: {
      name: userName || "unknow",
      avatar: userAvatar || "unknow",
    },
    time: lastTime || "unknow",
    img,
  });
};

export class JKAPI {
  data: JK;

  constructor(data: JK) {
    this.data = data;
  }

  async downloadImage(page: number, path: string) {
    const img = this.data.img[page];
    if (page >= this.data.img.length) {
      throw new JKError("[JK] Excess the fetch image count!", 200);
    }
    const res = await fetch(this.data.img[page]);

    if (res.status !== 200) {
      throw new JKError("💀 [JK] Fail to download image, may is lose or else", res.status, img);
    }
    const data = await res.arrayBuffer();
    Bun.write(join(path, `${page}.${img.split(".").pop()}`), data);
    console.log(`🔍 ${img}  was done`);
  }

  async downloadAllImg(path = "comic") {
    path += `/${this.data.title.trim()}`;
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }

    const imgs = this.data.img;
    let counter = 0;

    for (let i = 0; i < imgs.length; i++) {
      try {
        await this.downloadImage(i, path);
      } catch (_) {
        counter++;
      }
    }

    console.log(`😎 All image are save in ${path}`);
    console.log(`👾 Fail download ${counter}/${imgs.length}`);
  }
}

//

const jk = await trytoget();

const download = await select({
  message: "⬇️ Download image?",
  choices: [
    {
      name: "Yes",
      value: true,
    },
    {
      name: "No",
      value: false,
    },
  ],
});

if (!download) {
  console.log(jk);
} else {
  const path = await input({ message: "download destination:" });
  await jk.downloadAllImg(path);
}
