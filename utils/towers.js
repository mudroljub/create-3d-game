import * as THREE from '/node_modules/three125/build/three.module.js'
import { createBox } from '/utils/boxes.js'
import { centerObject, adjustHeight } from '/utils/helpers.js'

const CIRCLE = Math.PI * 2

// TOWER OF BABEL

function createCircle({ r = 100, y = 0, size = 10 } = {}) {
  const blocks = []
  const blocksInCirle = 15
  const step = CIRCLE / blocksInCirle
  for (let i = 0; i <= CIRCLE; i += step) {
    const x = Math.cos(i) * r
    const z = Math.sin(i) * r
    const block = createBox({ size, x, y, z, zModifier: 2 })
    block.rotateY(-i)
    blocks.push(block)
  }
  return blocks
}

export function createBabelTower({ floors = 5, size = 10, r = 50 } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < floors; i++)
    group.add(...createCircle({ r: r - i * 5, y: i * size, size }))
  return group
}

export function spomenik({ floors = 6, size = 20, r = 5 } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < floors; i++)
    group.add(...createCircle({ r: r - i * 5, y: i * size * .5, size }))
  return group
}

export function spaceStructure({ floors = 6, size = 5, r = 5 } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < floors; i++)
    group.add(...createCircle({ r: r - i * 5, y: i * size * 2, size }))
  return group
}

// STAIRWAY TO HEAVEN

export function createSpiralStairs({ floors = 5, radius = 30, stairsInCirle = 30, floorHeight = 20, blockSize = 4, zModifier = 2, xModifier = 1 } = {}) {
  const stairs = new THREE.Group
  const step = CIRCLE / stairsInCirle

  for (let i = 0; i <= CIRCLE * floors; i += step) {
    const x = Math.cos(i) * radius
    const z = Math.sin(i) * radius
    const block = createBox({ x, y: i * floorHeight, z, zModifier, xModifier, size: blockSize })
    block.rotateY(Math.PI / 2 - i)
    stairs.add(block)
  }
  return stairs
}

// CASTLE

function buildTower({ x = 0, z = 0, radius = 15, height = 200 } = {}) {
  const towerGeometry = new THREE.Geometry()
  const material = new THREE.MeshNormalMaterial()
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height * .75, 15), material)
  tower.position.set(x, 70, z)
  tower.updateMatrix()
  towerGeometry.merge(tower.geometry, tower.matrix)

  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0, radius * 1.2, height * .25, 15), material)
  cone.position.set(x, 170, z)
  cone.updateMatrix()
  towerGeometry.merge(cone.geometry, cone.matrix)
  return new THREE.Mesh(towerGeometry, material)
}

export function buildCastle({ rows = 10, brickInWall = 30, rowSize = 10, towerRadius = 20 } = {}) {
  const spacing = 0.2
  const brickSize = rowSize + spacing
  const wallWidth = brickSize * brickInWall
  const towerCoords = [
    [0, 0],
    [0, wallWidth],
    [wallWidth, 0],
    [wallWidth, wallWidth]
  ]
  const castleGeometry = new THREE.Geometry()

  const notPlaceForGate = (x, y) =>
    (x < wallWidth * 3 / 8 || x > wallWidth * 5 / 8) || y > rows * brickSize / 2  // not in center and not to hight

  const isEven = y => Math.floor(y / brickSize) % 2 == 0

  function addBlock(x, y, z) {
    const block = new THREE.Mesh(new THREE.BoxGeometry(rowSize, rowSize, rowSize), new THREE.MeshNormalMaterial())
    block.position.set(x, y, z)
    block.updateMatrix()
    castleGeometry.merge(block.geometry, block.matrix)
  }

  function addFourBlocks(x, y) {
    addBlock(x, y, 0)
    addBlock(x, y, wallWidth)
    addBlock(0, y, x)
    if (notPlaceForGate(x, y)) addBlock(wallWidth, y, x)
  }

  function buildRow(y, x) {
    if (x > wallWidth + 1) return
    if (y < brickSize * (rows - 1))
      addFourBlocks(x, y)
    else if (isEven(x)) addFourBlocks(x, y)
    buildRow(y, x + brickSize)
  }

  function buildWalls(y) {
    if (y > brickSize * rows) return
    const startX = isEven(y) ? 0 : brickSize / 2
    buildRow(y, startX)
    buildWalls(y + brickSize)
  }

  buildWalls(0)

  towerCoords.forEach(([x, z]) => {
    const tower = buildTower({ x, z, radius: towerRadius })
    tower.updateMatrix()
    castleGeometry.merge(tower.geometry, tower.matrix)
  })
  castleGeometry.rotateY(-Math.PI / 2)
  const castle = new THREE.Mesh(castleGeometry, new THREE.MeshNormalMaterial())
  centerObject(castle)
  adjustHeight(castle)
  return castle
}
