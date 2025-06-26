"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuth = basicAuth;
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
function basicAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        res.status(401).send("Authentication required.");
        return;
    }
    else {
        const base64Credentials = authHeader.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
        const [username, password] = credentials.split(":");
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            return next();
        }
        res.status(401).send("Invalid credentials.");
    }
}
