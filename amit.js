const express = require("express");
const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/register", (req, res) => {
    console.log("get query => ", req.query);
    var { title, price, description } = req.query;  // Use req.query instead of req.body
    if (!title || !price || !description) {
        return res.status(400).json({ message: 'Title, price, and description are required' });
    }
    res.send("standard GET response.");
});


app.post("/register", (req, res) => {
    
    console.log("post query => ",req.query);
    console.log("post body",req.body);
    return res.status(400).json({ message: 'Product ID is required' });

});

app.listen(port, () => {
    console.log(`listening to port ${port}`);
});