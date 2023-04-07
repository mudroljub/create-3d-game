import { scene, camera, renderer, clock, addScoreUI } from '/utils/scene.js'
import { createRandomBoxes } from '/utils/geometry.js'
import { createGround } from '/utils/ground.js'
import { hemLight, createSun } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'
import Coin from '/utils/actor/child/Coin.js'

const coins = []

hemLight()
scene.add(createSun({ intensity: .25 }))

const floor = createGround({ file: 'terrain/ground.jpg' })
scene.add(floor)
const boxes = createRandomBoxes({ n: 400, mapSize: 200 })
scene.add(...boxes)

boxes.forEach(box => {
  if (Math.random() < .75) return
  const coin = new Coin({ pos: box.position })
  coin.mesh.translateZ(-6.15)
  coins.push(coin)
  scene.add(coin.mesh)
})

const player = new Avatar({ camera, solids: [floor, ...boxes], jumpStyle: 'DOUBLE_JUMP' })
player.cameraFollow.distance = 6
scene.add(player.mesh)

const updateScore = addScoreUI({ title: 'Coins collected', subtitle: 'Coins left' })

/* functions */

function checkCollision(coin) {
  if (player.distanceTo(coin.mesh) > 1.35) return
  coins.splice(coins.findIndex(c => c === coin), 1)
  coin.dispose()
  updateScore(1, coins.length)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  coins.forEach(coin => {
    coin.update(delta)
    checkCollision(coin)
  })
  renderer.render(scene, camera)
}()
