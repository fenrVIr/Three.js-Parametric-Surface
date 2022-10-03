import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { PlaneGeometry } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0x5b5e5c)

/**
 * Textures
 */
// const textureLoader = new THREE.TextureLoader()

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 1.3
camera.position.y = 0.8



// camera.position.y = 2

scene.add(camera)

// Lights\

scene.add(new THREE.AmbientLight(0xffffff, 1))

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
// directionalLight.position.x = 2
// directionalLight.position.y = 2
// directionalLight.position.z = 2
// directionalLight.castShadow = true


// scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(directionalLightHelper)

// Plane

// const planeGeometry = new THREE.PlaneGeometry(2, 2, 200, 200)
// const planeMaterial = new THREE.MeshPhongMaterial({
//     color: 0xffffff,
//     // side: THREE.DoubleSide
// })

// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// plane.receiveShadow = true
// plane.castShadow = true
// plane.rotation.x = Math.PI / 2
// plane.rotation.z = Math.PI / 7
// plane.rotation.y = Math.PI

// scene.add(plane)

// const numberOfVertices = planeGeometry.attributes.position.count

const pointLight = new THREE.PointLight(0xffffff, 0.6)
pointLight.position.set(1,1,1)
const pointLightHelper = new THREE.PointLightHelper(pointLight)
// pointLight.castShadow = true

pointLight.shadow.camera.left = 25
pointLight.shadow.camera.right = 25
pointLight.shadow.camera.top = 25
pointLight.shadow.camera.bottom = 25



// scene.add(pointLightHelper)
scene.add(pointLight)

const boxGeometry = new THREE.BoxGeometry(1,1,0.5,100,100,0)




const boxMaterial = new THREE.MeshStandardMaterial({color: 0x6f95d6})



boxGeometry.computeBoundingBox()

const colors = {
  color1: 0xff0000,
  color2: 0x7d7d7d
}

gui.addColor( colors, "color1").onChange(() => {material.uniforms.color1.value.set(colors.color1)})
gui.addColor( colors, "color2").onChange(() => {material.uniforms.color2.value.set(colors.color2)})



// folder.addColor( params, 'color' )
//       .onChange( function() { cube.material.color.set( params.color ); } );



var material = new THREE.ShaderMaterial({
    uniforms: {
      color1: {
        value: new THREE.Color(colors.color1)
      },
      color2: {
        value: new THREE.Color(colors.color2)
      },
      bboxMin: {
        value: boxGeometry.boundingBox.min
      },
      bboxMax: {
        value: boxGeometry.boundingBox.max
      }
    },
    vertexShader: `
      uniform vec3 bboxMin;
      uniform vec3 bboxMax;
    
      varying vec2 vUv;
  
      void main() {
        vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
    
      varying vec2 vUv;
      
      void main() {
        
        gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
      }
    `
  });



console.log(material.uniforms.color1)


const box = new THREE.Mesh(boxGeometry, material)
scene.add(box)

box.rotation.x = Math.PI / 2
box.rotation.z = Math.PI / 12
box.receiveShadow = true
box.castShadow = true


// console.log(boxGeometry.width)

gui.add(box.scale, "x", 0.5, 5).name("Width")
gui.add(box.scale, "y", 0.5, 5).name("Length")


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const numberOfVertices = boxGeometry.attributes.position.count
console.log(numberOfVertices)

//Math.cos(2 * i) * 0.05 * Math.sin(x * 20 + elapsedTime * 2) + 5 * Math.sin(i) * 2 * x * 0.07 * Math.cos(y * 20 + elapsedTime * 2)

const parameters = {
  amp1: 0.5,
  amp2: 0.5
}

gui.add(parameters, "amp1").min(-10).max(10).name("Amplitude 1")
gui.add(parameters, "amp2").min(-4).max(4).name("Amplitude 2")

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // for (let i = 0; i < numberOfVertices; i++) {
    //     const x = planeGeometry.attributes.position.getX(i)
    //     planeGeometry.attributes.position.setZ(i, 0.2 * Math.sin(x + elapsedTime))
    // }

    // planeGeometry.computeVertexNormals();
    // planeGeometry.attributes.position.needsUpdate = true;

    for (let i = 0; i < numberOfVertices; i++) {
        const x = boxGeometry.attributes.position.getX(i)
        const y = boxGeometry.attributes.position.getY(i)
        boxGeometry.attributes.position.setZ(i, parameters.amp1 * Math.cos(2 * i ) * 0.05 * Math.sin(x * 20 + elapsedTime * 2) +  parameters.amp2 * 5 * Math.sin(i) * 2 * x * 0.07 * Math.cos(y * 20 + elapsedTime * 2))
        
    }

    boxGeometry.attributes.position.needsUpdate = true
    boxGeometry.computeVertexNormals()

    camera.updateProjectionMatrix()

    // Update controls
    controls.update()



    

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()