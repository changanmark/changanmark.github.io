---
title: "WebGL2 完整教程（附录）：14 个公共模块逐文件审计"
date: 2026-08-23 09:11:00 +0800
categories: ["WebGL2"]
tags: ["webgl2", "webgl", "3d-graphics"]
math: true
toc: true
---

> 本文是 WebGL2 系列课程正文，按官方示例代码逐文件讲解。内容为基于源码重新编写的中文教程，并非原书翻译。

[← 上一篇]({% post_url 2026-08-23-webgl2-ch10 %}) · [课程目录]({% post_url 2026-08-23-webgl2-course-index %}) · [下一篇 →]({% post_url 2026-08-23-webgl2-course-index %})

## 公共模块 1：utils.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/utils.js)

utils 集中 Canvas/context、shader、颜色、法线、切线、GUI 等杂项。它减少示例噪声，也因职责过多成为最应拆分的文件。

### Canvas 与 Context

`getCanvas`/`getGLContext` 做 null 检查，但失败路径多为 console.error 后返回 undefined。调用者若继续执行，下一句才抛“cannot read property…”，丢失根因。底层工具应抛带 canvas id/context options 的 Error，让 init 立即终止。

`autoResizeCanvas` 以窗口尺寸改 drawing buffer，未系统处理 CSS 容器、devicePixelRatio、最大纹理尺寸以及依赖尺寸的 Picker/PostProcess 附件。正确 renderer resize 先计算 `round(cssSize*dpr)`，有变化才改 buffer，再更新 viewport、Projection、所有 RenderTarget。

### Shader 编译

`getShader` 从 DOM script 的 type 判断阶段，source/compile/check status。编译失败应打印带行号源码与 info log，并 deleteShader；未知 type/缺节点应抛错。Program 成功链接后 shader objects 可 detach/delete，链接后的 executable 仍在 program 内。

### 法线生成

`calculateNormals` 每三索引取边叉积，把未单位化面法线累加到三个顶点，最后 normalize，近似面积加权平滑。方向取决于索引绕序。退化三角形贡献零；它不理解 smoothing group、crease/hard edge，也不支持 position index 与 normal index 分离，所以硬边立方体若共享顶点会被错误平滑。

### 切线生成审计

通用公式需 UV determinant：`r=1/(duv1.x*duv2.y-duv1.y*duv2.x)`，`T=(e1*duv2.y-e2*duv1.y)*r`。仓库实现存在类似 `tex2[0]-tex0[1]` 的 U/V 混用，没有 determinant、退化保护、bitangent/handedness，也未正交化。它只可视为教学占位；生产应用使用导出 tangent vec4/MikkTSpace。

### 改写与验收

拆为 canvas、shader、geometry、color、UI 模块；纯数学函数写单元测试。用一个已知 CCW 三角形验证法线 +Z；退化 UV 不得产生 NaN；镜像 UV 应输出相反 handedness，而不是随机翻面。

---

## 公共模块 2：Program.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Program.js)

Program constructor 取得两个 shader、create/attach/link/use；`load(attributes,uniforms)` 查询 location 并直接挂到实例，如 `program.uProjectionMatrix`。

attribute location 是整数，-1 表示未激活/不存在；0 是合法位置，不能用 truthy 判断。uniform location 是 WebGLUniformLocation 或 null；向 null 上传通常静默无操作，教学方便却会隐藏拼写错。开发模式应把 required/optional 接口分开，缺 required 立即抛错。

location 只对该 linked program 有效。热重载或重新 link 后，旧 location 全部失效，必须重新反射。GUI callback 直接向当前 program 写 uniform 还要求 `gl.useProgram(this.handle)` 已执行，否则 INVALID_OPERATION。

源码应补全 link info log；成功后 detach/delete shader；提供 `use()`、`dispose()`，并避免把原生 handle 和任意业务字段混成一个命名空间。可反射 ACTIVE_UNIFORMS/ATTRIBUTES，记录类型/size，在 uniform setter 中验证 vec3、mat4 与数组长度。

验收：故意制造 compile、link、缺 uniform 三类错误，日志必须区分；attribute 恰好为 location 0 时仍正常；切换两个 program 后向错误 program location 上传能被开发层捕获。

---

## 公共模块 3：Scene.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Scene.js)

Scene 当前同时负责请求 JSON、解析/默认材质、创建 GPU buffers/VAO、保存 objects、遍历和排序。对示例很方便，对资源生命周期则过载。

### 加载契约

`load` 返回 Promise，但 then 没有返回创建对象，catch 记录后吞错；调用者难拿到 Renderable，Promise.all 也可能把失败当完成。应检查 response.ok，返回 object，让错误继续 reject 并附 URL。`loadByParts` 应收集并 return Promise.all，否则汽车何时 ready 无法得知。

### add 的 GPU 顺序

它补 OBJ/MTL 风格字段时使用 `value || default`，会把合法 `Ns=0,d=0,illum=0` 覆盖，必须用 `??`。随后建 IBO、VAO、position/normal/color/UV/tangent buffers。

源码在 bind 新 VAO 前先 bind ELEMENT_ARRAY_BUFFER，因此 EBO 绑定留在默认 VAO，而非对象 VAO；各页面 draw 又显式 bind EBO 才能运行。标准顺序是 bind VAO → bind/upload EBO → 配 attribute，最后 unbind VAO。ARRAY_BUFFER binding 本身不保存在 VAO，attribute pointer 捕获当时 buffer；ELEMENT binding 会保存。

除 IBO/VAO 外多个 buffer 句柄只在局部变量中，之后无法 delete。Mesh 应保存全部 handles、indexType/count、bounds 并 dispose；多个 Renderable 可共享 Mesh。

Scene 总是重算法线，可能覆盖资产硬边语义；需要优先使用输入 normal，缺失时才生成。切线仅在 UV 与 shader attribute 需要时生成，但当前 utils 算法不通用。

验收：创建对象后仅 bind VAO 就应能 drawElements；dispose 后所有 buffer/VAO 数下降；同 URL 两实例共享 Mesh；某 part 404 时整组加载明确 reject。

---

## 公共模块 4：Camera.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Camera.js)

Camera 的 matrix 描述相机姿态（camera→world），`getViewTransform` 求逆得到 world→camera。position、azimuth/elevation、matrix、right/up/normal 是同一姿态的多份表示，任何 setter 后都必须同步。

Orbiting 让 position 围绕 focus，由角度与 distance 派生；Tracking 更像相机自身平移/旋转。变换调用顺序决定是公转还是原地转头。`goHome` 保存/恢复数组时必须复制，防止 current position 改动连带修改 home。

方向轴由矩阵变换局部单位轴，齐次 w=0。它们应单位化且两两正交。长期累积欧拉矩阵会有漂移/万向锁；工程版选 position+unit quaternion 为唯一姿态源，每次派生 matrix/basis。

`dolly` 的协议依赖 `stepIncrement-this.steps`，实际上更像 dollyTo 累计值；若调用者传本次 delta 会错误。API 应拆 `dollyBy(delta)` 与 `setDistance(value)`。Dolly 改视点/视差，FOV zoom 只改视锥。

源码用 `~indexOf` 判断 type 是否有效，可改 includes 提高可读性。所有 angle 属性应在名字/边界明确 degrees 或 radians；Camera.fov=45 与 Transforms 直接传 gl-matrix 的组合是已知单位风险。

验收：`V*C` 近似单位阵；basis 点积近 0、长度近 1；Orbiting 改 azimuth 后到 focus 距离不变；Tracking yaw 后 position 不公转。

---

## 公共模块 5：Transforms.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Transforms.js)

Transforms 持有 modelViewMatrix、projectionMatrix、normalMatrix 和矩阵栈，并引用 Camera/canvas/program。`calculateModelView` 取 camera View；对象代码随后在该矩阵上追加 model 变换。

normal matrix 为 `(MV⁻¹)ᵀ`。scale 某轴为 0 时矩阵不可逆，gl-matrix invert 失败；代码必须检测而非上传旧/零值。shader 若只需方向，mat3 比 mat4 更清楚。

`push` 复制当前矩阵再入栈是正确的；若只 push Float32Array 引用，后续原地 translate 会同时改栈内值。`pop` 空栈当前返回 null，工程版应抛“unbalanced transform stack”，否则一个对象错误会污染之后全部对象。

`setMatrixUniforms` 无条件上传 MV/P/Normal，要求 program 接口存在且 current。现代渲染器将 P/V per-frame 上传一次，对象仅上传 M/MV/Normal，或用 UBO；先保证语义清楚再缓存。

最大问题是 `updatePerspective` 把 `camera.fov` 直接传给 gl-matrix，而默认 45 很像度；gl-matrix 需要弧度。统一为 `fovRadians=Math.PI/4`，GUI 才做度转换。resize 后 aspect 取 drawing buffer，不是 CSS 尺寸。

验收：已知 M/V 点手算结果；非均匀缩放后法线仍与切线垂直；push/两次修改/pop 能精确恢复；FOV 45° 与 π/4 的画面一致。

---

## 公共模块 6：Controls.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Controls.js)

Controls 把 mouse/keyboard 直接映射 Camera 和 Picker。它同时承担低级输入、手势状态、相机 controller、对象选择/移动，教学可读但耦合较强。

源码赋值 `canvas.onmousedown/onmousemove...` 会覆盖已有 handler，也缺统一 dispose。现代用 addEventListener + AbortController/signal 或保存函数引用移除；Pointer Events 统一鼠标/触摸/笔，并在 pointerdown `setPointerCapture`，防止拖出 canvas 丢 pointerup。

坐标函数累计 offset，无法稳健处理 CSS transform、滚动、边框和 DPR。应 `getBoundingClientRect`，再乘 `canvas.width/rect.width`，Y 为 bottom-clientY。Camera 旋转灵敏度可用 CSS 像素归一化，但 readPixels 必须用 buffer 像素。

Alt-dolly、普通 orbit、picker move 共享鼠标状态，优先级需显式状态机；event.button 主要在 down/up 使用，move 应看 buttons 位掩码。键盘不使用废弃 keyCode，改 event.code，并避免拦截输入框快捷键。

架构上拆 Input（原始事件）→ Gesture（drag/pinch）→ CameraController/ObjectManipulator。输入只改应用 state，render tick 统一提交 GL。

验收：两个控制器可同时订阅不互相覆盖；拖出 canvas 再松开不会卡住；DPR/CSS zoom 下 picking 正确；dispose 后所有事件不再触发。

---

## 公共模块 7：Clock.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Clock.js)

Clock 永久安排 requestAnimationFrame，`isRunning` 只控制是否 emit tick；窗口 blur/focus 暂停/恢复业务 tick。它没有把 RAF timestamp 或 dt 传给 listener，导致各系统自行 Date.now，时间基准可能不一致。

正确 Clock 每帧计算 `dt=min((now-prev)/1000,maxDt)`，同时传 now/dt/frameIndex；固定物理步用 accumulator 放在 Simulation，而非假定每 tick=1/60。后台恢复后的大 dt 要截断或重置 previous。

若 stop 仍继续安排 RAF，只是不 emit，会有极小持续开销；dispose 应 cancelAnimationFrame 并移除 blur/focus。start/stop 语义需区分 pause（可恢复时间）与 destroy。

Clock 继承 EventEmitter，因此某 listener 抛错可能阻断后续 listener；帧调度应 try/finally 确保下一 RAF 是否仍安排由明确策略决定。

验收：60/144Hz 下传入的 dt 总和近似真实秒；后台 5 秒恢复不出现巨大一步；stop/dispose 后 DevTools 不再看到该 RAF callback。

---

## 公共模块 8：EventEmitter.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/EventEmitter.js)

EventEmitter 维护事件名→listener 数组，on 注册、off/remove 移除、emit 顺序调用。Clock 用它发布 tick。

源码 emit 不传参数，所以 Clock 无法下发 timestamp/dt；应 `emit(name,...args)`。remove 需要完全相同函数引用，匿名箭头无法轻易注销；on 可返回 unsubscribe 函数。还应提供 once 与 clear/dispose。

emit 时 listener 可能增删列表。直接遍历原数组会导致跳过/重复；可 snapshot `listeners.slice()`，或明确规定变更下次 emit 生效。一个 listener 抛错当前会阻断后续，底层事件系统应决定隔离并汇报，还是 fail-fast，不能偶然决定。

防止内存泄漏：拥有订阅的一方负责注销；组件 dispose 统一执行 unsubscribe。开发模式可对异常多 listener 警告，但阈值只是诊断。

验收：listener A 在回调中删除 B、添加 C，调用顺序符合书面约定；once 仅执行一次；异常 listener 的策略可预测；dispose 后 listener 数为 0。

---

## 公共模块 9：Texture.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Texture.js)

constructor 创建 WebGLTexture；`setImage` 创建 Image，onload 时 bind、texImage2D、设 LINEAR mag 与 LINEAR_MIPMAP_NEAREST min、generateMipmap，再 unbind。

因为 min filter 依赖 mip，图片到达前纹理不完整；加载器应立即上传 1×1 占位并先用 LINEAR，真实图到后生成 mip/切换参数。占位按语义：base color 洋红、normal `(128,128,255)`、乘法 lightmap 白。

缺失的错误路径包括 Image.onerror、CORS、解码失败、尺寸/内存上限。设置 crossOrigin 必须在 src 前。回调可能在 owner 已 dispose 后到达，需 generation token/aborted flag；dispose deleteTexture 并使后续 bind 抛清晰错误。

pixelStore 是 context 全局状态，不在 Texture 内自动隔离；上传前明确 flipY、premultiplyAlpha、alignment。纹理参数属于 texture object，修改前 bind 正确对象。颜色/数据纹理还要区分 sRGB 语义，normal/mask 绝不能当颜色解码。

API 应公开 ready Promise、width/height/format/mip policy/wrap/filter，并支持 ImageBitmap。验收：慢网占位、404 reject、销毁后完成加载不再上传；选择 mip filter 时完整链存在。

---

## 公共模块 10：Picker.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Picker.js)

Picker 拥有 RGBA color texture、DEPTH_COMPONENT16 renderbuffer、FBO 和 pickedList。configure 分配附件，update resize，find readPixels 并匹配颜色，stop 处理选择集合。

constructor 只收 canvas/callbacks，却直接使用全局 gl 与 scene，是隐藏依赖，也无法多 context 测试。应显式注入 gl 与 `Map<id,object>`。texture 用于 readback，应设 NEAREST、CLAMP；附件后 checkFramebufferStatus。

find 每次同步 readPixels 后遍历所有 object，compare RGB 并容许 ±1，O(N)。整数 ID byte decode + Map 可 O(1)，0 留背景。ID pass 禁 blend/dither/光照；保留 depth test/write；viewport 与附件匹配。

update 重分配 texture/renderbuffer，但没有检查尺寸是否实际变化，也未 unbind/恢复所有状态。它改变当前 texture/renderbuffer bindings，调用者若依赖旧状态会泄漏。RenderTarget resize 应在 frame begin 统一进行。

pickedList 究竟是临时拖拽命中还是持久 selection，stop 后清空说明语义偏临时；API 名应明确。dispose 删除三项 GPU 资源。

验收：FBO complete；DPR/CSS resize 与遮挡下命中正确；背景 ID=0；100k objects 反查时间不随 N 线性增长；dispose 后资源可回收。

---

## 公共模块 11：PostProcess.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/PostProcess.js)

PostProcess 同时拥有 render target（color texture/depth renderbuffer/FBO）、全屏几何 buffers 和后处理 program。configureFramebuffer/Geometry/Shader 三步分别建立资源。

FBO 参数 NEAREST+CLAMP 合理，但缺 complete 检查。`validateSize` 无条件重新分配，应该只在尺寸变时调用；0 尺寸需跳过。它修改 bindings 后只清 texture/renderbuffer，未恢复调用者原状态，工程 renderer 通常由 pass 边界统一控制。

全屏 quad 用六顶点、两个 buffer，每 bind 重设 attribute。可建专用 VAO，或以一个 oversized triangle 三顶点覆盖屏幕，减少接缝/顶点。attribute location 0 是合法，不能 truthy 判断；uniform location 是对象，源码的 `if (uniform)` 对 null 判断可行。

configureShader 重新配置时 delete 旧 program 是好习惯，但需处理 shader compile/link log 和 shader object 删除。新 program 编译失败时最好保留旧 program，不要先破坏可运行状态。

bind 设置 texture unit0、uSampler、可选 uTime/uInverseTextureSize；它假定当前默认 framebuffer/post viewport/depth 状态由外部处理。完善的 `beginScene/endScene/draw` 应把 framebuffer、viewport、program、depth/blend 都写成显式 pass contract。

dispose 删除 texture/renderbuffer/FBO/two buffers/program/VAO。验收：resize 后附件尺寸一致、FBO complete；纯复制 pass 像素方向正确；同纹理不会同时读写；热切 shader 失败时旧效果仍运行。

---

## 公共模块 12：Light.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Light.js)

Light 保存 id、position、ambient/diffuse/specular、direction 等光源数据；setter 对传入数组 slice，避免外部之后修改同一数组造成隐式共享，这是正确的防御复制。

LightsManager 管理 lights，并用 `getArray(property)` reduce/concat 展平成 uniform3fv/4fv 所需连续布局。每次调用都会创建多个新 JS array；灯每帧更新时会产生 GC。可按固定 MAX_LIGHTS 维护 Float32Array，某灯 dirty 时写对应 offset，再统一上传。

数据结构必须带空间语义：positionWorld、directionWorld 或明确已是 eye space。位置变换 w=1，方向 w=0；世界灯每帧乘 View，不乘对象 Model。颜色最好说明线性 RGB 与强度单位，不能仅靠 0～1 diffuse 表示所有物理量。

WebGL2 多灯可用 UBO；std140 中 vec3 通常占 16-byte slot，JS packing 必须遵守。灯数量与 shader 常量同步，或提供 uLightCount。

验收：调用 setter 后修改原输入数组不影响 Light；展平顺序与 shader index 一致；灯增删不会留下旧 uniform；world/eye 变换在相机旋转时可验证。

---

## 公共模块 13：Floor.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Floor.js)

Floor 在 CPU 生成 XZ 平面网格线：按尺寸/间隔产生平行于 X 与 Z 的成对端点，indices/vertices 交给 Scene.add，通常以 LINES 绘制。它证明 scene object 不必来自 JSON。

参数 `lines` 在 build 中被重新解释成数量/间距，变量命名容易混淆。明确 API 应使用 halfExtent、spacing 或 lineCount，并定义是否包含原点和两侧端点。浮点循环累加 spacing 可能少/多一条，按整数 i 计算坐标更稳。

Floor 是 debug/reference geometry，不应被普通汽车材质的 illum/wireframe 分支牵制。独立 debug program/pass 只需 position+color，避免上传 normal/material/lights。

线宽在 WebGL 多数平台实际只可靠为 1，`lineWidth` 范围需查询；粗网格用相机朝向的 quad/三角形生成，而不是假设平台支持宽线。

验收：不同 extent/spacing 下顶点数可由公式预测；中心线不重复；坐标均在预期平面；隐藏 floor 时不进入 render queue，也不上传 object uniforms。

---

## 公共模块 14：Axis.js

[源码](https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2/blob/master/common/js/Axis.js)

Axis 程序生成从原点沿 +X/+Y/+Z 的三条线，并为顶点配置红/绿/蓝颜色。它是调试坐标空间、模型朝向和矩阵顺序最有价值的几何之一。

若 Axis 作为 world axis，只乘 View/P；若作为某对象 local axis，应乘该对象 Model。把两套 axis 同时画出，可直接看到 M 如何把局部基映射到世界。方向轴若需显示平移，应由线段位置顶点 w=1；用来做数学方向变换时则 w=0。

Scene 若 shader 没有 aVertexColor，attribute location=-1，不应创建/enable；若有颜色则一次 draw 中 vertex color mode 必须明确打开，避免继承前一对象材质 uniform。

轴线同样受 depth test：需要被几何遮挡的 3D gizmo 保持 depth；始终置顶的编辑器 overlay 可独立 pass 清/禁 depth，但必须恢复状态。粗箭头/标签需额外几何或屏幕空间 UI。

验收：默认右手系中 X红、Y绿、Z蓝；对对象施加 90° Y 旋转，local axis 与手算方向一致；world axis 不随对象动，相机移动时二者都按 View 变化。

---

[← 上一篇]({% post_url 2026-08-23-webgl2-ch10 %}) · [课程目录]({% post_url 2026-08-23-webgl2-course-index %}) · [下一篇 →]({% post_url 2026-08-23-webgl2-course-index %})
