//22FI029 小川麗


import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private cloud: THREE.Points;
    private particleNum: number = 1000;
    private shapes: THREE.Vector3[][] = [];
    private colors: THREE.Color[] = [];

    constructor() { }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.shadowMap.enabled = true;

        // カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで、render
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();
            TWEEN.update(time);
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成
    private createScene = () => {
        this.scene = new THREE.Scene();

        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleNum * 3);
        const colors = new Float32Array(this.particleNum * 3);

        for (let i = 0; i < this.particleNum; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            this.colors.push(color);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({ vertexColors: true, size: 0.1 });
        this.cloud = new THREE.Points(particles, material);
        this.scene.add(this.cloud);

        // 形状を作成して配列に追加
        this.shapes.push(this.generateSpherePoints(5));
        this.shapes.push(this.generateBoxPoints(5));
        this.shapes.push(this.generateTorusPoints(5));
        this.shapes.push(this.generateCustomShapePoints());

        this.animateParticles(particles);
        
        // ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    }

    private animateParticles = (geometry: THREE.BufferGeometry) => {
        const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
        const colors = geometry.getAttribute('color') as THREE.BufferAttribute;
        const particleNum = positions.count;

        const tweenInfos = [];
        for (let i = 0; i < particleNum; i++) {
            const tweeninfo = { x: 0, y: 0, z: 0, index: i };
            tweenInfos.push(tweeninfo);
        }

        const updatePosition = () => {
            for (let i = 0; i < tweenInfos.length; i++) {
                positions.setXYZ(tweenInfos[i].index, tweenInfos[i].x, tweenInfos[i].y, tweenInfos[i].z);
                const color = new THREE.Color(Math.random(), Math.random(), Math.random());
                colors.setXYZ(tweenInfos[i].index, color.r, color.g, color.b);
            }
            positions.needsUpdate = true;
            colors.needsUpdate = true;
        };

        const createTweenSequence = (shapeIndex: number) => {
            const tweens = [];
            for (let i = 0; i < particleNum; i++) {
                const target = this.shapes[shapeIndex][i % this.shapes[shapeIndex].length];
                const tween = new TWEEN.Tween(tweenInfos[i])
                    .to({ x: target.x, y: target.y, z: target.z }, 2000)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onUpdate(updatePosition);
                tweens.push(tween);
            }
            return tweens;
        };

        const tweenSequences = this.shapes.map((_, index) => createTweenSequence(index));

        for (let i = 0; i < tweenSequences.length; i++) {
            const current = tweenSequences[i];
            const next = tweenSequences[(i + 1) % tweenSequences.length];
            for (let j = 0; j < current.length; j++) {
                current[j].chain(next[j]);
            }
        }

        for (let i = 0; i < tweenSequences[0].length; i++) {
            tweenSequences[0][i].start();
        }
    }

    private generateSpherePoints(radius: number): THREE.Vector3[] {
        const points = [];
        for (let i = 0; i < this.particleNum; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            points.push(new THREE.Vector3(x, y, z));
        }
        return points;
    }

    private generateBoxPoints(size: number): THREE.Vector3[] {
        const points = [];
        for (let i = 0; i < this.particleNum; i++) {
            const x = (Math.random() - 0.5) * size;
            const y = (Math.random() - 0.5) * size;
            const z = (Math.random() - 0.5) * size;
            points.push(new THREE.Vector3(x, y, z));
        }
        return points;
    }

    private generateTorusPoints(radius: number): THREE.Vector3[] {
        const points = [];
        const tubeRadius = radius / 3;
        for (let i = 0; i < this.particleNum; i++) {
            const u = Math.random() * Math.PI * 2;
            const v = Math.random() * Math.PI * 2;
            const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
            const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
            const z = tubeRadius * Math.sin(v);
            points.push(new THREE.Vector3(x, y, z));
        }
        return points;
    }

    private generateCustomShapePoints(): THREE.Vector3[] {
        const points = [];
        const size = 5;
        for (let i = 0; i < this.particleNum; i++) {
            const x = size * (Math.sin(i) + Math.random() * 0.1);
            const y = size * (Math.cos(i) + Math.random() * 0.1);
            const z = (Math.random() - 0.5) * size;
            points.push(new THREE.Vector3(x, y, z));
        }
        return points;
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 20));
    document.body.appendChild(viewport);
}

