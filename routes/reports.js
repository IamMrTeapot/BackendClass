/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all reports
 *     description: Get all reports
 *     responses:
 *       200:
 *         description: A list of reports
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: "totalAppointments,totalDentists,dentistReports\n5,3,[{\"dentistName\":\"John Doe\",\"totalAppointments\":2},{\"dentistName\":\"Jane Doe\",\"totalAppointments\":3}]"
 *       500:
 *         description: Server error
 */

const express = require("express");
const router = express.Router();
const { getReports } = require("../controllers/reports");

router.route("/").get(getReports);

module.exports = router;
