---
title: Geometry、Material 和 Mesh
date: 2025-11-19 00:00:00 +0800 # YYYY-MM-DD HH:MM:SS +/-TTTT 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: ["编程", "THREEJS"]
tags: ["three.js"] # TAG names should always be lowercase

media_subpath: "/assets/img/posts/2025-11-19-Geometry&Material&Mesh"

math: true
mermaid: true
---

{% include typescript-demo.html slug="geometry-material-mesh" title="Geometry、Material 和 Mesh 在线示例" height="560" %}

## Geometry
geometry 在 threejs 中代表几何顶点位置、索引、法线、颜色、UV纹理和自定义属性等信息，threejs 内置的几何命名规则是XXXGeometry,基本都是扩展自`BufferGeometry`。

BufferGeometry类似于一个 Map 容器，通过属性 position,index,normal,uv 等key映射具体的类型数组数据。具体的类型数组数据由`BufferAttribute`类表示。

其中顶点位置属性必须设置 
```js
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2
	 1.0,  1.0,  1.0, // v3
	-1.0,  1.0,  1.0, // v4
	-1.0, -1.0,  1.0  // v5
] );
// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
```

除了设置 position，还可以设置顶点索引 index，法线 normal, 贴图 uv 或者自定义属性。
可以通过任意一个几何体的 attributes 属性查看具有哪些属性，知道了这些属性，就可以自己设置属性来构造自定义的 Geometry 了。

## Material
material 在 threejs 中代表材质，材质决定了可渲染 3D 对象的外观。threejs 中内置的材质命名规则是 XXXMaterial，基本都是扩展自`Material`抽象类。

MeshBasicMaterial 不受光照影响

MeshLambertMaterial 漫反射效果

MeshPhongMaterial  高光反射效果

MeshPhysicalMaterial、MeshStandardMaterial这两种是物理材质

## Mesh
mesh 在 threejs 中代表网格对象，是 geometry 和 material 的结合体。geometry 中有顶点，顶点连接索引，material 中有渲染的外观信息，mesh 表示通过顶点连接成三角形网格后外表贴上材质对应外观的物体。
