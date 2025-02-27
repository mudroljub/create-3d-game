import * as THREE from 'three'
import { scene, renderer, camera, createOrbitControls } from '/core/scene.js'
import { createHillyTerrain, createWater } from '/core/ground.js'
import { createTreesOnTerrain } from '/core/geometry/trees.js'
import { loadModel } from '/core/loaders.js'
import { hemLight } from '/core/light.js'

hemLight({ intensity: Math.PI * 1.2 })

const terrain = await createHillyTerrain()
scene.add(terrain)
scene.add(createWater({ size: 400 }))
scene.add(createTreesOnTerrain({ terrain, n: 100, mapSize: 400, size: 5 }))

createOrbitControls()
camera.position.y = 100

const directLight = new THREE.DirectionalLight(0xffeedd)
directLight.position.set(0, 0, 1)
scene.add(directLight)

const mesh = await loadModel({ file: 'building/castle/magic-castle.fbx', size: 50, texture: 'terrain/concrete.jpg' })
mesh.translateY(20)
scene.add(mesh)

/** FUNKCIJE **/

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
