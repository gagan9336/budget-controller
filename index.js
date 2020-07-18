const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 1000;

app.get("/", (req, res) => {
    res.render("budget.ejs");
})

app.listen(port, () => {
    console.log(`Server is up to`, port);
})
