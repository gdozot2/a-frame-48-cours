/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/animate-rotation.js":
/*!********************************************!*\
  !*** ./src/components/animate-rotation.js ***!
  \********************************************/
/***/ (() => {

AFRAME.registerComponent('animate-rotation', {
  multiple: true,
  schema: {
    speed: {type: 'number', default: 10},
    axe: {type: 'string', default: 'x'}
  },
  init: function () {

  },
  remove: function () {

  },
  update: function () {

  },
  tick: function (elapsed, dt) {
    this.el.object3D.rotation[this.data.axe] = THREE.MathUtils.degToRad(elapsed / this.data.speed);
  }
})

/***/ }),

/***/ "./src/components/cursor-listener.js":
/*!*******************************************!*\
  !*** ./src/components/cursor-listener.js ***!
  \*******************************************/
/***/ (() => {

AFRAME.registerComponent('cursor-listener', {
  init: function () {
    this.el.addEventListener('click', evt => {
      console.log(evt);
    });

    this.el.addEventListener('open', evt => {
      console.log('open');
    });
    this.el.addEventListener('close', evt => {
      console.log('close');
    });
  }
});

/***/ }),

/***/ "./src/components/emit-when-near.js":
/*!******************************************!*\
  !*** ./src/components/emit-when-near.js ***!
  \******************************************/
/***/ (() => {

AFRAME.registerComponent('emit-when-near', {
  multiple: true,
  schema: {
    target: {type: 'selector', default: '[camera], a-camera'},
    distance: {type: 'number', default: 1},
    event: {type: 'string', default: 'click'},
    eventFar: {type: 'string', default: 'unclick'},
    throttle: {type: 'number', default: 100},
  },
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.checkDist, this.data.throttle, this);
    this.emiting = false;
  },
  checkDist: function () {
    let myPos = new THREE.Vector3(0, 0, 0);
    let targetPos = new THREE.Vector3(0, 0, 0);
    this.el.object3D.getWorldPosition(myPos);
    this.data.target.object3D.getWorldPosition(targetPos);
    const distanceTo = myPos.distanceTo(targetPos);
    if (distanceTo <= this.data.distance) {
      if (this.emiting) return;
      this.emiting = true;
      this.el.emit(this.data.event, {collidingEntity: this.data.target}, false);
      this.data.target.emit(this.data.event, {collidingEntity: this.el}, false);
    } else {
      if (!this.emiting) return;
      this.el.emit(this.data.eventFar, {collidingEntity: this.data.target}, false);
      this.data.target.emit(this.data.eventFar, {collidingEntity: this.el}, false);
      this.emiting = false;
    }
  }
});


/***/ }),

/***/ "./src/components/hover-highlighter.js":
/*!*********************************************!*\
  !*** ./src/components/hover-highlighter.js ***!
  \*********************************************/
/***/ (() => {

AFRAME.registerComponent('hover-highlighter', {
  schema: {
    color: {type: 'color', default: 'white'}
  },
  init: function () {
    let target = this.el;
    this.handlerOnEnter = evt => this.onEnter(evt);
    this.handlerOnLeave = evt => this.onLeave(evt);
    target.addEventListener("mouseenter", this.handlerOnEnter);
    target.addEventListener("mouseleave", this.handlerOnLeave);
  },
  onEnter: function (evt) {
    let cursor = evt.detail.cursorEl;
    this.savedColor = cursor.getAttribute("material").color;
    cursor.setAttribute("material", "color", this.data.color);
  },
  onLeave: function (evt) {
    let cursor = evt.detail.cursorEl;
    cursor.setAttribute("material", "color", this.savedColor);
  },
  remove: function () {
    let target = this.el;
    target.removeEventListener("mouseenter", this.handlerOnEnter);
    target.removeEventListener("mouseleave", this.handlerOnLeave);
  }
});

/***/ }),

/***/ "./src/components/listen-to.js":
/*!*************************************!*\
  !*** ./src/components/listen-to.js ***!
  \*************************************/
/***/ (() => {

AFRAME.registerComponent('listen-to', {
  multiple: true,
  schema: {
    evt: {type: 'string', default: 'click'},
    target: {type: 'selector'},
    emit: {type: 'string'}
  },
  init: function () {
    this.data.target.addEventListener(this.data.evt, evt => {
      this.el.dispatchEvent(new Event(this.data.emit));
    })
  }
});

/***/ }),

/***/ "./src/components/toggle-events.js":
/*!*****************************************!*\
  !*** ./src/components/toggle-events.js ***!
  \*****************************************/
/***/ (() => {

AFRAME.registerComponent('toggle-events', {
  multiple: true,
  schema: {
    sourceEvt: {type: 'string', default: 'click'},
    evt1: {type: 'string'},
    evt2: {type: 'string'}
  },
  init: function () {
    this.state = 0;
    this.el.addEventListener(this.data.sourceEvt, evt => {
      if (this.state == 0) {
        this.el.dispatchEvent(new Event(this.data.evt1))
        this.state = 1;
      } else {
        this.el.dispatchEvent(new Event(this.data.evt2))
        this.state = 0;
      }
    });
  }
});

/***/ }),

/***/ "./src/primitive/gd-box.js":
/*!*********************************!*\
  !*** ./src/primitive/gd-box.js ***!
  \*********************************/
/***/ (() => {

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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_animate_rotation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/animate-rotation */ "./src/components/animate-rotation.js");
/* harmony import */ var _components_animate_rotation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_animate_rotation__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_cursor_listener__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/cursor-listener */ "./src/components/cursor-listener.js");
/* harmony import */ var _components_cursor_listener__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_components_cursor_listener__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_hover_highlighter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/hover-highlighter */ "./src/components/hover-highlighter.js");
/* harmony import */ var _components_hover_highlighter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_components_hover_highlighter__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_toggle_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/toggle-events */ "./src/components/toggle-events.js");
/* harmony import */ var _components_toggle_events__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_components_toggle_events__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_listen_to__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/listen-to */ "./src/components/listen-to.js");
/* harmony import */ var _components_listen_to__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_components_listen_to__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_emit_when_near__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/emit-when-near */ "./src/components/emit-when-near.js");
/* harmony import */ var _components_emit_when_near__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_components_emit_when_near__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _primitive_gd_box__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./primitive/gd-box */ "./src/primitive/gd-box.js");
/* harmony import */ var _primitive_gd_box__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_primitive_gd_box__WEBPACK_IMPORTED_MODULE_6__);









})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL2FuaW1hdGUtcm90YXRpb24uanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50cy9jdXJzb3ItbGlzdGVuZXIuanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50cy9lbWl0LXdoZW4tbmVhci5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL2hvdmVyLWhpZ2hsaWdodGVyLmpzIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHMvbGlzdGVuLXRvLmpzIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHMvdG9nZ2xlLWV2ZW50cy5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9wcmltaXRpdmUvZ2QtYm94LmpzIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2FuaW1hdGUtcm90YXRpb24nLCB7XHJcbiAgbXVsdGlwbGU6IHRydWUsXHJcbiAgc2NoZW1hOiB7XHJcbiAgICBzcGVlZDoge3R5cGU6ICdudW1iZXInLCBkZWZhdWx0OiAxMH0sXHJcbiAgICBheGU6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ3gnfVxyXG4gIH0sXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG5cclxuICB9LFxyXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICB9LFxyXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICB9LFxyXG4gIHRpY2s6IGZ1bmN0aW9uIChlbGFwc2VkLCBkdCkge1xyXG4gICAgdGhpcy5lbC5vYmplY3QzRC5yb3RhdGlvblt0aGlzLmRhdGEuYXhlXSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChlbGFwc2VkIC8gdGhpcy5kYXRhLnNwZWVkKTtcclxuICB9XHJcbn0pIiwiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdjdXJzb3ItbGlzdGVuZXInLCB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZ0ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCBldnQgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ29wZW4nKTtcbiAgICB9KTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgZXZ0ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdjbG9zZScpO1xuICAgIH0pO1xuICB9XG59KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2VtaXQtd2hlbi1uZWFyJywge1xyXG4gIG11bHRpcGxlOiB0cnVlLFxyXG4gIHNjaGVtYToge1xyXG4gICAgdGFyZ2V0OiB7dHlwZTogJ3NlbGVjdG9yJywgZGVmYXVsdDogJ1tjYW1lcmFdLCBhLWNhbWVyYSd9LFxyXG4gICAgZGlzdGFuY2U6IHt0eXBlOiAnbnVtYmVyJywgZGVmYXVsdDogMX0sXHJcbiAgICBldmVudDoge3R5cGU6ICdzdHJpbmcnLCBkZWZhdWx0OiAnY2xpY2snfSxcclxuICAgIGV2ZW50RmFyOiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICd1bmNsaWNrJ30sXHJcbiAgICB0aHJvdHRsZToge3R5cGU6ICdudW1iZXInLCBkZWZhdWx0OiAxMDB9LFxyXG4gIH0sXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy50aWNrID0gQUZSQU1FLnV0aWxzLnRocm90dGxlVGljayh0aGlzLmNoZWNrRGlzdCwgdGhpcy5kYXRhLnRocm90dGxlLCB0aGlzKTtcclxuICAgIHRoaXMuZW1pdGluZyA9IGZhbHNlO1xyXG4gIH0sXHJcbiAgY2hlY2tEaXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgbXlQb3MgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKTtcclxuICAgIGxldCB0YXJnZXRQb3MgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKTtcclxuICAgIHRoaXMuZWwub2JqZWN0M0QuZ2V0V29ybGRQb3NpdGlvbihteVBvcyk7XHJcbiAgICB0aGlzLmRhdGEudGFyZ2V0Lm9iamVjdDNELmdldFdvcmxkUG9zaXRpb24odGFyZ2V0UG9zKTtcclxuICAgIGNvbnN0IGRpc3RhbmNlVG8gPSBteVBvcy5kaXN0YW5jZVRvKHRhcmdldFBvcyk7XHJcbiAgICBpZiAoZGlzdGFuY2VUbyA8PSB0aGlzLmRhdGEuZGlzdGFuY2UpIHtcclxuICAgICAgaWYgKHRoaXMuZW1pdGluZykgcmV0dXJuO1xyXG4gICAgICB0aGlzLmVtaXRpbmcgPSB0cnVlO1xyXG4gICAgICB0aGlzLmVsLmVtaXQodGhpcy5kYXRhLmV2ZW50LCB7Y29sbGlkaW5nRW50aXR5OiB0aGlzLmRhdGEudGFyZ2V0fSwgZmFsc2UpO1xyXG4gICAgICB0aGlzLmRhdGEudGFyZ2V0LmVtaXQodGhpcy5kYXRhLmV2ZW50LCB7Y29sbGlkaW5nRW50aXR5OiB0aGlzLmVsfSwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKCF0aGlzLmVtaXRpbmcpIHJldHVybjtcclxuICAgICAgdGhpcy5lbC5lbWl0KHRoaXMuZGF0YS5ldmVudEZhciwge2NvbGxpZGluZ0VudGl0eTogdGhpcy5kYXRhLnRhcmdldH0sIGZhbHNlKTtcclxuICAgICAgdGhpcy5kYXRhLnRhcmdldC5lbWl0KHRoaXMuZGF0YS5ldmVudEZhciwge2NvbGxpZGluZ0VudGl0eTogdGhpcy5lbH0sIGZhbHNlKTtcclxuICAgICAgdGhpcy5lbWl0aW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdob3Zlci1oaWdobGlnaHRlcicsIHtcbiAgc2NoZW1hOiB7XG4gICAgY29sb3I6IHt0eXBlOiAnY29sb3InLCBkZWZhdWx0OiAnd2hpdGUnfVxuICB9LFxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHRhcmdldCA9IHRoaXMuZWw7XG4gICAgdGhpcy5oYW5kbGVyT25FbnRlciA9IGV2dCA9PiB0aGlzLm9uRW50ZXIoZXZ0KTtcbiAgICB0aGlzLmhhbmRsZXJPbkxlYXZlID0gZXZ0ID0+IHRoaXMub25MZWF2ZShldnQpO1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCB0aGlzLmhhbmRsZXJPbkVudGVyKTtcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgdGhpcy5oYW5kbGVyT25MZWF2ZSk7XG4gIH0sXG4gIG9uRW50ZXI6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBsZXQgY3Vyc29yID0gZXZ0LmRldGFpbC5jdXJzb3JFbDtcbiAgICB0aGlzLnNhdmVkQ29sb3IgPSBjdXJzb3IuZ2V0QXR0cmlidXRlKFwibWF0ZXJpYWxcIikuY29sb3I7XG4gICAgY3Vyc29yLnNldEF0dHJpYnV0ZShcIm1hdGVyaWFsXCIsIFwiY29sb3JcIiwgdGhpcy5kYXRhLmNvbG9yKTtcbiAgfSxcbiAgb25MZWF2ZTogZnVuY3Rpb24gKGV2dCkge1xuICAgIGxldCBjdXJzb3IgPSBldnQuZGV0YWlsLmN1cnNvckVsO1xuICAgIGN1cnNvci5zZXRBdHRyaWJ1dGUoXCJtYXRlcmlhbFwiLCBcImNvbG9yXCIsIHRoaXMuc2F2ZWRDb2xvcik7XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIGxldCB0YXJnZXQgPSB0aGlzLmVsO1xuICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCB0aGlzLmhhbmRsZXJPbkVudGVyKTtcbiAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgdGhpcy5oYW5kbGVyT25MZWF2ZSk7XG4gIH1cbn0pOyIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnbGlzdGVuLXRvJywge1xuICBtdWx0aXBsZTogdHJ1ZSxcbiAgc2NoZW1hOiB7XG4gICAgZXZ0OiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICdjbGljayd9LFxuICAgIHRhcmdldDoge3R5cGU6ICdzZWxlY3Rvcid9LFxuICAgIGVtaXQ6IHt0eXBlOiAnc3RyaW5nJ31cbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGF0YS50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRhdGEuZXZ0LCBldnQgPT4ge1xuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCh0aGlzLmRhdGEuZW1pdCkpO1xuICAgIH0pXG4gIH1cbn0pOyIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgndG9nZ2xlLWV2ZW50cycsIHtcbiAgbXVsdGlwbGU6IHRydWUsXG4gIHNjaGVtYToge1xuICAgIHNvdXJjZUV2dDoge3R5cGU6ICdzdHJpbmcnLCBkZWZhdWx0OiAnY2xpY2snfSxcbiAgICBldnQxOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgIGV2dDI6IHt0eXBlOiAnc3RyaW5nJ31cbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc3RhdGUgPSAwO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRhdGEuc291cmNlRXZ0LCBldnQgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUgPT0gMCkge1xuICAgICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KHRoaXMuZGF0YS5ldnQxKSlcbiAgICAgICAgdGhpcy5zdGF0ZSA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KHRoaXMuZGF0YS5ldnQyKSlcbiAgICAgICAgdGhpcy5zdGF0ZSA9IDA7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pOyIsIkFGUkFNRS5yZWdpc3RlclByaW1pdGl2ZSgnZ2QtYm94Jywge1xuICBkZWZhdWx0Q29tcG9uZW50czoge1xuICAgIGdkYm94OiB7fSxcbiAgfSxcbiAgbWFwcGluZ3M6IHtcbiAgICBzaXplOiAnZ2Rib3guc2l6ZScsXG4gICAgY29sb3I6ICdnZGJveC5jb2xvcidcbiAgfSxcbn0pO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2dkYm94Jywge1xuICBzY2hlbWE6IHtcbiAgICBzaXplOiB7IHR5cGU6ICdudW1iZXInLCBkZWZhdWx0OiAxIH0sXG4gICAgY29sb3I6IHsgdHlwZTogJ2NvbG9yJywgZGVmYXVsdDogJ2JsYWNrJyB9XG4gIH0sXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmdlblZlcnRpY2VzKCk7XG4gICAgdGhpcy5nZW5TaGFwZSgpO1xuICAgIHRoaXMuZ2VuR2VvbWV0cnkoKTtcbiAgICB0aGlzLmdlbk1hdGVyaWFsKCk7XG4gICAgdGhpcy5nZW5NZXNoKCk7XG4gIH0sXG4gIGdlblZlcnRpY2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgaGFsZlNpemUgPSB0aGlzLmRhdGEuc2l6ZSAvIDI7XG4gICAgdGhpcy52ZXJ0aWNlcyA9IFtdO1xuICAgIHRoaXMudmVydGljZXMucHVzaChuZXcgVEhSRUUuVmVjdG9yMigtaGFsZlNpemUsIGhhbGZTaXplKSk7XG4gICAgdGhpcy52ZXJ0aWNlcy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IyKGhhbGZTaXplLCBoYWxmU2l6ZSkpO1xuICAgIHRoaXMudmVydGljZXMucHVzaChuZXcgVEhSRUUuVmVjdG9yMihoYWxmU2l6ZSwgLWhhbGZTaXplKSk7XG4gICAgdGhpcy52ZXJ0aWNlcy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IyKC1oYWxmU2l6ZSwgLWhhbGZTaXplKSk7XG4gIH0sXG4gIGdlblNoYXBlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zaGFwZSA9IG5ldyBUSFJFRS5TaGFwZSgpO1xuICAgIHRoaXMuc2hhcGUubW92ZVRvKHRoaXMudmVydGljZXNbMF0ueCwgdGhpcy52ZXJ0aWNlc1swXS55KTtcbiAgICB0aGlzLnNoYXBlLmxpbmVUbyh0aGlzLnZlcnRpY2VzWzFdLngsIHRoaXMudmVydGljZXNbMV0ueSk7XG4gICAgdGhpcy5zaGFwZS5saW5lVG8odGhpcy52ZXJ0aWNlc1syXS54LCB0aGlzLnZlcnRpY2VzWzJdLnkpO1xuICAgIHRoaXMuc2hhcGUubGluZVRvKHRoaXMudmVydGljZXNbM10ueCwgdGhpcy52ZXJ0aWNlc1szXS55KTtcbiAgICB0aGlzLnNoYXBlLmxpbmVUbyh0aGlzLnZlcnRpY2VzWzBdLngsIHRoaXMudmVydGljZXNbMF0ueSk7XG4gIH0sXG4gIGdlbk1hdGVyaWFsOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IHRoaXMuZGF0YS5jb2xvciB9KTtcbiAgfSxcbiAgZ2VuR2VvbWV0cnk6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBleHRydWRlU2V0dGluZ3MgPSB7XG4gICAgICAgIHN0ZXBzOiAxLFxuICAgICAgICBkZXB0aDogdGhpcy5kYXRhLnNpemUsXG4gICAgICAgIGJldmVsRW5hYmxlZDogZmFsc2UsXG4gICAgfTtcbiAgICB0aGlzLmdlb21ldHJ5ID0gbmV3IFRIUkVFLkV4dHJ1ZGVHZW9tZXRyeSh0aGlzLnNoYXBlLCBleHRydWRlU2V0dGluZ3MpO1xuICB9LFxuICBnZW5NZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tZXRyeSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgdGhpcy5lbC5zZXRPYmplY3QzRCgnbWVzaCcsIHRoaXMubWVzaCk7XG4gIH1cbn0pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9jb21wb25lbnRzL2FuaW1hdGUtcm90YXRpb24nO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvY3Vyc29yLWxpc3RlbmVyJztcbmltcG9ydCAnLi9jb21wb25lbnRzL2hvdmVyLWhpZ2hsaWdodGVyJztcbmltcG9ydCAnLi9jb21wb25lbnRzL3RvZ2dsZS1ldmVudHMnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvbGlzdGVuLXRvJztcbmltcG9ydCAnLi9jb21wb25lbnRzL2VtaXQtd2hlbi1uZWFyJztcblxuXG5pbXBvcnQgJy4vcHJpbWl0aXZlL2dkLWJveCc7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9