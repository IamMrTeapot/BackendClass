/**
 * @swagger
 * components:
 *   schemas:
 *     Dentist:
 *       type: object
 *       required:
 *         - name
 *         - years_of_experience
 *         - area_of_expertise
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the dentist
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name:
 *           type: string
 *           description: Dentist name
 *         years_of_experience:
 *           type: string
 *           description: Years of experience
 *         area_of_expertise:
 *           type: string
 *           description: Area of expertise
 *       example:
 *         id: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name: คุณ ศุภรัตน์ สุขสวัสดิ์
 *         years_of_experience: 10
 *         area_of_expertise: ทันตกรรมเด็ก
 */

/**
 * @swagger
 * tags:
 *   name: Dentists
 *   description: The dentists managing API
 */

/**
 * @swagger
 * /dentists:
 *   get:
 *     summary: Returns the list of all the dentists
 *     tags: [Dentists]
 *     responses:
 *       200:
 *         description: The list of the dentists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dentist'
 */

/**
 * @swagger
 * /dentists/{id}:
 *   get:
 *     summary: Get the dentist by id
 *     tags: [Dentists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dentist id
 *     responses:
 *       200:
 *         description: The dentist description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dentist'
 *       400:
 *         description: The dentist was not found
 */

/**
 * @swagger
 * /dentists:
 *   post:
 *     summary: Creates a new dentist
 *     tags: [Dentists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dentist'
 *     responses:
 *       201:
 *         description: The dentist was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dentist'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /dentists/{id}:
 *   put:
 *     summary: Update a dentist by ID
 *     tags: [Dentists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dentist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dentist'
 *     responses:
 *       200:
 *         description: The dentist was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dentist'
 *       404:
 *         description: The dentist was not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /dentists/{id}:
 *   delete:
 *     summary: Delete a dentist by ID
 *     tags: [Dentists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dentist ID
 *     responses:
 *       200:
 *         description: The dentist was successfully deleted
 *       404:
 *         description: The dentist was not found
 */

const {
  getDentists,
  getDentist,
  createDentist,
  updateDentist,
  deleteDentist,
} = require("../controllers/dentists");
const appointmentRouter = require("./appointments");

const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:dentistId/appointments", appointmentRouter);

router
  .route("/")
  .get(getDentists)
  .post(protect, authorize("admin"), createDentist);
router
  .route("/:id")
  .get(getDentist)
  .put(protect, authorize("admin"), updateDentist)
  .delete(protect, authorize("admin"), deleteDentist);

module.exports = router;
