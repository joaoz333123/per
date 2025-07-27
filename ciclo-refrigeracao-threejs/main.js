import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Configuração básica
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Luzes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 5);
scene.add(directionalLight);

// Materiais
const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const grayMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });

// --- Componentes do Sistema ---
const components = new THREE.Group();
scene.add(components);

const componentObjects = []; // Para raycasting

// 1. Compressor
const compressorGeo = new THREE.BoxGeometry(4, 4, 4);
const compressor = new THREE.Mesh(compressorGeo, grayMaterial);
compressor.position.set(-10, 0, 0);
compressor.name = "Compressor";
compressor.userData.description = "Compressor: Comprime o gás refrigerante, aumentando sua pressão e temperatura.";
components.add(compressor);
componentObjects.push(compressor);

// 2. Condensador
const condenserGeo = new THREE.BoxGeometry(6, 5, 3);
const condenser = new THREE.Mesh(condenserGeo, grayMaterial);
condenser.position.set(0, 7, 0);
condenser.name = "Condensador";
condenser.userData.description = "Condensador: Remove o calor do refrigerante, que se condensa de gás para líquido.";
components.add(condenser);
componentObjects.push(condenser);

// 3. Válvula de Expansão
const valveGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
const valve = new THREE.Mesh(valveGeo, grayMaterial);
valve.position.set(10, 0, 0);
valve.name = "Válvula de Expansão";
valve.userData.description = "Válvula de Expansão: Reduz a pressão do refrigerante líquido, causando uma queda brusca de temperatura.";
components.add(valve);
componentObjects.push(valve);

// 4. Evaporador (Chiller)
const evaporatorGeo = new THREE.BoxGeometry(6, 5, 3);
const evaporator = new THREE.Mesh(evaporatorGeo, grayMaterial);
evaporator.position.set(0, -7, 0);
evaporator.name = "Evaporador (Chiller)";
evaporator.userData.description = "Evaporador: O refrigerante absorve calor da água, evaporando. A água gela.";
components.add(evaporador);
componentObjects.push(evaporator);

// 5. AHU (Unidade de Tratamento de Ar)
const ahuGeo = new THREE.BoxGeometry(5, 4, 10);
const ahu = new THREE.Mesh(ahuGeo, grayMaterial);
ahu.position.set(-15, -7, 0);
ahu.name = "AHU / Fancoil";
ahu.userData.description = "AHU: O ar quente passa pela serpentina de água gelada e é resfriado antes de ser distribuído.";
components.add(ahu);
componentObjects.push(ahu);

// --- Tubulações ---
function createPipe(points, color) {
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 64, 0.3, 8, false);
    const material = new THREE.MeshStandardMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
}

// Tubulação do ciclo de refrigeração
const pipePointsRefrigerant = [
    new THREE.Vector3(-8, 0, 0), // Saída Compressor
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(-3, 7, 0), // Entrada Condensador
    new THREE.Vector3(3, 7, 0),  // Saída Condensador
    new THREE.Vector3(3, 0, 0),
    new THREE.Vector3(8, 0, 0), // Entrada Válvula
    new THREE.Vector3(12, 0, 0), // Saída Válvula
    new THREE.Vector3(3, 0, 0),
    new THREE.Vector3(3, -7, 0), // Entrada Evaporador
    new THREE.Vector3(-3, -7, 0), // Saída Evaporador
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(-8, 0, 0), // Entrada Compressor
];
const refrigerantPipe = createPipe(pipePointsRefrigerant, 0xaaaaaa);
components.add(refrigerantPipe);

// Tubulação de água gelada
const pipePointsWater = [
    new THREE.Vector3(0, -9, 0),   // Saída Evaporador
    new THREE.Vector3(-12.5, -9, 0),// Entrada AHU
    new THREE.Vector3(-17.5, -9, 0),// Saída AHU
    new THREE.Vector3(0, -9, 0),   // Entrada Evaporador
];
const waterPipe = createPipe(pipePointsWater, 0x5555ff);
components.add(waterPipe);


// --- Animações ---
let particles, arrows;
let animationActive = false;

function setupAnimations() {
    // Partículas para o fluxo
    const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    particles = new THREE.Group();
    const curves = {
        hotGas: new THREE.CatmullRomCurve3(pipePointsRefrigerant.slice(0, 3)),
        hotLiquid: new THREE.CatmullRomCurve3(pipePointsRefrigerant.slice(3, 6)),
        coldLiquid: new THREE.CatmullRomCurve3(pipePointsRefrigerant.slice(6, 9)),
        coldGas: new THREE.CatmullRomCurve3(pipePointsRefrigerant.slice(9, 12)),
        chilledWater: new THREE.CatmullRomCurve3(pipePointsWater.slice(0, 2)),
        returnWater: new THREE.CatmullRomCurve3(pipePointsWater.slice(2, 4))
    };

    for (let i = 0; i < 0.9; i += 0.1) {
        particles.add(new THREE.Mesh(particleGeo, redMaterial).translateX(i)); // hotGas
        particles.add(new THREE.Mesh(particleGeo, redMaterial).translateX(i)); // hotLiquid
        particles.add(new THREE.Mesh(particleGeo, blueMaterial).translateX(i)); // coldLiquid
        particles.add(new THREE.Mesh(particleGeo, blueMaterial).translateX(i)); // coldGas
        particles.add(new THREE.Mesh(particleGeo, blueMaterial).translateX(i)); // chilledWater
        particles.add(new THREE.Mesh(particleGeo, new THREE.MeshStandardMaterial({color: 0x87CEEB})).translateX(i)); // returnWater
    }

    particles.children.forEach(p => {
        p.userData.curve = curves[Object.keys(curves)[Math.floor(particles.children.indexOf(p) / 9)]];
        p.userData.offset = Math.random();
    });

    scene.add(particles);

    // Setas para troca de calor
    arrows = new THREE.Group();
    // Condensador (libera calor)
    for (let i = 0; i < 5; i++) {
        const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), condenser.position.clone().add(new THREE.Vector3(i * 1.2 - 2.4, 3, 0)), 3, 0xff0000);
        arrows.add(arrow);
    }
    // Evaporador (absorve calor)
    for (let i = 0; i < 5; i++) {
        const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), evaporator.position.clone().add(new THREE.Vector3(i * 1.2 - 2.4, -3, 0)), 3, 0x0000ff);
        arrows.add(arrow);
    }
     // AHU (ar quente entra, frio sai)
    arrows.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), ahu.position.clone().add(new THREE.Vector3(-5, 0, 0)), 3, 0xff0000));
    arrows.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), ahu.position.clone().add(new THREE.Vector3(5, 0, 0)), 3, 0x0000ff));

    arrows.visible = false;
    scene.add(arrows);
}


// --- Labels 3D ---
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const textOptions = { font: font, size: 0.8, height: 0.1 };

    function createLabel(text, position) {
        const geo = new TextGeometry(text, textOptions);
        const mesh = new THREE.Mesh(geo, textMaterial);
        mesh.position.copy(position);
        mesh.position.y += 4; // Posição acima do componente
        scene.add(mesh);
    }

    createLabel("Compressor", compressor.position);
    createLabel("Condensador", condenser.position);
    createLabel("Válvula", valve.position);
    createLabel("Evaporador", evaporator.position);
    createLabel("AHU", ahu.position);
});


// --- Interatividade ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(componentObjects);

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        tooltip.style.display = 'block';
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
        tooltip.textContent = obj.userData.description;
    } else {
        tooltip.style.display = 'none';
    }
}

// Botão Iniciar
document.getElementById('startButton').addEventListener('click', () => {
    animationActive = !animationActive;
    arrows.visible = animationActive;
    particles.visible = animationActive;
    document.getElementById('startButton').textContent = animationActive ? 'Parar Ciclo' : 'Iniciar Ciclo';
});


// --- Loop de Animação ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (animationActive) {
        const time = performance.now() * 0.0005;
        particles.children.forEach(p => {
            const t = (time + p.userData.offset) % 1;
            const point = p.userData.curve.getPointAt(t);
            p.position.copy(point);
        });
        compressor.material.color.set(Math.sin(time * 10) > 0 ? 0xff4444 : 0xff0000);
    }

    renderer.render(scene, camera);
}

// Responsividade
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', onMouseMove);

setupAnimations();
animate();
