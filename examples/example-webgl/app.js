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
