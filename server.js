require('dotenv').config();
const {PORT = 3000, DATABASE_URL} = process.env;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// IMPORT MIDDLEWARE
const cors = require('cors');
const morgan = require('morgan');

// DATABASE CONNECTION
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// CONNECTION EVENTS
mongoose.connection
.on("open", () => console.log("MongoDB database connection established"))
.on("error", (err) => console.log(err))
.on("close", () => console.log("MongoDB database connection closed"));

// MODELS 
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model('Cheese', CheeseSchema);

// MIDDLEWARE
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ROUTES
// test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// CHEESE INDEX ROUTE
app.get("/cheeses", async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (err) {
        res.status(500).json(err);
    }
});

// CHEESE CREATE ROUTE
app.post("/cheeses", async (req, res) => {
    try {
    res.json(await Cheese.create(req.body));
    } catch (err) {
        res.status(500).json(err);
    }
});

// CHEESE SHOW ROUTE
app.get("/cheeses/:id", async (req, res) => {
    try {
        const cheese = await Cheese.findById(req.params.id);
        res.json(cheese);
    } catch (err) {
        res.status(500).json({err});
    }
});

// CHEESE UPDATE ROUTE
app.put("/cheeses/:id", async (req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )
        );
        } catch (err) {
        res.status(500).json(err);
    }
        
    });

// CHEESE DELETE ROUTE
app.delete("/cheeses/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (err) {
        res.status(500).json(err);
    }
});

// LISTENER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});