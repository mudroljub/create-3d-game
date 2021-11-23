import * as THREE from '/node_modules/three/build/three.module.js'
import { scene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'
import {createTerrain} from '/utils/floor.js'

const controls = createOrbitControls()
controls.minDistance = 5
const loader = new ColladaLoader()

const terrain = createTerrain()
scene.add(terrain)
scene.background = new THREE.Color(0xe0f0ff)

const camPos = new THREE.Vector3(0, 80, 40)
const targetPos = controls.target = new THREE.Vector3(100, 50, -50)

loader.load('/assets/models/s-e-5a/model.dae', collada => {
  const {scene: model} = collada
  model.position.copy(targetPos)
  controls.target = model.position
  scene.add(model)
})

void function animate() {
  requestAnimationFrame(animate)
  controls.update()

  // interpolate camera toward target
  if (camPos.distanceTo(controls.target) > controls.minDistance * 2) {
    camPos.lerp(controls.target, 0.05)
    camera.position.copy(camPos)
  }

  renderer.render(scene, camera)
}()
