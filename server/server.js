//dot env
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db/index.js");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

app.listen(4000, () => {
  console.log(`Server running on port 4000`);
});

//get all list of managers from database
app.get("/manager", async (req, res) => {
  // const { adminEmail } = req.params;
  // console.log(adminEmail);
  try {
    const response = await db.query(`select * from manager_info`);
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
// delete manager from database
app.delete("/manager/:id", async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  try {
    const response = await db.query(
      `delete from manager_info where manager_id = ${id}`
    );
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

//add manager to database
app.post("/manager", async (req, res) => {
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

//checking for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Use parameterized query to prevent SQL injection
    const queryText = "SELECT * FROM manager_login WHERE username = $1";
    const { rows } = await db.query(queryText, [email]);

    if (rows.length > 0) {
      const user = rows[0];

      // Compare provided password with hashed password in the database
      const isValid = password === user.password;

      if (isValid) {
        const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
        res.status(200).json({ email, token });
      } else {
        // Invalid password
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      // No user found with the provided email
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: error.detail });
  }
});
