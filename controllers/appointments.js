const Appointment = require("../models/Appointment");
const Dentist = require("../models/Dentist");

//@desc     Get all appointments
//@route   GET /api/v1/appointments
//@access  Public
exports.getAppointments = async (req, res, next) => {
  let query;
  //General users can only view their appointments
  if (req.user.role !== "admin") {
    query = Appointment.find({ user: req.user.id }).populate({
      path: "dentist",
      select: "name years_of_experience area_of_expertise",
    });
  } else {
    if (req.params.dentistId) {
      console.log(req.params.dentistId);
      query = Appointment.find({ dentist: req.params.dentistId }).populate({
        path: "dentist",
        select: "name years_of_experience area_of_expertise",
      });
    } else
      query = Appointment.find().populate({
        path: "dentist",
        select: "name years_of_experience area_of_expertise",
      });
  }

  try {
    const appointments = await query;
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};

//@desc     Get single appointment
//@route    GET /api/v1/appointments/:id
//@access   Public
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: "dentist",
      select: "name years_of_experience area_of_expertise",
    });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};

//@desc     Add appointment
//@route    POST /api/v1/dentists/:dentistId/appointment
//@access   Private
exports.addAppointment = async (req, res, next) => {
  try {
    req.body.dentist = req.params.dentistId;
    req.body.user = req.user.id;

    const existedAppointment = await Appointment.find({ user: req.user.id });

    if (existedAppointment.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} already made 3 appointments.`,
      });
    }

    const dentist = await Dentist.findById(req.params.dentistId);

    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `No dentist with id of ${req.params.dentistId}`,
      });
    }

    const appointment = await Appointment.create(req.body);
    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Cannot create Appointment" });
  }
};

//@desc     Update appointment
//@route    PUT /api/v1/appointments/:id
//@access   Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with id of ${req.params.id}`,
      });
    }

    // Make sure user is appointment owner
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this appointment`,
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Cannot update Appointment" });
  }
};

//@desc     Delete appointment
//@route    DELETE /api/v1/appointments/:id
//@access   Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with id of ${req.params.id}`,
      });
    }

    // Make sure user is appointment owner
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this appointment`,
      });
    }

    await appointment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Cannot delete Appointment" });
  }
};
