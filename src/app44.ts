//22FI029
//小川麗
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0,0,0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);

    let n=Math.random() * 2 - 1
        // 花を作成
        for (let i = 0; i < 5; i++) {
            let horn = this.createHorn();
            horn.position.set(n, 0, n);
            horn.rotation.set(Math.random() * Math.PI / 4, Math.random() * Math.PI / 4, Math.random() * Math.PI / 4);
            this.scene.add(horn);
        }

        // 茎を作成
        
            let stem = this.createStem();
            stem.position.set(n, 0, n);
            this.scene.add(stem);
            
        // 植木鉢を作成
        let planter = this.createPlanter();
        planter.position.set(n, -6, n); // 植木鉢の位置を調整
        this.scene.add(planter);
        
    }

    // LatheGeometryを用いてホーン形状を作成
    private createHorn = (): THREE.Mesh => {
        let points = [];
        let c = 0.5;
        for (let i = 0; i < 20; i++) {
            let x = i * 0.25;
            let y = Math.exp(c * x) * 0.2; // 係数で形を調整
            points.push(new THREE.Vector2(y, x));
        }

        let geometry = new THREE.LatheGeometry(points, 8);
        let material = new THREE.MeshPhongMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        return new THREE.Mesh(geometry, material);
    }

    // ExtrudeGeometryを用いて茎形状を作成
    private createStem = (): THREE.Mesh => {
        let shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, -8);
        shape.lineTo(0.2, -8);
        shape.lineTo(0.2, 0.2);
        shape.lineTo(0.2, 0);

        let extrudeSettings = {
            steps: 1,
            depth: 0.1,
            bevelEnabled: false
        };

        let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        let material = new THREE.MeshPhongMaterial({ color: 0x228B22 });
        return new THREE.Mesh(geometry, material);
    }

        // ExtrudeGeometryを用いて植木鉢を作成
    private createPlanter = (): THREE.Mesh => {
        let shape = new THREE.Shape();
        shape.moveTo(-2, -2);
        shape.lineTo(2, -2);
        shape.lineTo(2, 0);
        shape.lineTo(1.5, 0);
        shape.lineTo(1.5, -1.5);
        shape.lineTo(-1.5, -1.5);
        shape.lineTo(-1.5, 0);
        shape.lineTo(-2, 0);
        shape.lineTo(-2, -2);

        let extrudeSettings = {
            steps: 1,
            depth: 2, // 植木鉢の高さを2に設定
            bevelEnabled: false
        };

        let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        let material = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        return new THREE.Mesh(geometry, material);
    
    
    


        
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-5, 3, 14));
    document.body.appendChild(viewport);
}
