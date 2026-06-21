# 作品素材放置说明

真实作品图片已放在 `portfolio/assets/projects/` 下，网站通过 `portfolio/data/projects.js` 读取这些素材。

建议结构：

```text
assets/projects/
  项目01_科技产品主图精修/
    01_实拍图/
    02_精修图/
    03_主图/
    04_详情图/
    项目说明.txt
```

重点项目建议继续保留实拍图、精修图、主图和详情页图。后续新增项目时，把图片放入 `assets/projects/{项目英文名}/`，再在 `data/projects.js` 里增加项目数据即可。
