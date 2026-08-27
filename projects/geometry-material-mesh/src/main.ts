import * as THREE from 'three';
import { meshes } from './meshes';
import './style.css';

function getCanvas(): HTMLCanvasElement {
  const element = document.querySelector<HTMLCanvasElement>('#app');
  if (!element) {
    throw new Error('Canvas element #app was not found.');
  }
  return element;
}

const canvas = getCanvas();
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setClearColor(0x111827);

const scene = new THREE.Scene();
const availableMeshes = [...meshes];

for (let y = 2; y >= -2; y -= 1) {
  for (let x = -2; x <= 2; x += 1) {
    const object = availableMeshes.shift();
    if (!object) {
      continue;
    }

    object.position.set(x * 40, y * 25, 0);
    scene.add(object);
  }
}

const frontLight = new THREE.DirectionalLight(0xffffff, 3);
frontLight.position.set(15, 5, 30);
scene.add(frontLight);

const backLight = new THREE.DirectionalLight(0xffffff, 3);
backLight.position.set(-15, -5, -30);
scene.add(backLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.2));

const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
camera.position.set(0, 0, 150);
camera.lookAt(0, 0, 0);

function resizeRenderer(): void {
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);

  if (canvas.width === width && canvas.height === height) {
    return;
  }

  renderer.setSize(width, height, false);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

function render(milliseconds: number): void {
  resizeRenderer();

  const rotation = milliseconds * 0.0005;
  for (const object of meshes) {
    object.rotation.set(rotation, rotation, 0);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
