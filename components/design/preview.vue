<template>
	<div class="preivew" id="preivew" ref="preivew">
		<div class="close-btn" @click="close"></div>
		
		 <model-obj 
			v-if="size.ok"
			:position="position"
			:rotation="rotation"
			:width="size.width"
			:height="size.height"
			@on-load="onLoad" 
			:lights="light"
			:src="options.src" 
			:mtl="options.mtl" 
			
			backgroundColor="#00c1de"
		 ></model-obj>
		<!-- <model-stl 
			:src="options.stl"
			backgroundColor="#00c1de"
		></model-stl> -->
		<!-- <model-collada 
			:width="size.width"
			:height="size.height"
			:src="options.dae"
		></model-collada> -->
		<!-- <div id="container" ref="box"></div>#00c1de #f06-->
		<!-- <div id="canvas" ref="canvas" @mousewheel="setWheel"></div> -->
	</div>
</template>


<script>
import * as THREE from 'three'
import {OrbitControls} from "@/assets/controls/OrbitControls.js";

import { ModelThree, ModelObj, ModelStl, ModelCollada } from 'vue-3d-model' 
export default {
	components: { ModelThree, ModelObj, ModelStl, ModelCollada },
	props: {
		list: {
			type: Array,
			default: []
		}
	},
	data () {
		return {
			json: ``,
			scene: null, // 场景: 需要展示的物品(材料)
			camera: null, // 相机: 保存物品的各种属性
			renderer: null, // 渲染器: 展示的画布
			mesh: null,
			fov: 3, // 视野角度: 越大看到越小,反之越大
			arr: [], // 存放所有元素

			scene: null, 
			camera: null, 
			light: null, 
			renderer: null,
    		cup: null,
			cupBodyGeometry: null, 
			cupBodyMaterials: [], 
			cupBodyMaterial: null,  
			cupBodyMaterialTexture: null, 
			cupBodyMesh: null,
			cupTop: null, 
			cupTopGeometry: null, 
			cupTopMaterial: null,
			logoGeometry: null, 
			logoMaterial: null, 
			logoMesh: null,
			logoFaceArray: null,
			logoImage: null,
			dotsImage: null,
			options: {
				dae: 'http://localhost:5050/obj/elf.dae',
				stl: 'http://localhost:5050/obj/file.stl',
				src: 'http://localhost:5050/obj/box.obj',
				mtl: 'http://localhost:5050/obj/box.mtl'
			},
			size: { // 大小
				width: 0,
				height: 0,
				ok: false
			},
			light: [
                    {
                        type: 'HemisphereLight',
                        position: { x: 0, y: 0, z: 0 },
                        skyColor: 0xaaaaff,
                        groundColor: 0x806060,
                        intensity: .8
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: 1, y: 1, z: 1 },
                        color: 0xffffff,
                        intensity: 0.8
                    }
			],
			position: { // 位置
				x: 0, y: 0, z: 0
			},
			rotation: { // 各轴旋转
                x: 0,
                y: 0,
                z: 0
			},
			intersected: null, // 引用
			parentElem: null, // 父元素
		}
	},
	methods: {
		close () { // 关闭
			this.$emit('setPreview')
		},
		setSize() { // 设置大小
			this.parentElem = this.$refs.preivew
			this.size.width = this.parentElem.offsetWidth
			this.size.height = 700
			this.size.ok = true
			
		},
		rotate () { // 旋转
				this.rotation.y += 0.01;
				requestAnimationFrame( this.rotate );
		},
		onLoad(e) { // 加载完
			
			// this.rotate()
		},
		onMouseMove(event) { // 鼠标
			 if ( !event ) {

                        if ( this.intersected ) {
							this.intersected.material.color.setStyle( 'red' );
							// this.intersected.material.map.
                        }

                        this.intersected = null;
                        return;
                    }

                    this.intersected = event.object;
                    this.intersected.material.color.setStyle( 'red' );
		},
		setWheel(e) { // 设置相机FOV: 视野角度 ,越大看到越小,反之越大
			if (e.wheelDelta < 0) {
				this.fov++
			} else {
				this.fov--
			}
			if (this.fov <= 2) this.fov = 3
			this.camera.position.set(0, 0, this.fov)
			this.animate()
		},
		init() {
			this.logoFaceArray = [
					0, 1, 2, 3, 4, 5, 6, 7, 24, 25, 26, 27, 28, 29, 30, 31
					, 48, 49, 50, 51, 52, 53, 54, 55, 72, 73, 74, 75, 76, 77, 78, 79
					, 96, 97, 98, 99, 100, 101, 102, 103, 120, 121, 122, 123, 124, 125, 126, 127
				];

			this.logoImage = new Image();

			this.dotsImage = new Image();
		},
		generateGeometry(parent, faces) {
			var returnFaces = [],
				returnVertices = [],
				cloneControl = {},
				counter = 0;

			for (var i = 0; i < faces.length; i++) {
				var fA, fB, fC,
					vA = parent.faces[faces[i]].a,
					vB = parent.faces[faces[i]].b,
					vC = parent.faces[faces[i]].c;

				if (cloneControl[vA] != undefined) {
					fA = cloneControl[vA];
				} else {
					returnVertices.push(parent.vertices[vA]);
					cloneControl[vA] = fA = counter;
					counter++;
				}
				if (cloneControl[vB] != undefined) {
					fB = cloneControl[vB];
				} else {
					returnVertices.push(parent.vertices[vB]);
					cloneControl[vB] = fB = counter;
					counter++;
				}
				if (cloneControl[vC] != undefined) {
					fC = cloneControl[vC];
				} else {
					returnVertices.push(parent.vertices[vC]);
					cloneControl[vC] = fC = counter;
					counter++;
				}
				returnFaces.push(new THREE.Face3(fA, fB, fC));
			}
			return {faces: returnFaces, vertices: returnVertices};
		},
		initSchene(){
			/** Schene */
			let div = this.$refs.box
			this.scene = new THREE.Scene();
			let w = div.offsetWidth,
				h = div.offsetHeight;

			/** Renderer */
			this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			preserveDrawingBuffer: false,
			alpha: true
			});
			this.renderer.setClearColor(0xffffff, 0);

			// this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.setSize(w, h);
			document.getElementById('container').appendChild(this.renderer.domElement);
		
			/** Camera */
			this.camera = new THREE.PerspectiveCamera(40, w / h, 1, 100);
			this.camera.position.set(-0.00, 2, 5.2);
			this.camera.rotation.set(0.50, 0, 0);

			/** Light */
			this.light = new THREE.DirectionalLight(0xffffff, 0.5);
			this.light.position.set(1, 5, 7.5);
			this.scene.add(this.light);
		},
		renderCup(){
  
			this.cup = new THREE.Object3D();
			this.cup.name = "cup";
		
			/*****************************************************
			*   BODY                                            *
			*****************************************************/

			this.cupBodyGeometry = new THREE.CylinderGeometry(1.27, 1, 2.4, 64, 12, true);
			var loader2 = new THREE.TextureLoader();
			loader2.crossOrigin = '*';
		
			var dotsTexture = THREE.ImageUtils.loadTexture( this.dotsImage.src );

			dotsTexture.wrapS = THREE.RepeatWrapping;
			dotsTexture.wrapT = THREE.RepeatWrapping;
			dotsTexture.repeat.set(1, 1); // 平铺比例 (x,y)
			dotsTexture.name = 'cupBodyTexture';

			this.cupBodyMaterial = new THREE.MeshBasicMaterial({
				color: 0xFFFFFF,
				side: THREE.DoubleSide,
				overdraw: 0.5
			});
			this.cupBodyMaterial.name = "cupBodyMaterial";

			this.cupBodyMaterialTexture = new THREE.MeshBasicMaterial({
				map: dotsTexture,
				transparent: true,
				overdraw: true
			});
			this.cupBodyMaterialTexture.name = "cupBodyTexture";

			this.cupBodyMaterials.push(this.cupBodyMaterial);
			this.cupBodyMaterials.push(this.cupBodyMaterialTexture);

			this.cupBodyMaterial.vertexColors = THREE.FaceColors;
			this.cupBodyGeometry.computeFaceNormals();
			// THREE.SceneUtils = SceneUtils
			this.cupBodyMesh = THREE.SceneUtils.createMultiMaterialObject(this.cupBodyGeometry, this.cupBodyMaterials);
			this.cupBodyMesh.name = 'cupBody';
			this.cup.add(this.cupBodyMesh);

			/*****************************************************
			*   LOGO                                            *
			*****************************************************/
			var loader = new THREE.TextureLoader();
			loader.crossOrigin = '*';
			var logoTexture =  THREE.ImageUtils.loadTexture( this.logoImage.src );
		
			logoTexture.wrapS = THREE.ClampToEdgeWrapping;
			logoTexture.wrapT = THREE.ClampToEdgeWrapping;
			logoTexture.repeat.set(.5, .5);
			logoTexture.name = 'logo';

			this.logoMaterial = new THREE.MeshBasicMaterial({map: logoTexture, transparent: true, overdraw: true});
			this.logoGeometry = new THREE.Geometry();

			var logoGeometryData = this.generateGeometry(this.cupBodyGeometry, this.logoFaceArray);
			this.logoGeometry.faces = logoGeometryData.faces;
			this.logoGeometry.vertices = logoGeometryData.vertices;

			this.logoGeometry.computeFaceNormals();
			this.logoGeometry.computeVertexNormals();

			this.logoGeometry.computeBoundingBox();
			var max = this.logoGeometry.boundingBox.max,
				min = this.logoGeometry.boundingBox.min;

			var offsetX = (0 - min.x);
			var offsetY = (0 - min.y);
			var range = new THREE.Vector2(Math.atan(max.x / max.z) - Math.atan(min.x / min.z), max.y - min.y);

			var rangeX = range.x + 0.07; 
			var rangeY = max.y - min.y;

			this.logoGeometry.faceVertexUvs[0] = [];
			for (var i = 0; i < this.logoGeometry.faces.length; i++) {

				var v1 = this.logoGeometry.vertices[this.logoGeometry.faces[i].a],
					v2 = this.logoGeometry.vertices[this.logoGeometry.faces[i].b],
					v3 = this.logoGeometry.vertices[this.logoGeometry.faces[i].c];

				this.logoGeometry.faceVertexUvs[0].push([
					new THREE.Vector2((Math.atan(v1.x / v1.z) + offsetX) / rangeX, (v1.y + offsetY) / rangeY),
					new THREE.Vector2((Math.atan(v2.x / v2.z) + offsetX) / rangeX, (v2.y + offsetY) / rangeY),
					new THREE.Vector2((Math.atan(v3.x / v3.z) + offsetX) / rangeX, (v3.y + offsetY) / rangeY)
				]);
			}

			this.logoGeometry.uvsNeedUpdate = true;

			this.logoMesh = new THREE.Mesh(this.logoGeometry, this.logoMaterial);
			this.logoMesh.overdraw = true;
			this.logoMesh.name = "cupLogo";
			// this.cup.add(this.logoMesh); // 添加LOGO


			/*****************************************************
			 *   TOP                                             *
			 *****************************************************/

			this.cupTopGeometry = new THREE.TorusGeometry(1.29, .06, .16, 62);
			this.cupTopMaterial = new THREE.MeshStandardMaterial({
				color: 0xFFFFFF,
				roughness: 0.50,
				metalness: 0.50,
				emissive: 0xC4C4C4,
				overdraw: true
			});

			this.cupTop = new THREE.Mesh(this.cupTopGeometry, this.cupTopMaterial);
			this.cupTop.name = 'cupTop';
			this.cupTop.position.set(0, 1.25, 0);
			this.cupTop.rotation.x = Math.PI / 2;

			this.cup.add(this.cupTop);

			this.camera.lookAt(this.cup.position);
			this.scene.add(this.cup);

		},
		render() {
			requestAnimationFrame(this.render);
			this.cup.rotation.y += 0.01;
			// this.cup.rotation.x += 0.01;
				
			this.renderer.render(this.scene, this.camera);
		},
		// init: function() {
			// 	let container = document.getElementById('container');
		
			// 	this.camera = new THREE.PerspectiveCamera(30, container.clientWidth/container.clientHeight, 0.01, 10);
			// 	this.camera.position.z = 1;
		
			// 	this.scene = new THREE.Scene();
		
			// 	let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
			// 	let material = new THREE.MeshNormalMaterial();
		
			// 	this.mesh = new THREE.Mesh(geometry, material);
			// 	this.scene.add(this.mesh);
		
			// 	this.renderer = new THREE.WebGLRenderer({antialias: true});
			// 	this.renderer.setSize(container.clientWidth, container.clientHeight);
			// 	container.appendChild(this.renderer.domElement);
		
			// },
		animate: function() { // 渲染
			// requestAnimationFrame(this.animate);
			// this.mesh.rotation.x += 0.01;
			// this.mesh.rotation.y += 0.02;
			// this.arr.forEach(item => {
			// 	item.rotation.x += 0.01;
			// 	item.rotation.y += 0.02;
			// })
			this.renderer.render(this.scene, this.camera);
		},
		myInit () { // 初始化three 三元素
			// console.log(THREE)
			let canvas = this.$refs.canvas;
			this.scene = new THREE.Scene(); // 创建场景
			this.camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000) // 透视摄像机 创建相机

		

			this.camera.position.z = 5;

			this.renderer = new THREE.WebGLRenderer() // 创建选软器
			// console.log(this.renderer)
			this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight) // 设置渲染器的大小
			canvas.appendChild(this.renderer.domElement)
			var controls = new OrbitControls( this.camera, this.renderer.domElement )
			// controls.type = 'orbit';
		},
		setGoods() {
			var obj = new THREE.Object3D();

			

			// let geometry2 = new THREE.BoxGeometry( 1, 3, 2), // 几何立方体对象 包括顶点(vertices),面(faces)
			// 	material2 = new THREE.MeshBasicMaterial({color: 'rgb(255,255,255)'}); // 材质设置
			
			// let mesh = new THREE.Mesh(geometry2, material2) // 创建网格并将立方体加入网格
			// mesh.rotation.x = 10;
			// mesh.rotation.y = 10;
			// this.arr.push(mesh)
			// this.scene.add(mesh) // 将网格添加到场景
			// // console.log(THREE.GLTFLoader())

			// var geometry3 = new THREE.BoxBufferGeometry( 1, 1, 1 );
			// var material3 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
			// var cube = new THREE.Mesh( geometry3, material3 );
			// this.arr.push(cube)
			// this.scene.add( cube );

			// var geometry4 = new THREE.TorusGeometry( 2, 0.3, 100, 200 );
			// var material4 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
			// var torus = new THREE.Mesh( geometry4, material4 );
			

			// this.arr.push(torus)
			// this.scene.add( torus );
			var material = new THREE.MeshBasicMaterial({
                color: 'blue',
                wireframe: true
             });
			var yuan = new THREE.Mesh(new THREE.TorusGeometry(1.29, 0.1, 30, 100), material);
				yuan.rotation.x = 1.5
				yuan.position.y = 1.2
				obj.add(yuan )
            var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.27, 1, 2.4, 64, 12), material);
			obj.add(cylinder)

			this.arr.push(obj)
			this.scene.add(obj);
		},
		
	},
	mounted() {
		// this.init();
		// this.initSchene();
		// this.renderCup();
		// this.render();


		// this.myInit()
		// this.setGoods()
		// this.animate()
		console.log(this.list)
		this.setSize()
	}
}
</script>

<style lang="scss" scoped>
.preivew {
	position: relative;
	cursor: pointer;
}

.close-btn {
	position: absolute;
	right: -50px;
	top: -65px;
	width: 24px;
	height: 24px;
	transform: rotate(45deg);
	cursor: pointer;
	&::before {
		content: '';
		position: absolute;
		top:50%;
		width: 24px;
		height: 2px;
		border-radius: 2px;
		background: #fff;
		transform: rotate(90deg);
	}
	&::after {
		content: '';
		position: absolute;
		top:50%;
		width: 24px;
		height: 2px;
		border-radius: 2px;
		background: #fff;
	}
}
</style>

