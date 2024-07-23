//22FI029 小川麗



import * as CANNON from 'cannon-es';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Domino {
    mesh: THREE.Mesh;
    body: CANNON.Body;
}

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private dominos: Domino[] = [];

    constructor() { }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        const render: FrameRequestCallback = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    private createDomino = (world: CANNON.World, scene: THREE.Scene, position: CANNON.Vec3, rotation: CANNON.Quaternion) => {
        const geometry = new THREE.BoxGeometry(0.2, 1, 0.5);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const domino = new THREE.Mesh(geometry, material);

        domino.position.set(position.x, position.y, position.z);
        domino.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

        scene.add(domino);

        const dominoShape = new CANNON.Box(new CANNON.Vec3(0.1, 0.5, 0.25));
        const dominoBody = new CANNON.Body({ mass: 1 });
        dominoBody.addShape(dominoShape);

        dominoBody.position.set(position.x, position.y, position.z);
        dominoBody.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

        world.addBody(dominoBody);

        this.dominos.push({ mesh: domino, body: dominoBody });

        return { domino, dominoBody };
    }

    private createDominoCircle = (world: CANNON.World, scene: THREE.Scene, count: number, radius: number) => {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const position = new CANNON.Vec3(x, 0.5, z);
            const rotation = new CANNON.Quaternion();
            rotation.setFromEuler(0, angle, 0);
            this.createDomino(world, scene, position, rotation);
        }

        const initialRotation = new CANNON.Quaternion();
        initialRotation.setFromEuler(0, Math.PI / 2, -Math.PI / 8);
        this.dominos[0].body.quaternion.copy(initialRotation);

        const force = new CANNON.Vec3(5, 0, 0);
        this.dominos[0].body.applyLocalForce(force, new CANNON.Vec3(0, 0.5, 0));
    }

     // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();

        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
        world.defaultContactMaterial.friction = 0.3;
        world.defaultContactMaterial.restitution = 0.0;

        const phongMaterial = new THREE.MeshPhongMaterial();
        const planeGeometry = new THREE.PlaneGeometry(50, 50);
        const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = THREE.DoubleSide;
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);

        const planeShape = new CANNON.Plane();
        const planeBody = new CANNON.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        world.addBody(planeBody);

        this.createDominoCircle(world, this.scene, 40, 5);

        const gridHelper = new THREE.GridHelper(10);
        this.scene.add(gridHelper);

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
            world.fixedStep();
            this.dominos.forEach(domino => {
                domino.mesh.position.copy(domino.body.position as unknown as THREE.Vector3);
                domino.mesh.quaternion.copy(domino.body.quaternion as unknown as THREE.Quaternion);
            });
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 10, 10));
    document.body.appendChild(viewport);
}
