const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const logger = require("morgan");

dotenv.config({ path: "./config/config.env" });

connectDB();

const dentists = require("./routes/dentists");
const appointments = require("./routes/appointments");
const auth = require("./routes/auth");
const reports = require("./routes/reports");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use(limiter);
app.use(hpp());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Dentist Booking API",
      version: "1.0.0",
      description: "A simple API for booking appointments with dentists",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/api/v1/dentists", dentists);
app.use("/api/v1/appointments", appointments);
app.use("/api/v1/auth", auth);
app.use("/api/v1/reports", reports);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
