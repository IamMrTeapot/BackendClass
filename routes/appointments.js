/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - appointmentDate
 *         - user
 *         - dentist
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the appointment
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         appointmentDate:
 *           type: Date
 *           description: Appointment's date
 *         user:
 *           type: string
 *           format: uuid
 *           description: User's id
 *         dentist:
 *           type: string
 *           format: uuid
 *           description: Appointments's id
 *         createdAt:
 *           type: Date
 *           description: Appointment's creation date
 *       example:
 *         id: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         appointmentDate: 2021-07-01T00:00:00.000Z
 *         user: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         dentist: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         createdAt: 2021-07-01T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: The appointment managing API
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Returns the list of all the appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: The list of the appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get the appointment by id
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The appointment id
 *     responses:
 *       200:
 *         description: The appointment description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: The appointment was not found
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Creates a new appointment
 *     security:
 *       - bearerAuth: []
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: The appointment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update a appointment by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: The appointment was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: The appointment was not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete a appointment by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The appointment ID
 *     responses:
 *       200:
 *         description: The appointment was successfully deleted
 *       404:
 *         description: The appointment was not found
 */

const express = require("express");
const {
  getAppointments,
  getAppointment,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointments");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getAppointments)
  .post(protect, authorize("admin", "user"), addAppointment);
router
  .route("/:id")
  .get(protect, getAppointment)
  .put(protect, authorize("admin", "user"), updateAppointment)
  .delete(protect, authorize("admin", "user"), deleteAppointment);

module.exports = router;
