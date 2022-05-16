import Aircraft from './Aircraft.js'

const angleSpeed = 0.03

export default class Airplane extends Aircraft {
  constructor({ mesh, speed = 2, minSpeed = 0.5, maxSpeed = 3 } = {}) {
    super({ mesh, speed, minSpeed, maxSpeed })
    mesh.position.y = 100
  }

  up() {
    if (this.isTouchingGround()) return
    this.pitch(-angleSpeed / 10)
  }

  down() {
    this.pitch(angleSpeed / 10)
  }

  left() {
    if (this.speed < 0.2) this.yaw(angleSpeed * 0.3) // ako je sleteo
    else this.roll(angleSpeed)
  }

  right() {
    if (this.speed < 0.2) this.yaw(-angleSpeed * 0.3)
    else this.roll(-angleSpeed)
  }

  checkLanding() {
    if (this.isTouchingGround() && this.mesh.rotation.x < 0) {
      this.pitch(Math.abs(this.mesh.rotation.x) * 0.01)
      this.slowDown(0.99)
    }
  }

  update() {
    this.checkLanding()
    super.update()
  }
}
