import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { ZombieCopPlayer } from '/utils/actor/derived/horror/ZombieCop.js'
import GUI from '/utils/io/GUI.js'

createOrbitControls()

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new ZombieCopPlayer()
scene.add(player.mesh)

new GUI({ scoreTitle: '', actions: player.actions })

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
