/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - telephone
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the dentist
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email
 *         role:
 *           type: string
 *           description: User's role
 *         password:
 *           type: string
 *           description: User's hashed password
 *         createdAt:
 *           type: Date
 *           description: User's creation date
 *       example:
 *         id: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name: คุณ ศุภรัตน์ สุขสวัสดิ์
 *         email: example.com
 *         role: user
 *         password: $2a$10$V4tj6ZVl7oX2Qm4Z8F9J2e2X9q5YJn3Qr9o0tZB8nXyqDxQ6B9O4K
 *         createdAt: 2021-07-01T00:00:00.000Z
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing API
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Creates a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             success: true
 *             _id: d290f1ee-6c54-4b01-90e6-d701748f0851
 *             name: คุณ ศุภรัตน์ สุขสวัสดิ์
 *             email: example.com
 *             token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             success: false
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login as user
 *     tags: [Users]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/User'
 *   responses:
 *     200:
 *       description: Login successful
 *       content:
 *         application/json:
 *           success: true
 *           token: eyJhb
 *     400:
 *       description: Bad Request
 *       content:
 *         application/json:
 *         success: false
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user details
 *     tags: [Users]
 *     description: Retrieves details of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             success: true
 *             data:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logs out current logged in user
 *     tags: [Users]
 *     description: Logs out the currently authenticated user.
 *   responses:
 *     200:
 *       description: OK
 */

const express = require("express");
const { register, login, getMe, logout } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", logout);

module.exports = router;
