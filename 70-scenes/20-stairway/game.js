import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSpiralStairs } from '/utils/boxes.js'
import { createGround } from '/utils/ground/index.js'
import { PlayerModel, Dupechesh, Ratamahatta, Robotko, Girl, GirlFighter } from '/classes/index.js'

camera.position.z = 40
camera.position.y = 20

const floor = createGround({ file: 'ground.jpg' })
scene.add(floor)
const stairs = createSpiralStairs(5, 40, 40)
scene.add(stairs)

const player = new PlayerModel(100, 50, -50, 20, mesh => {
  mesh.rotateY(Math.PI)
  mesh.add(camera)
  scene.add(mesh)
}, GirlFighter)

player.addSolids(floor, stairs)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
