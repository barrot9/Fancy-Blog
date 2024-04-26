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
        const result = await db.query("SELECT * FROM posts");
        texts = result.rows;
        res.render("index.ejs" , { currentPage: 'Home' , Title: "Posts:", posts: texts, });
    }
    catch (err) {
        console.log(err);
    }
    
});

// app.post("/Posts", (req, res) => {
//     // const blogContent = req.body.blogContent;
//     // if(blogContent){
//     // Essays.push(blogContent);
//     // }
//     // res.render("Posts.ejs" , { currentPage: 'Essays', Essays: Essays  });

// });

app.post("/About", (req, res) => {
    res.render("About.ejs" , { currentPage: 'About' });
});

app.post("/FAQs", (req, res) => {
    const blogContent = req.body.blogContent;
    if(blogContent){
    FAQs.push(blogContent);
    }
    res.render("FAQs.ejs" , { currentPage: 'FAQs', FAQs: FAQs });
});


//let posts = [{ id: 1, title: "test" }];

app.post("/Books", async (req, res) => {
    try {
        //const result = await db.query("SELECT * FROM posts");
        //posts = result.rows;
    
        res.render("Books.ejs", {
          Title: "Today",
        });
      } catch (err) {
        console.log(err);
      }
});

app.post("/Quotes", (req, res) => {
    const blogContent = req.body.blogContent;
    if(blogContent){
    Quotes.push(blogContent);
    }
    res.render("Quotes.ejs" , { currentPage: 'Quotes', Quotes: Quotes });
});

// Handle deletion of the last post
app.post('/deleteEssays/:index', (req, res) => {
    const index = req.params.index; // Get the index of the post to be deleted
    Essays.splice(index, 1); // Remove the post from the posts array
    //const redirectUrl = req.body.redirect || '/';
    res.redirect('/'); // Redirect to the homepage to display the updated posts
});

app.post('/deleteBooks/:index', (req, res) => {
    const index = req.params.index; // Get the index of the post to be deleted
    Books.splice(index, 1); // Remove the post from the posts array
    res.redirect(`/`); // Redirect to the homepage to display the updated posts
});

app.post('/deleteQuotes/:index', (req, res) => {
    const index = req.params.index; // Get the index of the post to be deleted
    Quotes.splice(index, 1); // Remove the post from the posts array
    res.redirect(`/`); // Redirect to the homepage to display the updated posts
});

app.post('/deleteFAQs/:index', (req, res) => {
    const index = req.params.index; // Get the index of the post to be deleted
    FAQs.splice(index, 1); // Remove the post from the posts array
    res.redirect(`/`); // Redirect to the homepage to display the updated posts
});

app.get('/edit/:index', (req, res) => {
    const index = req.params.index;
    const postToEdit = Essays[index];
    res.render('edit.ejs', { index: index, post: postToEdit });
});

app.post('/edit/:index', (req, res) => {
    const index = req.params.index;
    const updatedPost = req.body.updatedPost; // Assuming the form field name is "updatedPost"
    Essays[index] = updatedPost; // Update the post content in the array
    res.redirect('/'); // Redirect to the homepage to display the updated posts
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});