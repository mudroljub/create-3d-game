import { scene, camera, renderer, clock, setBackground } from '/utils/scene.js'
import { createMoon } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createBox } from '/utils/geometry.js'
import Lander from './Lander.js'
import { Stars } from '/utils/classes/Particles.js'

const stats = document.getElementById('stats')

/* CLASSES */

class Platform {
  #step = 2

  constructor() {
    this.range = 30
    this.mesh = createBox({ width: 5, height: 1, depth: 2.5 })
    this.mesh.position.y = -10
  }

  get step() {
    let step = this.#step
    if (this.mesh.position.x >= this.range) step = -step
    if (this.mesh.position.x <= -this.range) step = step
    if (Math.random() > .997) step = -step
    return step
  }

  move(dt, lander) {
    const { step } = this
    this.mesh.position.x += step * dt
    if (lander) lander.mesh.position.x += step * dt
  }
}

/* INIT */

const moon = createMoon()
moon.position.set(30, 0, 30)
scene.add(moon)
setBackground(0x000000)
camera.position.z = 18

const { mesh: landerMesh } = await loadModel({ file: 'space/lunar-module/model.fbx', size: 2.5 })
scene.add(landerMesh)
landerMesh.position.y = 5

const platform = new Platform()
scene.add(platform.mesh)

const lander = new Lander(landerMesh)

const stars = new Stars()
scene.add(stars.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()

  platform.move(dt, !lander.falling ? lander : null)

  lander.handleInput(dt)
  lander.checkLanding(platform.mesh, dt)
  lander.update(dt)
  lander.showStats(stats)

  renderer.render(scene, camera)
}()
