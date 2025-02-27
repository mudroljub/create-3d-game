import { scene, camera, renderer } from '/core/scene.js'
import { hemLight } from '/core/light.js'
import { Snow } from '/core/Particles.js'

hemLight()
renderer.setClearColor(0x000000)

const particles = new Snow({ num: 10000, size: 7, minRadius: 50, maxRadius: 500 })
scene.add(particles.mesh)

/* LOOP */

void function loop() {
  particles.update({ rotateY: .007, min: -100, max: 100, minVelocity: 50, maxVelocity: 150 })
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()
