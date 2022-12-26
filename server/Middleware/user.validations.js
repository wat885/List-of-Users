import { pool } from "../utils/db.js";
export async function validatetData(req, res, next) {
  console.log(req.body);

  if (typeof req.body.age == "number" && req.body.age > 0) {
    console.log("age pass");
  } else {
    console.log("age not a number.");
    return res.status(400).json({
      status: "age not a number",
      message: `age not a number.`,
    });
  }

  if (pattern.test(req.body.email)) {
    console.log("email pass");
  } else {
    console.log("Please Enter a valid email.");
    return res.status(400).json({
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
    return res.status(400).json({
      status: "duplicate",
      message: `Email ${req.body.email} is duplicate.`,
    });
  }
}

const pattern =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export async function validatetUpdateData(req, res, next) {
  const id = req.params.id;
  console.log(req.body);

  if (typeof req.body.age == "number" && req.body.age > 0) {
    console.log("age pass");
  } else {
    console.log("age not a number.");
    return res.status(400).json({
      status: "age not a number",
      message: `age not a number.`,
    });
  }

  if (pattern.test(req.body.email)) {
    console.log("email pass");
  } else {
    console.log("Please Enter a valid email.");
    return res.status(400).json({
      status: "emailNotValid",
      message: `Please Enter a valid email.`,
    });
  }

  const result = await pool.query(
    `  select * from user_lists
      where email = $1`,
    [req.body.email]
  );

  const oldemail = await pool.query(
    `  select * from user_lists
      where user_id = $1`,
    [id]
  );

  // console.log("result", result.rows[0].email);
  // console.log("oldemail", oldemail.rows[0].email);

  if (!result.rows[0]) {
    console.log("email is not duplicate.");
    next();
  } else {
    // check current email
    if (result.rows[0].email === oldemail.rows[0].email) {
      console.log("old email email is not duplicate. ");
      next();
    } else {
      console.log(`Email ${req.body.email} is duplicate.`);
      return res.status(400).json({
        status: "duplicate",
        message: `Email ${req.body.email} is duplicate.`,
      });
    }
  }
}
