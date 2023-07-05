import * as THREE from 'three'
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js'

export const clock = new THREE.Clock()

// STYLE

// const rpgui = document.createElement('link')
// rpgui.rel = 'stylesheet'
// rpgui.type = 'text/css'
// rpgui.href = '/libs/rpgui/rpgui.css'
// document.head.appendChild(rpgui)

const css = document.createElement('link')
css.rel = 'stylesheet'
css.type = 'text/css'
css.href = '/assets/style.css'
document.head.appendChild(css)

// SCENE

export const scene = new THREE.Scene()

export const setBackground = color => {
  scene.background = new THREE.Color(color)
}

// CAMERA

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000)
camera.position.set(0, 2, 4)

// RENDERER

export const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)) // save battery by limit pixel ratio to 2
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setClearColor(0x87CEEB) // 0x7ec0ee

const canvas = renderer.domElement
canvas.addEventListener('contextmenu', e => e.preventDefault())
document.body.appendChild(canvas)
canvas.focus()

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

export async function createToonRenderer({ defaultThickness = 0.0025 } = {}) {
  const { OutlineEffect } = await import('/node_modules/three/examples/jsm/effects/OutlineEffect.js')
  return new OutlineEffect(renderer, { defaultThickness })
}

export const fixColors = () => {
  renderer.outputEncoding = THREE.sRGBEncoding
}

/* CONTROLS */

export function createOrbitControls(cam = camera, el = renderer.domElement) {
  const controls = new OrbitControls(cam, el)
  controls.maxPolarAngle = Math.PI / 2 - 0.1 // prevent bellow ground, negde ne radi
  controls.enableKeys = false
  controls.minDistance = 2
  controls.zoomSpeed = .3
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  return controls
}
