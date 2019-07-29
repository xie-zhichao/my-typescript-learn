(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = require("./core/engine");
var _engine;
window.onload = function () {
    _engine = new engine_1.Engine();
    _engine.start();
};
window.onresize = function () {
    _engine.resize();
};

},{"./core/engine":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gl_1 = require("./gl");
var Engine = (function () {
    function Engine() {
        this.glContext = gl_1.WebGLUtils.initialize();
        this.loop = this.loop.bind(this);
        console.log('Engine is created.');
    }
    Engine.prototype.start = function () {
        var gl = this.glContext.gl;
        gl.clearColor(1, 0, 0, 1);
        this.loop();
    };
    Engine.prototype.loop = function () {
        var gl = this.glContext.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        requestAnimationFrame(this.loop);
    };
    Engine.prototype.resize = function () {
        var cavans = this.glContext.cavans;
        cavans.width = window.innerWidth;
        cavans.height = window.innerHeight;
    };
    return Engine;
}());
exports.Engine = Engine;

},{"./gl":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebGLUtils = (function () {
    function WebGLUtils() {
    }
    WebGLUtils.initialize = function (elementId) {
        var cavans;
        var gl;
        if (elementId !== undefined) {
            cavans = document.getElementById(elementId);
            if (cavans === null || cavans === undefined) {
                throw new Error("Can not find a cavans by id: " + elementId + "!");
            }
        }
        else {
            cavans = document.createElement('canvas');
            document.body.appendChild(cavans);
        }
        gl = (cavans.getContext('webgl') || cavans.getContext('experimental-webgl'));
        if (gl === undefined || gl === null) {
            throw new Error('Can not get webgl context!');
        }
        return {
            cavans: cavans,
            gl: gl
        };
    };
    return WebGLUtils;
}());
exports.WebGLUtils = WebGLUtils;
exports.default = WebGLUtils;

},{}]},{},[1]);
