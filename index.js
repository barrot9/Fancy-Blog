import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcrypt";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "FancyBlog",
    password: "a123456",
    port: 5432,
});

db.connect();

let texts = [
    { post_id: 1, post_content: "test1" },
    { post_id: 2, post_content: "test2" },
  ];

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/index", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM posts ORDER BY post_id ASC");
        texts = result.rows;
        res.render("index.ejs" , { currentPage: 'Home' , Title: "Posts:", posts: texts, });
    }
    catch (err) {
        console.log(err);
    }
});

app.get("/About", (req, res) => {
  res.render("About.ejs" , { currentPage: 'About' });
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          await db.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [email, hash]
          );
          res.redirect("/index");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      //verifying the password
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            res.redirect("/index");
          } else {
            res.send("Incorrect Password");
          }
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
    const item = req.body.newItem;
    try {
      await db.query("INSERT INTO posts (post_content) VALUES ($1)", [item]);
      res.redirect("/index");
    } catch (err) {
      console.log(err);
    }
});

app.post("/edit", async (req, res) => {
    const item = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;
    try {
      await db.query("UPDATE posts SET post_content = ($1) WHERE post_id = $2", [item, id]);
      res.redirect("/index");
    } catch (err) {
      console.log(err);
    }
});

app.post("/delete", async (req, res) => {
    const id = req.body.deleteItemId;
    try {
      await db.query("DELETE FROM posts WHERE post_id = $1", [id]);
      res.redirect("/index");
    } catch (err) {
      console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});