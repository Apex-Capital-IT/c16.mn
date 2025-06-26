"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuthController_1 = require("../controllers/adminAuthController");
const router = (0, express_1.Router)();
router.post("/admin-auth", ...adminAuthController_1.adminAuthHandler);
exports.default = router;
