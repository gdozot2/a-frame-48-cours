AFRAME.registerPrimitive('gd-box', {
  defaultComponents: {
    gdbox: {},
  },
  mappings: {
    size: 'gdbox.size',
    color: 'gdbox.color'
  },
});

AFRAME.registerComponent('gdbox', {
  schema: {
    size: { type: 'number', default: 1 },
    color: { type: 'color', default: 'black' }
  },
  init: function () {
    this.genVertices();
    this.genShape();
    this.genGeometry();
    this.genMaterial();
    this.genMesh();
  },
  genVertices: function () {
    const halfSize = this.data.size / 2;
    this.vertices = [];
    this.vertices.push(new THREE.Vector2(-halfSize, halfSize));
    this.vertices.push(new THREE.Vector2(halfSize, halfSize));
    this.vertices.push(new THREE.Vector2(halfSize, -halfSize));
    this.vertices.push(new THREE.Vector2(-halfSize, -halfSize));
  },
  genShape: function () {
    this.shape = new THREE.Shape();
    this.shape.moveTo(this.vertices[0].x, this.vertices[0].y);
    this.shape.lineTo(this.vertices[1].x, this.vertices[1].y);
    this.shape.lineTo(this.vertices[2].x, this.vertices[2].y);
    this.shape.lineTo(this.vertices[3].x, this.vertices[3].y);
    this.shape.lineTo(this.vertices[0].x, this.vertices[0].y);
  },
  genMaterial: function () {
    this.material = new THREE.MeshLambertMaterial({ color: this.data.color });
  },
  genGeometry: function () {
    const extrudeSettings = {
        steps: 1,
        depth: this.data.size,
        bevelEnabled: false,
    };
    this.geometry = new THREE.ExtrudeGeometry(this.shape, extrudeSettings);
  },
  genMesh: function () {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.el.setObject3D('mesh', this.mesh);
  }
});
