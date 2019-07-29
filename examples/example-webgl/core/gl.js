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
