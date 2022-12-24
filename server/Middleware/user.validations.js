import { pool } from "../utils/db.js";
export async function validatetData(req, res, next) {
  console.log(req.body);

  if (typeof req.body.age == "number" && req.body.age > 0) {
    console.log("age pass");
  } else {
    console.log("age not a number.");
    return res.json({
      status: "age not a number",
      message: `age not a number.`,
    });
  }

  if (pattern.test(req.body.email)) {
    console.log("email pass");
  } else {
    console.log("Please Enter a valid email.");
    return res.json({
      status: "emailNotValid",
      message: `Please Enter a valid email.`,
    });
  }

  const result = await pool.query(
    `  select * from user_lists
    where email = $1`,
    [req.body.email]
  );

  if (!result.rows[0]) {
    console.log("email is not duplicate.");
    next();
  } else {
    console.log(`Email ${req.body.email} is duplicate.`);
    return res.json({
      status: "duplicate",
      message: `Email ${req.body.email} is duplicate.`,
    });
  }
}

const pattern =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
