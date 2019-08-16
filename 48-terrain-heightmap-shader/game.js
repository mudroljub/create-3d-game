import {scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import { createWater } from '../utils/three-helpers.js'
import texturedFromHeightmap from '../utils/texturedFromHeightmap.js'

createOrbitControls()
camera.position.y = 150

scene.add(texturedFromHeightmap('../assets/heightmaps/stemkoski.png'))
scene.add(createWater(1000, 0.60, 'water512.jpg'))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
