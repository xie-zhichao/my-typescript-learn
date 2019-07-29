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
