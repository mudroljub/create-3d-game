import chroma from '../libs/chroma.js'
import {getHighPoint} from './helpers.js'

const scale = chroma.scale(['brown', '#636f3f', '#7a8a46', '#473922', '#967848', '#dbc496', 'white']).domain([0, 100])

export default function(src, callback, size = 256) {
  const img = new Image()
  img.src = src
  img.onload = function() {
    const spacingX = 3
    const spacingZ = 3
    const heightOffset = 2

    const canvas = document.createElement('canvas')
    canvas.size = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0)
    const geometry = new THREE.Geometry()
    const pixel = ctx.getImageData(0, 0, size, size)

    const step = 4 // step is rgba
    for (let x = 0; x < size; x++)
      for (let z = 0; z < size; z++) {
        const i = z * step + (size * x * step)
        const yValue = pixel.data[i] / heightOffset
        const vertex = new THREE.Vector3(x * spacingX, yValue, z * spacingZ)
        geometry.vertices.push(vertex)
      }

    for (let z = 0; z < size - 1; z++)
      for (let x = 0; x < size - 1; x++) {
        const a = x + z * size
        const b = (x + 1) + (z * size)
        const c = x + ((z + 1) * size)
        const d = (x + 1) + ((z + 1) * size)

        const face1 = new THREE.Face3(a, b, d)
        const face2 = new THREE.Face3(d, c, a)
        face1.color = new THREE.Color(scale(getHighPoint(geometry, face1)).hex())
        face2.color = new THREE.Color(scale(getHighPoint(geometry, face2)).hex())
        geometry.faces.push(face1)
        geometry.faces.push(face2)
      }

    geometry.computeVertexNormals(true)
    // geometry.computeFaceNormals()
    geometry.computeBoundingBox()
    const {max} = geometry.boundingBox

    const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors,
    }))
    mesh.translateX(-max.x / 2)
    mesh.translateZ(-max.z / 2)
    callback(mesh)
  }
}
