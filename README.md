# Create 3D worlds

Library of reusable Three.js components to play with.

## Start

```
npm i
npx live-server
```

## TODO

### Scenes & examples

- Zeppelin
  - zamak na sred?
  - refact

- Aircraft / 1943
  - dodati izbor aviona
  - dodati drveće
  - dodati objekte
  - pucanje i eksplozije
  - spojiti sa airplane?

- Tenk
  - koristiti TankPlayer
  - tenk da se trese kada ide
  - ide kroz ratnu scenu (spaljene zgrade) i ruši stvari

- Vozilo
  - vozilo da se okreću točkovi kada ide
  - ispitati modele, jel moguće upravljati točkovima, kupolom ili nečim

- Endless runner
  - probati skejtera
  - probati konja ili dabra

- Partizani 2D
  - napraviti 2d scenu u 3d, ideja https://codepen.io/davekwiatkowski/pen/pWPVpX
  - junior general slike
  - borba (vidi slike partizana animaciju staru)

- Nude victim
  - beži dok je jure zombiji
  - endless runner?

- Groblje
  - nasumično zakriviti kamenove
  - dodati neku staru kuću

- Savo
  - dodati intro na pisaćoj mašini
  - dodati fabriku, ratne zgrade, ww2 tower i slično u neku ww2 scenu

- RPG / Fantasy
  - napraviti scenu sa ravnim tlom
  - karakter dolazi do kuće i ulazi (vidi house model primer)

- Avatar
  - pre početka scene izbor skina za avatar?

- Avatar towers
  - dodati novčiće na stepenice?
  - ograničiti vreme?

- Barbarian
  - BUG: nakon skoka ostaje ukočena
  - dodati spomenik viteza

- Spomenici
  - skalirati teren?

### Optimizacija

- probati dinamički import, učitavati neprijatelje (i objekte) tek kad su blizu
  - odrediti blizinu u lavirintu?
- optimizovati statične modele https://github.com/donmccurdy/glTF-Transform
- primeniti savete 
  - https://twitter.com/mrdoob/status/966609115140128768
  - https://attackingpixels.com/tips-tricks-optimizing-three-js-performance/
- izmeriti statistike, ako je presporo izbacivati nevažno
- smanjiti zavisnosti fajlova, obrisati neke helper funkcije ili prebaciti na klase
  - npr createCoin to Coin class, i ostale funkcije koje imaju matične klase

### Polishing

- puštati i restartovati scenu, probati intro i outro za scene
- popraviti HTML margine?
DODATI:
  - toon-shader gde se slaže
    https://www.maya-ndljk.com/blog/threejs-basic-toon-shader
    https://summer-afternoon.vlucendo.com/
  - cilj i poene?
  - indikator energije?
  - UI komande
  - dodati game UI https://ronenness.github.io/RPGUI ?
  - komande za dodirne ekrane (strelice i dugmiće)
  - reload button (kad igrač umre)
  - full screen btn
  - mute btn
  - preloader po potrebi
- probati VR https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content
- pauzirati scenu na tab unfocus
- po završetku partije upisivanje imena pored poena za top listu

### Publish
- napraviti index.js za export svega postojećeg (vidi threejs)
- srediti root-relativne linkove da rade u podfolderu
- možda build proces, minifikacija, i sl.
- sve dobro dokumentovati
- minimalni bekend za statistike i pamćenje poena ili bar brojač poseta
  - možda server na rosberyju

## Helpers

Raycaster helper:

```js
scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300))
```

Box helper:

```js
const box = new THREE.BoxHelper(mesh, 0xffff00)
scene.add(box)
```

Axes helper (X axis is red, Y is green, Z is blue):

```js
scene.add(new THREE.AxesHelper(50))
```

Ako je teren jednobojan, bez svetla, uraditi:

```js
geometry.computeVertexNormals()
```

## Documentation

All libraries in `/libs` folder are updated manually to support ES6 export.

### Ammo Physics

Some methods:

```js
body.setFriction(.9)
body.setRollingFriction(10)
body.setRestitution(.95)
body.setAngularVelocity(btVector3)
body.setLinearVelocity(btVector3)

// apply a force to the x-axis of the rigid body
const force = new Ammo.btVector3(10, 0, 0);
body.applyForce(force, new Ammo.btVector3(0, 0, 0));

// apply an impulse (very short duration force, like a punch or a kick) to the x-axis
body.applyImpulse(new Ammo.btVector3(10, 0, 0))

// jump
body.applyCentralImpulse(new Ammo.btVector3(0, mass * .5, 0))
```

## Sources

Examples are from theese great books and tutorials:

* 3D Game Programming for Kids (Chris Strom)
* [Interactive 3D Graphics](https://in.udacity.com/course/interactive-3d-graphics--cs291/) (Eric Haines)
* [Three.js tutorials by example](http://stemkoski.github.io/Three.js/) (Lee Stemkoski)
* [WebGL and Three.js Fundamentals](https://github.com/alexmackey/threeJsBasicExamples) (Alex Mackey)
* [Examples created by Yomotsu using THREE.js](http://yomotsu.github.io/threejs-examples/) (Akihiro Oyamada)
* [Learning Threejs](https://github.com/josdirksen/learning-threejs) (Jos Dirksen)
* [Essential Three.js](https://github.com/josdirksen/essential-threejs) (Jos Dirksen)
* [Three.js Cookbook](https://github.com/josdirksen/threejs-cookbook) (Jos Dirksen)
* [How to Design 3D Games with Web Technology - Book 01: Three. Js - HTML5 and WebGL](https://thefiveplanets.org/b01/) (Jordi Josa)

Free 3D Models are from: 
- 3dwarehouse.sketchup.com
- sketchfab.com
- turbosquid.com 
- mixamo.com
- archive3d.net
- rigmodels.com
and other respected sites.

Geodata:
- visinske mape za ceo svet https://tangrams.github.io/heightmapper/#8.3724/43.3401/19.5293
- weighted random https://pixelero.wordpress.com/2008/04/24/various-functions-and-various-distributions-with-mathrandom/
