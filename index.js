import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

let Essays = [];
let Books = [];
let Quotes = [];
let FAQs = [];

app.get("/", (req, res) => {
    res.render("index.ejs" , { currentPage: 'Home' });
});

app.post("/Essays", (req, res) => {
    const blogContent = req.body.blogContent;
    if(blogContent){
    Essays.push(blogContent);
    }
    res.render("Essays.ejs" , { currentPage: 'Essays', Essays: Essays  });
});

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

app.post("/Books", (req, res) => {
    const blogContent = req.body.blogContent;
    if(blogContent){
    Books.push(blogContent);
    }
    res.render("Books.ejs" , { currentPage: 'Books', Books: Books });
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