//22FI029
//小川麗

import GUI from 'lil-gui';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// noisejsライブラリをインポート
import { Noise } from 'noisejs';



class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    constructor() {}

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
        let guidrop = { visible:true,object: 'Wave'}
        gui.add( guidrop, 'object', [ 'Wave', 'Klein', 'Perlin'] );
        this.scene = new THREE.Scene();
        

        //波打つ平面
        let myPlane = (u:number, v:number, target:THREE.Vector3) =>{
            let radius= 30;
            let x = u * radius - radius / 2;
            let z = v * radius - radius / 2;
            let y = Math.sin(Math.sqrt(x * x + z * z)) * 2.0;
            target.set(x, y, z);
        }
        let ParametricGeometry1 = new THREE.ParametricGeometry(myPlane, 30, 30);


        //球の作成
        let mySphere = (u: number, v: number, target: THREE.Vector3) => {
            u=u*2*Math.PI;
            v=v*2*Math.PI;
            let r = 4- 2* Math.cos(u);
            let x1=0;
            let y1=0;
                if(u>=0&&u<Math.PI){
                    x1=6* Math.cos(u)*(1+ Math.sin(u))+r*Math.cos(u)* Math.cos(v);
                    y1=16* Math.sin(u)+r*Math.sin(u)* Math.cos(v);
                }
                else if (u>=Math.PI&&u<=2*Math.PI){
                    x1=6* Math.cos(u)*(1+ Math.sin(u))+r*Math.cos(v+Math.PI);
                    y1=16*Math.sin(u)
                }
            let z1 = r * Math.sin(v);
            target.set(x1, y1, z1);
        }
        let ParametricGeometry = new THREE.ParametricGeometry(mySphere, 30, 30);





        //ノイズの生成
        let noise = new Noise(Math.random());
        // Perlinノイズに基づく高さを計算する関数
        const perlinHeight = (x, z) => {
            // パラメータは調整可能
            return noise.perlin2(x / 10, z / 10) * 6; // 高さの範囲は調整可能
        }
        let myPlane1 = (u:number, v:number, target:THREE.Vector3) =>{
            let r = 40;
            let x = u * r - r/2;
            let z = v * r - r/2;
            let y = perlinHeight(x, z);
            
            target.set(x, y, z);
        }

        let paramGeometry2 = new THREE.ParametricGeometry(myPlane1, 30, 30);
        
        
        

        
        let paramMaterial = new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide,flatShading:true});
        let lineMaterial  = new THREE.LineBasicMaterial({color: 0xffffff,transparent:true, opacity:0.5});


        let group1 = new THREE.Group();
        group1.add(new THREE.Mesh(ParametricGeometry1,paramMaterial));
        group1.add(new THREE.LineSegments(ParametricGeometry1,lineMaterial));

        let group = new THREE.Group();
        group.add(new THREE.Mesh(ParametricGeometry,paramMaterial));
        group.add(new THREE.LineSegments(ParametricGeometry,lineMaterial));

        let group2 = new THREE.Group();
        group2.add(new THREE.Mesh(paramGeometry2,paramMaterial));
        group2.add(new THREE.LineSegments(paramGeometry2,lineMaterial));

        this.scene.add(group1);
        this.scene.add(group);
        this.scene.add(group2);

        

    
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新  'Wave', 'Klein', 'Perlin'
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
             //ドロップダウンリストで表示
            switch( guidrop.object){
                case 'Wave':
                    group1.visible=true;
                    group.visible=false;
                    group2.visible=false;
                    break;

                case 'Klein':
                    group.visible=true;
                    group1.visible=false;
                    group2.visible=false;
                    break;
                
                case 'Perlin':
                    group2.visible=true;
                    group.visible=false;
                    group1.visible=false;
                    break;
                
                
                    

                    


            }


            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-15,15,15));
    document.body.appendChild(viewport);
}
