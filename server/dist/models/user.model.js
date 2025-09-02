"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const base_model_1 = require("./base.model");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["TECHNICIAN"] = "technician";
    UserRole["CLIENT"] = "client";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User extends base_model_1.BaseModel {
    username;
    email;
    passwordHash(password, passwordHash) {
        throw new Error("Method not implemented.");
    }
    id;
    role;
    static findById(userId) {
        throw new Error("Method not implemented.");
    }
};
exports.User = User;
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
