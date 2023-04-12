import { Vector2 } from 'three'
import input from '/utils/classes/Input.js'
import { Flame } from '/utils/classes/Particles.js'
import GameObject from '/utils/actor/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const { mesh } = await loadModel({ file: 'space/lunar-module/model.fbx', size: 2.5 })

const message = {
  fail: 'Landing failure!',
  success: 'Nice landing!',
  outOfFuel: 'Out of fuel, platform missed!',
  lost: 'Lost in space!',
}

const platformY = -10
const lowerBound = -30

export default class Lander extends GameObject {
  constructor() {
    super ({ mesh })
    this.reset()
  }

  get statusText() {
    if (this.onGround)
      return this.failure ? message.fail : message.success

    if (!this.fuel && this.position.y < platformY)
      return message.outOfFuel

    if (this.position.y < lowerBound)
      return message.lost

    return ''
  }

  reset() {
    this.fuel = 300
    this.position.set(0, 5, 0)
    this.mesh.rotation.z = 0
    this.velocity = new Vector2()
    this.onGround = false
    this.failure = false

    this.flame = new Flame()
    this.flame.mesh.rotateX(Math.PI * .5)
  }

  handleInput() {
    if (this.onGround) return

    if (this.fuel >= .5) {
      if (input.left) {
        this.resetFlame(-Math.PI * .5, [-1.75, 1.5, 0])
        this.applyForce(0, .1)
        this.fuel -= 0.5
      }
      if (input.right) {
        this.resetFlame(Math.PI * .5, [1.75, 1.5, 0])
        this.applyForce(Math.PI, .1)
        this.fuel -= 0.5
      }
    }

    if (this.fuel >= 1 && input.down) {
      this.resetFlame(0, [0, -1, 0])
      this.applyForce(Math.PI / 2, .09)
      this.fuel--
    }
  }

  resetFlame(angle, pos) {
    this.mesh.add(this.flame.mesh)
    this.flame.reset({ pos, randomize: false })
    this.flame.mesh.rotation.y = angle
    this.shouldLoop = true
  }

  clearThrust() {
    this.shouldLoop = false
  }

  withinHeight(platform) {
    return this.position.y <= platform.position.y + platform.height // -9
      && this.position.y > platform.position.y // -10
  }

  withinWidth(platform) {
    return this.position.x > platform.position.x - platform.width * .45
      && this.position.x < platform.position.x + platform.width * .45
  }

  doFailure() {
    this.failure = true
    this.mesh.rotation.z = Math.PI * .5
    this.resetFlame(Math.PI * .5, [0, 1.25, 0])
  }

  checkLanding(platform) {
    if (!this.withinHeight(platform) || !this.withinWidth(platform)) return

    this.onGround = true

    if (this.velocity.y < -2.4)
      this.doFailure()
    else
      this.clearThrust()

    this.velocity.set(0, 0)
  }

  applyForce(angle, thrust) {
    this.velocity.add({ x: thrust * Math.cos(angle), y: thrust * Math.sin(angle) })
  }

  applyGravity() {
    this.applyForce(-Math.PI / 2, .01625)
  }

  updateFlame(delta) {
    if (!input.keyPressed || !this.fuel) this.clearThrust()
    this.flame.update({ delta, max: 3, loop: this.shouldLoop })
  }

  update(delta) {
    this.handleInput()
    if (!this.onGround) this.applyGravity(delta)
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta
    this.updateFlame(delta)

    if (this.statusText && input.pressed.KeyR)
      this.reset()
  }
}
