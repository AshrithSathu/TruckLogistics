// Import necessary modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db/index.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Initialize express app
const app = express();

// Use middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Start server
app.listen(4000, () => {
  console.log("Server running on port 4000");
});

// Get all list of managers from database with new route
app.get("/admin/manager", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM manager_info");
    res.status(200).json({
      status: "success",
      results: response.rows.length,
      data: {
        manager: response.rows,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data from database");
  }
});

// Delete manager from database with new route
app.delete("/admin/manager/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await db.query(
      `DELETE FROM manager_info WHERE manager_id = ${id}`
    );
    res.status(200).json({
      status: "success",
      message: "Manager deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting data from database");
  }
});

// Add manager to database with new route
app.post("/admin/manager", async (req, res) => {
  const {
    managerId,
    name,
    gender,
    contactNumber,
    aadhaarNumber,
    email,
    branch,
    salary,
    joiningDate,
  } = req.body;
  try {
    const queryText =
      "INSERT INTO manager_info VALUES($1, $2, $3, $4, $5, $6, $7 , $8, $9)";
    const queryParams = [
      managerId,
      name,
      gender,
      contactNumber,
      aadhaarNumber,
      email,
      branch,
      joiningDate,
      salary,
    ];
    const response = await db.query(queryText, queryParams);
    res.status(200).json({
      status: "success",
      message: "Manager added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding data to database");
  }
});

// Login route remains unchanged as it's not specific to managers only
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const queryText = "SELECT * FROM manager_login WHERE username = $1";
    const { rows } = await db.query(queryText, [email]);
    if (rows.length > 0) {
      const user = rows[0];
      const isValid = password === user.passwords; // For plain text comparison
      if (isValid) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({ email, token });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: error.detail });
  }
});

// everything for manager data from now on
//get all drivers
app.get("/manager/getAllDriver/:email", async (req, res) => {
  try {
    const managerEmail = req.params.email; // Extract email from request body
    console.log(managerEmail);
    if (!managerEmail) {
      return res.status(400).send("Manager email is required");
    }

    const managerResponse = await db.query(
      "SELECT manager_id FROM manager_login WHERE username = $1",
      [managerEmail]
    );
    // console.log(managerResponse);
    if (managerResponse.rows.length === 0) {
      return res.status(404).send("Manager not found");
    }
    const managerId = managerResponse.rows[0].manager_id;

    const response = await db.query(
      "SELECT * FROM driver_info WHERE manager_id = $1",
      [managerId]
    );
    res.status(200).json({
      status: "success",
      results: response.rows.length,
      data: {
        driver: response.rows,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data from database");
  }
});
