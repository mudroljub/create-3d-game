export const $ = s => document.querySelector(s)

export function randomInRange(min, max, roundDown = true) {
  const rand = Math.random() * (max - min + 1) + min
  return roundDown ? Math.floor(rand) : rand
}

export const isCollide = (bounds1, bounds2) =>
  bounds1.xMin <= bounds2.xMax && bounds1.xMax >= bounds2.xMin &&
  bounds1.yMin <= bounds2.yMax && bounds1.yMax >= bounds2.yMin &&
  bounds1.zMin <= bounds2.zMax && bounds1.zMax >= bounds2.zMin

export function getHighPoint(geometry, face) {
  const v1 = geometry.vertices[face.a].y
  const v2 = geometry.vertices[face.b].y
  const v3 = geometry.vertices[face.c].y
  return Math.max(v1, v2, v3)
}

export const randomColor = (h = .25, s = 0.5, l = 0.2) =>
  new THREE.Color().setHSL(Math.random() * 0.1 + h, s, Math.random() * 0.25 + l)

// TODO: refactor to recursion?
export const findGround = function(terrain, x, z) {
  const direction = new THREE.Vector3(0, -1, 0)
  const origin = { x, y: 1000, z }
  const raycaster = new THREE.Raycaster()
  raycaster.set(origin, direction)
  const intersects = raycaster.intersectObject(terrain, true)
  return intersects.length > 0 ? intersects[0].point : null
}

/**
 * roll a random positive integer <= n
 * @param n
 * @returns {number}
 */
export function roll(n) {
  return Math.random() * n | 0
}
