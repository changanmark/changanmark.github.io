# 博客维护指南

博客目录：`/Users/liuhongfei/changanmark.github.io`

## 1. 开始维护

```bash
cd /Users/liuhongfei/changanmark.github.io
git pull --ff-only
git status
```

## 2. 新建文章

在 `_posts` 中创建 `年-月-日-英文标题.md`：

```markdown
---
title: "文章标题"
date: 2026-08-27 20:00:00 +0800
categories: ["编程", "前端"]
tags: ["webgl", "three.js"]
toc: true
---

这里写正文。
```

公众号关注卡片会自动添加，无需手工插入。

## 3. 添加图片

将图片放到：

```text
assets/img/posts/年-月-日-英文标题/
```

在文章头部加入：

```yaml
media_subpath: "/assets/img/posts/年-月-日-英文标题"
```

正文中引用：

```markdown
![图片说明](image.png)
```

## 4. 本地预览

```bash
PATH=/Users/liuhongfei/.rubies/ruby-3.4.1/bin:$PATH \
bundle exec jekyll serve --livereload
```

打开 <http://127.0.0.1:4000>，停止服务按 `Control + C`。

## 5. 发布前检查

```bash
PATH=/Users/liuhongfei/.rubies/ruby-3.4.1/bin:$PATH \
bash tools/test.sh
```

## 6. 提交发布

```bash
git status
git diff
git add 本次修改的文件
git commit -m "简要说明"
git push origin main
```

推送后 GitHub Pages 会自动部署到 <https://changanmark.github.io/>。

如需撤销已推送的提交，使用 `git revert 提交编号`，不要使用 `git reset --hard`。
