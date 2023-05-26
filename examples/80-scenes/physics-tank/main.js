import * as THREE from 'three'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import Tank from '/utils/physics/Tank.js'
import { createGround } from '/utils/ground.js'
import { createMoonSphere, createTremplin, createCrates, createCrate, createRustyBarrel, createMetalBarrel } from '/utils/geometry.js'
import { createSun } from '/utils/light.js'
import { sample } from '/utils/helpers.js'
import { createFirTree } from '/utils/geometry/trees.js'
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'

const { randFloat } = THREE.MathUtils

const world = new PhysicsWorld()

scene.add(createSun())

const ground = createGround({ color: 0x509f53 })
world.add(ground, 0)

/* OBJECTS */

const tremplin = createTremplin()
world.add(tremplin, 0)

createCrates({ z: 10 }).forEach(mesh => world.add(mesh, 20))

const createObject = [createCrate, createRustyBarrel, createMetalBarrel, createMoonSphere]

for (let i = 0; i < 20; i++) {
  const mesh = createFirTree()
  mesh.position.set(randFloat(10, 50), 0, randFloat(-50, 50))
  world.add(mesh)
}

for (let i = 0; i < 30; i++) {
  const mesh = sample(createObject)({ translateHeight: false })
  mesh.position.set(randFloat(-10, -50), 0, randFloat(-30, 30))
  world.add(mesh, 10)
}

const createBuilding = [createRuin, createWarehouse, createWarehouse2, createWarRuin, createAirport]

for (let i = -1; i < 5; i++)
  for (let j = 0; j < 3; j++) {
    const warehouse = sample(createBuilding)()
    warehouse.position.set(-i * 30, 0, j * 30 + 60)
    world.add(warehouse)
  }

/* VEHICLE */

const tank = new Tank({ physicsWorld: world.physicsWorld, camera, pos: { x: 0, y: 0, z: -20 } })

scene.add(tank.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  tank.update(dt)
  world.update(dt)
  renderer.render(scene, camera)
}()
