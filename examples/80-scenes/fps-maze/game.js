import { scene, camera, setBackground, createToonRenderer } from '/core/scene.js'
import { createGround } from '/core/ground.js'
import { sample } from '/core/helpers.js'
import { hemLight, lightningStrike } from '/core/light.js'
import FPSPlayer from '/core/actor/FPSPlayer.js'
import Maze from '/core/mazes/Maze.js'
import { truePrims } from '/core/mazes/algorithms.js'
import { Spinner } from '/core/loaders.js'
import Report from '/core/io/Report.js'

const enemies = []

const spinner = new Spinner()
const renderer = await createToonRenderer()

const light = hemLight({ intensity: Math.PI * 1.5 })
setBackground(0x070b34)
scene.add(createGround({ file: 'terrain/ground.jpg' }))

const maze = new Maze(8, 8, truePrims, 5)
const coords = maze.getEmptyCoords(true)
const walls = maze.toTiledMesh({ texture: 'terrain/concrete.jpg' })
scene.add(walls)

const player = new FPSPlayer({ camera, solids: walls })
player.putInMaze(maze)
scene.add(player.mesh)

renderer.render(scene, camera) // first draw

/* DYNAMIC IMPORT */

const GUI = await import('/core/io/GUI.js')
const { fpsControls } = GUI
const gui = new GUI.default({ subtitle: 'Enemy left', total: enemies.length, controls: fpsControls, scoreClass: '', controlsWindowClass: 'white-window' })

const soldiers = ['GermanMachineGunner', 'SSSoldier', 'NaziOfficer', 'GermanFlameThrower']
for (let i = 0; i < 10; i++) {
  const name = sample(soldiers)
  const obj = await import(`/core/actor/derived/ww2/${name}.js`)
  const EnemyClass = obj[name + 'AI']
  const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh, solids: walls })
  enemies.push(enemy)
  scene.add(enemy.mesh)
}

const FirstAid = await import('/core/objects/FirstAid.js')
for (let i = 0; i < 2; i++) {
  const firstAid = new FirstAid.default({ pos: coords.pop() })
  scene.add(firstAid.mesh)
}

const GameLoop = await import('/core/GameLoop.js')
spinner.hide()

/* LOOP */

new GameLoop.default((delta, time) => {
  renderer.render(scene, camera)

  const killed = enemies.filter(enemy => enemy.energy <= 0)
  const left = enemies.length - killed.length
  const won = player.position.distanceTo(maze.exitPosition) < 5

  player.update(delta)

  if (won)
    gui.renderText(`Bravo!<br>You found a way out<br> and kill ${killed.length} of ${enemies.length} enemies`)

  const blinkingMessage = won ? '' : 'Find a way out!'
  gui.update({ time, points: killed.length, left, dead: player.dead, blinkingMessage })

  enemies.forEach(enemy => enemy.update(delta))

  if (Math.random() > .998) lightningStrike(light)
}, false, true)

gui.showGameScreen({
  goals: ['Find the way out', 'Bonus: Kill all enemies'],
  subtitle: 'Shoot: MOUSE<br> Move: WASD or ARROWS<br> Run: CAPSLOCK',
  usePointerLock: true,
})

new Report({ container: gui.gameScreen, text: 'After a successful sabotage mission you stayed behind enemy lines.\n\nFind the way out of the enemy base.' })