---
title: 场景树
date: 2025-11-21 00:00:00 +0800 # YYYY-MM-DD HH:MM:SS +/-TTTT 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: ["编程", "前端"]
tags: ["three.js"] # TAG names should always be lowercase

media_subpath: "/assets/img/posts/2025-11-21-scene-tree"

math: true
mermaid: true
---

<canvas id="c" style="display: block;width: 100%; height: 500px"></canvas>

<script type="module" src="/assets/utils/2025-11-21-scene-tree/index.js">

</script>

## 数据结构 Object3D
Object3D 是 threejs 中的一个树结构类，其中.parent属性指代当前节点的父节点，children 指代当前节点的所有子节点。

如下图所示，threejs中的物体通过继承 Object3D 对象构成一棵树形结构，这棵树就是场景树，所有的物体都是树中的一个节点。

![场景树](image.png)

## 场景树搜索
Object3D 提供了针对场景树的搜索函数，如下所示：

```js
// 从 3D 对象本身开始，搜索 3D 对象及其子对象，并返回第一个具有匹配 ID 的对象。
.getObjectById( id : number ) : Object3D | undefined

// 从 3D 对象本身开始，搜索 3D 对象及其子对象，并返回第一个名称匹配的对象。
.getObjectByName( name : string ) : Object3D | undefined

// 从 3D 对象本身开始，搜索 3D 对象及其子对象，并返回第一个具有匹配属性值的对象。
.getObjectByProperty( name : string, value : any ) : Object3D | undefined

// 从 3D 对象本身开始，搜索 3D 对象及其子对象，并返回所有具有匹配属性值的 3D 对象。
.getObjectsByProperty( name : string, value : any, result : Array.<Object3D> ) : Array.<Object3D>

// 对该 3D 对象及其所有后代执行回调函数。注意：不建议在回调函数内部修改场景图。
.traverse( callback : function )

// 与Object3D#traverse类似，但回调函数只会针对所有祖先元素执行。注意：不建议在回调函数内部修改场景图。
.traverseAncestors( callback : function )

// 与Object3D#traverse类似，但回调函数只会针对可见的 3D 对象执行。不可见 3D 对象的后代不会被遍历。注意：不建议在回调函数内部修改场景图。
.traverseVisible( callback : function )
```

## 世界坐标系与局部坐标系
- 场景每个物体都存在两个坐标系，分别是世界坐标系和局部坐标系。世界坐标系所有物体共享同一个，局部坐标系每个物体都独有一个。

- 旋转、平移、缩放都是相对于自己的局部坐标系，因此旋转、平移、缩放不会改变自己的局部坐标系的位置，只会修改物体本身相对于局部坐标系的状态。

- .position 修改物体的局部坐标系的位置。

- Object3D 中提供了一些局部坐标系和全局坐标系的方法如下：

```js
// 返回 3D 对象在世界空间中的“视线”方向。
.getWorldDirection( target : Vector3 ) : Vector3

// 返回 3D 对象在世界空间中的位置。（向量表示）
.getWorldPosition( target : Vector3 ) : Vector3

// 返回 3D 对象在世界空间中的位置。（四元数表示）
.getWorldQuaternion( target : Quaternion ) : Quaternion

// 返回 3D 对象在世界空间中的缩放比例。
.getWorldScale( target : Vector3 ) : Vector3

// 将给定的向量从该 3D 对象的局部空间转换为世界空间。
.localToWorld( vector : Vector3 ) : Vector3
```

