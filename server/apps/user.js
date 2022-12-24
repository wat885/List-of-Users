import { Router } from "express";
import { pool } from "../utils/db.js";
import { validatetData, validatetUpdateData } from "../Middleware/user.validations.js";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    let q = req.query.q;
    const start = req.query.start || 1;
    const limit = req.query.limit || 10;

    const offset = (start - 1) * limit; // เริ่มstart

    console.log("offset", offset);
    console.log("q", q);

    let query = "";
    let values = [];
    let total = "";
    let total_page = "";

    if (q) {
      q = `%${q.toLowerCase()}%`;
      query = `select * from user_lists
    where name ilike $1 or
    email ilike $1
    ORDER BY user_id ASC 
    limit $2
    offset $3
    `;
      values = [q, limit, offset];

      let query2 = `select count(*) from user_lists
    where name ilike $1 or email ilike $1`;

      total = await pool.query(query2, [q]);
      total = total.rows[0].count;
      total_page = total / limit;
    } else {
      query = `select * from user_lists
      ORDER BY user_id ASC 
      limit $1
      offset $2
    `;
      values = [limit, offset];

      total = await pool.query(`select count(*) from user_lists`);
      total = total.rows[0].count;
      total_page = total / limit;
    }

    const results = await pool.query(query, values);

    return res.json({
      data: results.rows,
      total: total,
      total_page: total_page,
    });
  } catch (error) {
    console.log(error);
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const result = await pool.query(
      "select * from user_lists where user_id=$1",
      [id]
    );

    return res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/", [validatetData], async (req, res) => {
  const newUser = {
    ...req.body,
  };

  console.log(newUser);

  const result = await pool.query(
    `insert into user_lists (name, age, email, avatarUrl)
    values ($1, $2, $3, $4) RETURNING *`,
    [newUser.name, newUser.age, newUser.email, newUser.avatarUrl]
  );

  return res.json({
    data: result.rows[0],
    status: "success",
    message: "User has been created.",
  });
});

userRouter.put("/:id", [validatetUpdateData], async (req, res) => {
  const id = req.params.id;
  const editUser = {
    ...req.body,
  };

  console.log(editUser);

  const result = await pool.query(
    `UPDATE user_lists 
    SET name = $2,
    age = $3,
    email = $4,
    avatarUrl = $5
    WHERE user_id = $1
    RETURNING *`,
    [id, editUser.name, editUser.age, editUser.email, editUser.avatarUrl]
  );

  console.log(result.rows[0]);

  return res.json({
    data: result.rows[0],
    status: "success",
    message: "User has been updated.",
  });
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let status = "";

    console.log(id);
    const results = await pool.query(
      `DELETE FROM user_lists WHERE user_id =  $1 RETURNING *`,
      [id]
    );

    if (results.rows[0]) status = "success";
    else status = "failed";

    return res.json({
      message: `User ${id} has been deleted ${status}.`,
      status: status,
    });
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
