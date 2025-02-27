import * as THREE from 'three'
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js'
import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { material } from '/core/shaders/ghibli.js'
import { createSun } from '/core/light.js'

createOrbitControls()

let time = 0

const sun = createSun()
scene.add(sun)

const teapot = new THREE.Mesh(new TeapotGeometry(2), material)
scene.add(teapot)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  sun.position.set(40 * Math.cos(time), 75, 40 * Math.sin(time))
  teapot.material.uniforms.lightPosition.value = sun.position
  time += 0.01

  renderer.render(scene, camera)
}()
