import { scene, camera, createToonRenderer } from '/core/scene.js'
import { createRandomBoxes } from '/core/geometry/index.js'
import { createGround, createLava } from '/core/ground.js'
import { hemLight } from '/core/light.js'
import Coin from '/core/objects/Coin.js'
import GUI, { avatarControls } from '/core/io/GUI.js'
import Platform from '/core/objects/Platform.js'
import { Spinner } from '/core/loaders.js'
import GameLoop from '/core/GameLoop.js'

const renderer = await createToonRenderer()

const numBoxes = 400, mapSize = 200, lavaSize = 50
const numCoins = numBoxes / 4
const platforms = []
const coins = []

let player

camera.position.set(0, 2, 56)

hemLight({ intensity: Math.PI * 1.25 })

const floor = createGround({ file: 'terrain/ground.jpg' })
scene.add(floor)

const boxes = createRandomBoxes({ n: numBoxes, mapSize })
scene.add(...boxes)

const messageDict = {
  1: 'Well, that\'s a good start!',
  10: 'Keep up the good work!',
  25: 'Nice result so far...',
  50: 'Half down, half to go!',
  75: 'You smell victory in the air...',
}

const gui = new GUI({ subtitle: 'coins left', total: numCoins, endText: 'BRAVO!<br>You have collected all coins', messageDict, controls: { ...avatarControls, P: 'pause' } })

const lava = await createLava({ size: lavaSize })
scene.add(lava)

/* FUNCTIONS */

const withinCircle = position => Math.pow(position.x, 2) + Math.pow(position.z, 2) < Math.pow(lavaSize, 2)

const inLava = () => player.position.y <= .1 && withinCircle(player.position)

function checkCollision(coin) {
  if (player.distanceTo(coin.mesh) > 1.4) return
  coins.splice(coins.findIndex(c => c === coin), 1)
  scene.remove(coin.mesh)
  gui.addScore(1, coins.length)
}

function createCoins(addPlatforms) {
  for (let i = 0; i < numCoins; i++) {
    const pos = boxes[i].position.clone()
    pos.y += 6.15

    if (addPlatforms && Math.random() > .8) {
      const platform = new Platform({ pos, file: null })
      platforms.push(platform)
      scene.add(platform.mesh)
      player.addSolids(platform.mesh)
    }

    const coin = new Coin({ pos })
    coins.push(coin)
    scene.add(coin.mesh)
  }
}

function reset(addPlatforms = false) {
  coins.forEach(coin => scene.remove(coin.mesh))
  coins.length = 0
  createCoins(addPlatforms)

  gui.reset()

  player.position = [0, 0, 50]
  player.energy = 100
  player.lookAt(scene.position)
}

/* LOOP */

new GameLoop((delta, time) => {
  renderer.render(scene, camera)
  if (!player) return

  coins.forEach(coin => {
    coin.update(delta)
    checkCollision(coin)
  })

  if (inLava() && player.skin != 'LAVA') {
    gui.showMessage('Get out of the lava, you\'re burning!', true)
    player.energy -= .1
  }

  if (player.dead) {
    gui.dead = true
    gui.showGameScreen({ callback: reset })
    player.position.y -= .01
  } else
    player.update(delta)

  platforms.forEach(platform => platform.update(delta))
  lava.material.uniforms.time.value = time * .5
})

/* CALLBACK */

const callback = async e => {
  if (e.target.tagName != 'INPUT') return

  const spinner = new Spinner()
  gui.clearScreen()

  const Avatar = await import('/core/actor/Avatar.js')
  player = new Avatar.default({ camera, solids: [floor, ...boxes], skin: e.target.id, showHealthBar: true, maxJumpTime: .99 })
  player.chaseCamera.distance = 6
  scene.add(player.mesh)
  reset(true)
  gui.showHeighScore()
  spinner.hide()
}

const subtitle = /* html */`
  <div class="game-screen-select">
    <div>
      <input type="image" id="STONE" src="/assets/images/avatar/STONE.jpg" style="border: 3px solid black" /><br>
      Normal
    </div>
    <div>
      <input type="image" id="DISCO" src="/assets/images/avatar/DISCO.jpg" style="border: 3px solid black" /><br>
      Can fly
    </div>
    <div>
      <input type="image" id="LAVA" src="/assets/images/avatar/LAVA.jpg" style="border: 3px solid black" /><br>
      Immune to lava
    </div>
  </div>
`
gui.showGameScreen({ title: 'Choose your avatar', subtitle, callback })