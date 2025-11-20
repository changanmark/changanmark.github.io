import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.js';
import { ParametricGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.181.1/examples/jsm/geometries/ParametricGeometry.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.181.1/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.181.1/examples/jsm/geometries/TextGeometry.js';

const meshes = [];

function createMaterial() {
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });

  const hue = Math.random();
  const saturation = 1;
  const luminance = 0.5;
  material.color.setHSL(hue, saturation, luminance);

  return material;
}

{
  const width = 10;
  const height = 10;
  const depth = 10;
  const geometry = new THREE.BoxGeometry(width, height, depth);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radius = 5;
  const segments = 32;
  const geometry = new THREE.CircleGeometry(radius, segments);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radius = 6;
  const height = 8;
  const segments = 16;
  const geometry = new THREE.ConeGeometry(radius, height, segments);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radiusTop = 4;
  const radiusBottom = 4;
  const height = 8;
  const radialSegments = 12;
  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments
  );

  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radius = 5;
  const geometry = new THREE.DodecahedronGeometry(radius);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const shape = new THREE.Shape();
  const x = -2.5;
  const y = -5;
  shape.moveTo(x + 2.5, y + 2.5);
  shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

  const geometry = new THREE.ExtrudeGeometry(shape);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radius = 10;
  const geometry = new THREE.IcosahedronGeometry(radius);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const points = [];
  for (let i = 0; i < 10; ++i) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
  }

  const geometry = new THREE.LatheGeometry(points);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radius = 10;
  const geometry = new THREE.OctahedronGeometry(radius);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  /*
    from: https://github.com/mrdoob/three.js/blob/b8d8a8625465bd634aa68e5846354d69f34d2ff5/examples/js/ParametricGeometries.js

    The MIT License

    Copyright © 2010-2018 three.js authors

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

    */
  function klein(v, u, target) {
    u *= Math.PI;
    v *= 2 * Math.PI;
    u = u * 2;

    let x;
    let z;

    if (u < Math.PI) {
      x =
        3 * Math.cos(u) * (1 + Math.sin(u)) +
        2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
      z =
        -8 * Math.sin(u) -
        2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
    } else {
      x =
        3 * Math.cos(u) * (1 + Math.sin(u)) +
        2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
      z = -8 * Math.sin(u);
    }

    const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

    target.set(x, y, z).multiplyScalar(0.75);
  }
  const slices = 25;
  const stacks = 25;
  const geometry = new ParametricGeometry(klein, slices, stacks);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const width = 9;
  const height = 9;
  const widthSegments = 2;
  const heightSegments = 2;
  const geometry = new THREE.PlaneGeometry(
    width,
    height,
    widthSegments,
    heightSegments
  );
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const verticesOfCube = [
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
    -1, 1, 1,
  ];
  const indicesOfFaces = [
    2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2,
    3, 7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
  ];
  const radius = 7;
  const detail = 2;
  const geometry = new THREE.PolyhedronGeometry(
    verticesOfCube,
    indicesOfFaces,
    radius,
    detail
  );
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const innerRadius = 2;
  const outerRadius = 7;
  const segments = 18;
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const shape = new THREE.Shape();
  const x = -2.5;
  const y = -5;
  shape.moveTo(x + 2.5, y + 2.5);
  shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
  const geometry = new THREE.ShapeGeometry(shape);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radius = 7;
  const widthSegments = 12;
  const heightSegments = 8;
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radius = 7;
  const geometry = new THREE.TetrahedronGeometry(radius);
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const loader = new FontLoader();
  const font = await loader.loadAsync(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'
  );
  const geometry = new TextGeometry('Hello three.js!', {
    font: font,
    size: 3,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.3,
    bevelSegments: 5,
  });

  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radius = 5;
  const tubeRadius = 2;
  const radialSegments = 8;
  const tubularSegments = 24;
  const geometry = new THREE.TorusGeometry(
    radius,
    tubeRadius,
    radialSegments,
    tubularSegments
  );
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const radius = 3.5;
  const tube = 1.5;
  const radialSegments = 8;
  const tubularSegments = 64;
  const p = 2;
  const q = 3;
  const geometry = new THREE.TorusKnotGeometry(
    radius,
    tube,
    tubularSegments,
    radialSegments,
    p,
    q
  );
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  class CustomSinCurve extends THREE.Curve {
    constructor(scale) {
      super();
      this.scale = scale;
    }
    getPoint(t) {
      const tx = t * 3 - 1.5;
      const ty = Math.sin(2 * Math.PI * t);
      const tz = 0;
      return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
  }

  const path = new CustomSinCurve(4);
  const tubularSegments = 20;
  const radius = 1;
  const radialSegments = 8;
  const closed = false;
  const geometry = new THREE.TubeGeometry(
    path,
    tubularSegments,
    radius,
    radialSegments,
    closed
  );
  meshes.push(new THREE.Mesh(geometry, createMaterial()));
}

{
  const width = 8;
  const height = 8;
  const depth = 8;
  const thresholdAngle = 15;
  const geometry = new THREE.EdgesGeometry(
    new THREE.BoxGeometry(width, height, depth),
    thresholdAngle
  );

  const material = new THREE.LineBasicMaterial({ color: 0x000000 });

  meshes.push(new THREE.LineSegments(geometry, material));
}

{
  const width = 8;
  const height = 8;
  const depth = 8;
  const geometry = new THREE.WireframeGeometry(
    new THREE.BoxGeometry(width, height, depth)
  );

  const material = new THREE.LineBasicMaterial({ color: 0x000000 });

  meshes.push(new THREE.LineSegments(geometry, material));
}
export { meshes };
