import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

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

app.get("/", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM posts ORDER BY post_id ASC");
        texts = result.rows;
        res.render("index.ejs" , { currentPage: 'Home' , Title: "Posts:", posts: texts, });
    }
    catch (err) {
        console.log(err);
    }
    
});

app.post("/add", async (req, res) => {
    const item = req.body.newItem;
    try {
      await db.query("INSERT INTO posts (post_content) VALUES ($1)", [item]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
});

app.post("/edit", async (req, res) => {
    const item = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;
    try {
      await db.query("UPDATE posts SET post_content = ($1) WHERE post_id = $2", [item, id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
});

app.post("/delete", async (req, res) => {
    const id = req.body.deleteItemId;
    try {
      await db.query("DELETE FROM posts WHERE post_id = $1", [id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
});

app.post("/About", (req, res) => {
    res.render("About.ejs" , { currentPage: 'About' });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});