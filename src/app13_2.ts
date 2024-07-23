// 小川麗
// 22FI029
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const degToRad = (degrees: number) => degrees * (Math.PI / 180);

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private world: CANNON.World;
    private vehicle: CANNON.RigidVehicle;
    private boxMesh: THREE.Mesh;
    private wheelMeshes: THREE.Mesh[] = [];
    private engineForce = 0;
    private steeringValue = 0;

    constructor() { }

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
            this.updatePhysics();
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

        const gridHelper = new THREE.GridHelper(10);
        this.scene.add(gridHelper);

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.defaultContactMaterial.restitution = 0.8;
        this.world.defaultContactMaterial.friction = 0.03;

        const groundBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(groundBody);

        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        this.scene.add(groundMesh);

        const carBody = new CANNON.Body({ mass: 5 });
        const carBodyShape = new CANNON.Box(new CANNON.Vec3(4, 0.5, 2));
        carBody.addShape(carBodyShape);
        carBody.position.y = 1;

        this.vehicle = new CANNON.RigidVehicle({
            chassisBody: carBody
        });

        this.vehicle.addToWorld(this.world);

        const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
        const boxMaterial = new THREE.MeshNormalMaterial();
        this.boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(this.boxMesh);

        this.createWheel(new CANNON.Vec3(-2, 0, 2.5)); // 左前輪
        this.createWheel(new CANNON.Vec3(2, 0, 2.5));  // 右前輪
        this.createWheel(new CANNON.Vec3(-2, 0, -2.5)); // 左後輪
        this.createWheel(new CANNON.Vec3(2, 0, -2.5));  // 右後輪

        this.setupKeyControls();
    }

    private createWheel(position: CANNON.Vec3) {
        const wheelShape = new CANNON.Sphere(1);
        const wheelBody = new CANNON.Body({ mass: 1 });
        wheelBody.addShape(wheelShape);
        wheelBody.angularDamping = 0.4;

        this.vehicle.addWheel({
            body: wheelBody,
            position: position
        });

        const wheelGeometry = new THREE.SphereGeometry(1);
        const wheelMaterial = new THREE.MeshNormalMaterial();
        const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(wheelMesh);
        this.wheelMeshes.push(wheelMesh);
    }

    private updatePhysics = () => {
        this.world.step(1 / 60);

        this.boxMesh.position.set(
            this.vehicle.chassisBody.position.x,
            this.vehicle.chassisBody.position.y,
            this.vehicle.chassisBody.position.z
        );
        this.boxMesh.quaternion.set(
            this.vehicle.chassisBody.quaternion.x,
            this.vehicle.chassisBody.quaternion.y,
            this.vehicle.chassisBody.quaternion.z,
            this.vehicle.chassisBody.quaternion.w
        );

        this.wheelMeshes.forEach((mesh, index) => {
            const wheelBody = this.vehicle.wheelBodies[index];
            mesh.position.set(wheelBody.position.x, wheelBody.position.y, wheelBody.position.z);
            mesh.quaternion.set(wheelBody.quaternion.x, wheelBody.quaternion.y, wheelBody.quaternion.z, wheelBody.quaternion.w);
        });

        // Apply engine force and steering value
        this.vehicle.setWheelForce(this.engineForce, 0);
        this.vehicle.setWheelForce(this.engineForce, 1);
        this.vehicle.setSteeringValue(this.steeringValue, 0);
        this.vehicle.setSteeringValue(this.steeringValue, 1);
    }

    private setupKeyControls = () => {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.engineForce = 1000;
                    break;
                case 'ArrowDown':
                    this.engineForce = -1000;
                    break;
                case 'ArrowLeft':
                    this.steeringValue = degToRad(30);
                    break;
                case 'ArrowRight':
                    this.steeringValue = degToRad(-30);
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    this.engineForce = 0;
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.steeringValue = 0;
                    break;
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}
