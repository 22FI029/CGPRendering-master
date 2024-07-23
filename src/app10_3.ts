//22FI029 小川麗
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class TwoTexturesContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private clouds: THREE.Points[];
    private particleVelocity: THREE.Vector3[];
    private particleCount: number;
    private clock: THREE.Clock;
    private textures: THREE.Texture[];

    constructor() {
        this.particleCount = 5000;
        this.clock = new THREE.Clock();
        this.textures = [];
    }

    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.shadowMap.enabled = true;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 15);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        const render: FrameRequestCallback = (time) => {
            orbitControls.update();
            this.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    private createScene = () => {
        this.scene = new THREE.Scene();
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('thumbnail_被写体.png');
        const texture1 = textureLoader.load('thumbnail_被写体 (2).png');
        this.textures.push(texture, texture1);

        let createParticles = () => {
            this.clouds = [];

            for (let j = 0; j < 2; j++) {
                const geometry = new THREE.BufferGeometry();
                const material = new THREE.PointsMaterial({
                    size: 0.1,
                    map: this.textures[j],
                    blending: THREE.AdditiveBlending,
                    color: 0xffffff,
                    depthWrite: false,
                    transparent: true,
                    opacity: 0.5
                });

                const positions = new Float32Array(this.particleCount * 3);
                this.particleVelocity = [];

                for (let i = 0; i < this.particleCount; i++) {
                    positions[i * 3] = (Math.random() * 20) - 10;
                    positions[i * 3 + 1] = Math.random() * 20;
                    positions[i * 3 + 2] = (Math.random() * 20) - 10;
                    this.particleVelocity.push(new THREE.Vector3(0, -Math.random() * 0.2 - 0.1, 0));
                }

                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                const cloud = new THREE.Points(geometry, material);
                this.clouds.push(cloud);
                this.scene.add(cloud);
            }
        }

        createParticles();

        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    }

    private update = () => {
        const deltaTime = this.clock.getDelta();

        for (let j = 0; j < this.clouds.length; j++) {
            const geom = <THREE.BufferGeometry>this.clouds[j].geometry;
            const positions = geom.getAttribute('position');

            for (let i = 0; i < this.particleVelocity.length; i++) {
                let y = positions.getY(i) + this.particleVelocity[i].y * deltaTime * 10;

                if (y < -10) {
                    y = 10;
                }
                positions.setY(i, y);
            }

            positions.needsUpdate = true;
        }
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new TwoTexturesContainer();
    let viewport = container.createRendererDOM(800, 600, new THREE.Vector3(0, 0, 20));
    document.body.appendChild(viewport);
}
