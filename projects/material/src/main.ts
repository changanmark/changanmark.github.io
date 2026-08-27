import * as THREE from 'three';
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
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const geometry = new THREE.SphereGeometry(1.15, 64, 32);

const materials: THREE.Material[] = [
  new THREE.MeshBasicMaterial({ color: 0xef4444 }),
  new THREE.MeshLambertMaterial({ color: 0x22c55e }),
  new THREE.MeshPhongMaterial({ color: 0x3b82f6, shininess: 100 }),
  new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.15,
    roughness: 0.45,
  }),
  new THREE.MeshPhysicalMaterial({
    color: 0xa855f7,
    metalness: 0.1,
    roughness: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }),
];

const meshes = materials.map((material, index) => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (index - 2) * 3;
  scene.add(mesh);
  return mesh;
});

scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.4));

const keyLight = new THREE.DirectionalLight(0xffffff, 4);
keyLight.position.set(4, 6, 8);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x60a5fa, 2);
rimLight.position.set(-6, -2, 4);
scene.add(rimLight);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 12);
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

  const rotation = milliseconds * 0.00035;
  for (const mesh of meshes) {
    mesh.rotation.set(rotation, rotation, 0);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
