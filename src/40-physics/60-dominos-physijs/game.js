import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = './ammo.js'
import { renderer, camera, createOrbitControls } from '/utils/scene.js'
import { initLights } from '/utils/light.js'
import { DEGREE } from '/utils/constants.js'

const blocks = []
const numDominos = 1000

const scene = new Physijs.Scene
scene.setGravity(new THREE.Vector3(0, -50, 0))

createOrbitControls()
camera.position.set(10, 10, 50)
initLights({ scene })

createGround()
addBlocks()

/* FUNCTIONS */

function addBlocks() {
  const colors = [0x000000, 0xffffff]
  const r = 27
  let circleOffset = 0
  let j = 0
  for (let i = 0; i < numDominos; i += 6 + circleOffset) {
    circleOffset = 4.5 * (i / 360)
    const x = (r / 1440) * (1440 - i) * Math.cos(i * DEGREE)
    const z = (r / 1440) * (1440 - i) * Math.sin(i * DEGREE)
    const y = 0
    const color = colors[++j % colors.length]
    const blockGeom = new THREE.BoxGeometry(1, 6, 2)
    const block = new Physijs.BoxMesh(blockGeom, Physijs.createMaterial(new THREE.MeshStandardMaterial({
      color
    })))
    block.position.set(x, y, z)
    block.lookAt(scene.position)
    block.position.y = 3.5
    blocks.push(block)
    scene.add(block)
  }
}

function createGround() {
  const loader = new THREE.TextureLoader()
  const ground_material = Physijs.createMaterial(
    new THREE.MeshStandardMaterial({
      map: loader.load('/assets/textures/wood_1024x1024.png')
    }),
    .9, .3)
  const ground = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 60), ground_material, 0)
  scene.add(ground)
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  scene.simulate()
}()

/* EVENTS */

window.addEventListener('dblclick', () => {
  blocks[0].rotation.x = 0.4 // first block to fall
  blocks[0].__dirtyRotation = true
})
