---
title: "WebGL2 完整课程：从第一个像素到实时渲染器"
date: 2026-08-23 09:00:00 +0800
categories: ["编程","WebGL2"]
tags: ["webgl2", "webgl", "3d-graphics"]
math: true
toc: true
pin: true
---

这是一套以 [Real-Time 3D Graphics with WebGL 2 官方示例仓库](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2)为代码主线、重新编写的中文 WebGL2 教程。它不是原书翻译，而是对 67 个 HTML 示例和 14 个公共 JavaScript 模块进行逐文件拆解、验证与现代化审计。

每个示例都尽量回答六个问题：浏览器和 JavaScript 按什么顺序执行；哪些 WebGL 状态被改变；GPU 的哪个阶段消费这些数据；画面为何会变成现在这样；原代码有哪些教学性简化或缺陷；怎样实验才能证明自己真正理解。

## 课程目录

1. [Canvas、上下文与第一个完整应用]({% post_url 2026-08-23-webgl2-ch01 %})
2. [从 Buffer、VAO 到 Draw Call]({% post_url 2026-08-23-webgl2-ch02 %})
3. [法线、Lambert 与 Phong 光照]({% post_url 2026-08-23-webgl2-ch03 %})
4. [相机、坐标空间与投影矩阵]({% post_url 2026-08-23-webgl2-ch04 %})
5. [动画、时间积分与曲线插值]({% post_url 2026-08-23-webgl2-ch05 %})
6. [多光源、混合、剔除与透明]({% post_url 2026-08-23-webgl2-ch06 %})
7. [纹理、Mipmap、多纹理与 Cubemap]({% post_url 2026-08-23-webgl2-ch07 %})
8. [离屏颜色拾取]({% post_url 2026-08-23-webgl2-ch08 %})
9. [展厅渲染器架构]({% post_url 2026-08-23-webgl2-ch09 %})
10. [后处理、粒子、法线贴图与光线追踪]({% post_url 2026-08-23-webgl2-ch10 %})
11. [附录：14 个公共模块逐文件审计]({% post_url 2026-08-23-webgl2-common %})

## 建议学习方法

第一次按 1～10 章顺读，并实际运行对应源码。不要只看最终画面：打开 DevTools，记录 shader 编译日志、attribute/uniform location、buffer 字节数、draw call 参数和 GL 状态。

每完成一章，故意制造一次可控错误，例如错误的 stride、角度单位、纹理单元、法线空间或透明顺序。能从错误画面反推是 CPU 资源、WebGL 状态、shader 数学还是片元测试出了问题，才算掌握。

公共模块附录不是可有可无：章节代码中的 `Program`、`Scene`、`Camera`、`Transforms`、`Texture`、`Picker` 和 `PostProcess` 隐藏了大量状态。建议在对应章节学完后回看相关模块。

## 环境准备

示例通过站点根路径 `/common/...` 加载资源，因此应从官方仓库根目录启动本地 HTTP 服务，不能直接双击 HTML 以 `file://` 运行。浏览器需支持 WebGL2；先通过 `canvas.getContext('webgl2')` 检查上下文是否创建成功。

教程会忠实解释源码实际行为，也会明确指出其中的单位、状态、资源生命周期和数学问题。示例代码适合学习，但进入真实项目之前，需要按每节的“现代改写”和“验收”部分补足工程能力。

[开始第一章 →]({% post_url 2026-08-23-webgl2-ch01 %})
