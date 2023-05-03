import * as THREE from 'three'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/terrain/cylinder-ground.js'
import Warplane from '/utils/aircrafts/Warplane.js'
import { createTree } from '/utils/geometry/trees.js'
import { putOnSolids } from '/utils/helpers.js'

const trees = []

camera.position.set(30, 100, 50)

scene.fog = new THREE.Fog(0xE5C5AB, 200, 950)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 250, 50] }))

const r = 1500
const ground = new createGround(r)

const range = 200
// for (let i = 0; i < 20; i++)
//   addTree()

const aircraft = new Warplane()
scene.add(ground, aircraft.mesh)

/* FUNCTIONS */

function addTree() {
  const tree = createTree({ size: 10 })
  tree.position.x = Math.random() * range - range / 2
  tree.position.z = Math.random() * range - range / 2
  tree.position.y += r
  ground.add(tree)
  trees.push(tree)
}

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  if (trees.length < 20)
    addTree()

  ground.rotateX(.25 * delta)
  aircraft.update(delta)
  camera.lookAt(aircraft.mesh.position)

  renderer.render(scene, camera)
}()
