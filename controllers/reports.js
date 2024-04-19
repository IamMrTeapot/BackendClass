const Appointment = require("../models/Appointment");
const Dentist = require("../models/Dentist");
const { Parser } = require("@json2csv/plainjs");

//@desc     Get all reports
//@route    GET /api/v1/reports
//@access   Public
exports.getReports = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    const dentists = await Dentist.find();

    const reportData = [];

    for (let dentist of dentists) {
      const dentistAppointments = await Appointment.find({
        dentist: dentist._id,
      });
      reportData.push({
        dentistName: dentist.name,
        totalAppointmentsOfEachDentist: dentistAppointments.length,
      });
    }
    if (reportData.length >= 0) {
      reportData[0] = {
        ...reportData[0],
        totalAppointments: appointments.length,
        totalDentists: dentists.length,
      };
    }

    const opts = {};
    const parser = new Parser(opts);
    const csv = parser.parse(reportData);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=report.csv");
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
