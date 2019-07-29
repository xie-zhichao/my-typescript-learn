"use strict";
var fun;
(function (fun) {
    var User = (function () {
        function User(name) {
            this.name = name;
        }
        return User;
    }());
    fun.User = User;
})(fun || (fun = {}));
