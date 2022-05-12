import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange, randomNuance } from './helpers.js'

const loader = new THREE.TextureLoader()

/* helpers */

function createOutline(size) {
  const outlineSize = size * 0.05
  const geometry = new THREE.BoxGeometry(size + outlineSize, size + outlineSize, size + outlineSize)
  const material = new THREE.MeshBasicMaterial({ color: 0x0000000, side: THREE.BackSide })
  return new THREE.Mesh(geometry, material)
}

/* creators */

export function createBox({ x = 0, y = 0, z = 0, size = 20, file, color = randomNuance({ h: 0.1, s: 0.01, l: .75 }), zModifier = 1, yModifier = 1 } = {}) {
  const ySize = size * yModifier
  const zSize = size * zModifier
  const geometry = new THREE.BoxGeometry(size, ySize, zSize)
  const options = {}
  if (file) options.map = loader.load(`/assets/textures/${file}`)
  else options.color = color
  const material = new THREE.MeshPhongMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  mesh.translateY(ySize / 2)
  return mesh
}

export const createCrate = (x, y, z, size, file = 'crate.gif') => createBox({ x, y, z, size, file })

export const createBlock = (x, y, z, size, color) => createBox({ x, y, z, size, file: null, color })

export const createWallBlock = (x, z, size, file, yModifier) => createBox({ x, z, size, file, yModifier })

export function createPlayerBox(x = 0, y = 0, z = 0, size = 2, transparent = false) {
  const box = createBlock({ size })
  box.material.opacity = transparent ? 0 : 1
  box.material.transparent = transparent
  const group = new THREE.Group()
  group.add(box)
  group.position.set(x, y, z)
  return group
}

/* factories */

export function createRandomBoxes(n = 100, size = 20, texture) {
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const color = randomNuance({ h: 0.1, s: 0.01, l: .75 })
    const x = randomInRange(-200, 200), y = randomInRange(-5, 100), z = randomInRange(-200, 200)
    const box = createBox(x, y, z, size, texture, color)
    group.add(box)
  }
  return group
}

export function createSpiralStairs(floors, stairsInCirle = 20, yDistance = 80) {
  const radius = 100
  const stairs = new THREE.Group
  const CIRCLE = Math.PI * 2
  const step = CIRCLE / stairsInCirle

  for (let i = 0; i <= CIRCLE * floors; i += step) {
    const x = Math.cos(i) * radius
    const z = Math.sin(i) * radius
    const block = createBox({ x, y: i * yDistance, z, zModifier: 2 })
    block.rotateY(Math.PI / 2 - i)
    stairs.add(block)
  }
  return stairs
}
