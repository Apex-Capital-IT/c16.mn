"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthHandler = void 0;
const basicAuth_1 = require("../middleware/basicAuth");
exports.adminAuthHandler = [
    basicAuth_1.basicAuth,
    (req, res, _next) => {
        res.status(200).json({ message: "Authenticated" });
    },
];
