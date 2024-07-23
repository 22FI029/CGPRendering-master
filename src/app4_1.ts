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
        this.scene = new THREE.Scene();
        
        let points = [];
        let c=0.45;
        for (let i = 0; i < 20; i++) {
            let x = i * 0.25;
            let y = Math.exp(c*x) * 0.2; // 係数で形を調整
            points.push(new THREE.Vector2(y, x));
        }

        let geometry = new THREE.LatheGeometry(points, 8);
        let material = new THREE.MeshPhongMaterial({ color: 0x00ff00,side: THREE.DoubleSide });
        let horn = new THREE.Mesh(geometry, material);
        this.scene.add(horn);


        let sphereGeometry = new THREE.SphereGeometry(0.025);
        let redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000});
        for(let i = 0; i < points.length; ++i) {
        let mesh = new THREE.Mesh(sphereGeometry, redMaterial);
        mesh.position.set(points[i].x, points[i].y, 0);
        this.scene.add(mesh);
    }


/*
        let drawShape = ()=> {
            // THREE.Shapeを作成
            let shape = new THREE.Shape();
        
            // 形状を定義
            shape.moveTo(1, 1);
            shape.lineTo(1, -1);
            shape.quadraticCurveTo(0, -2, -1, -1);
            shape.lineTo(-1, 1);
            let hole = new THREE.Path();
        hole.absellipse(0, 0, 0.25, 0.25, 0, Math.PI * 2, false, 0);
        shape.holes.push(hole);


            return shape;
        }
        
        let extrudeSettings = {
            steps: 2,
            depth: 4,
            bevelEnabled: false,
            bevelThickness: 4,
            bevelSize: 2,
            bevelSegments: 3
        };
        
        


        //let shapeGeometry = new THREE.ShapeGeometry(drawShape());
        let shapeGeometry = new THREE.ExtrudeGeometry(drawShape(), extrudeSettings)
        
        //let lineMaterial  = new THREE.LineBasicMaterial({color: 0xffffff, transparent:true, opacity:0.5})
        //let meshMaterial = new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide,flatShading:true});

        let lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff, transparent:true, opacity:0.5});
        let meshMaterial = new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide,flatShading:true});
        /*
        let group = new THREE.Group();
        group.add(new THREE.Mesh(shapeGeometry,meshMaterial));
        group.add(new THREE.LineSegments(shapeGeometry,lineMaterial));
        


        let mesh = new THREE.Mesh(shapeGeometry,meshMaterial);
        let line = new THREE.Line(shapeGeometry,lineMaterial);
        let group = new THREE.Group();
        group.add(mesh);
        group.add(line);





        this.scene.add(group);
        */


    



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
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 3));
    document.body.appendChild(viewport);
}
