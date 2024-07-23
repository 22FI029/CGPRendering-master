import GUI from 'lil-gui';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private geometry: THREE.BufferGeometry;
    private material: THREE.Material;
    private cube: THREE.Mesh;
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
        camera.lookAt(new THREE.Vector3(0, 0, 0));

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
        let gui = new GUI(); // GUI用のインスタンスの生成


        //let guiObj = { rotationSpeedX: 0.05} // GUIのパラメータ
       // gui.add(guiObj, "rotationSpeedX", 0.0, 0.2); //GUIの設定
    

       // 回転速度のGUI設定
        let guiObj = { rotationSpeedX: 0.05, rotationSpeedY: 0.05};
        gui.add(guiObj, "rotationSpeedX", 0.0, 0.2);
        gui.add(guiObj, "rotationSpeedY", 0.0, 0.2);
        
        // 色のGUI設定
        let guicolor = { color: '0xffffff'};
        gui.addColor(guicolor, "color");
        
        // チェックボックスのGUI設定
        let guicheck = { visible: true};
        gui.add(guicheck, "visible");

        // ドロップダウンリストのGUI設定
        let guitop = { size: 'Medium'}
        gui.add( guitop, 'size', [ 'Small', 'Medium', 'Large' ] )













        this.scene = new THREE.Scene();

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshLambertMaterial({ color: 0x55ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.castShadow = true;
        this.scene.add(this.cube);

        //ライトの設定
        // 色のGUI設定
        let guicolorlight = { color: '0xffffff'};
        gui.addColor(guicolorlight, "color");
            
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
            this.cube.rotateX(guiObj.rotationSpeedX);//guiで回転させる
            this.cube.rotateY(guiObj.rotationSpeedY);//guiで回転させる

            //ライトの色
            this.light.color.set(guicolorlight.color);

            //チェックボックスで表示
            this.cube.visible=(guicheck.visible);

            //立方体の大きさをドロップダウンリストで表示
            if(guitop.size=="Small"){
                this.cube.scale.set(0.5,0.5,0.5);
            }
            else if(guitop.size=="Medium"){
                this.cube.scale.set(1,1,1);
            }else{
                this.cube.scale.set(1.6,1.6,1.6);
            }
        
            
            

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-3, 3, 3));
    document.body.appendChild(viewport);
}
