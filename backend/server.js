const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

//Test Route for express
app.post("/api/test-registration", (req, res) => {

    //Recieve the information from fronted
    const { name, email, role } = req.body;

    //Check all fields are filled
    if (!name || !email || !role) {
        return res.status(400).json({
             message: "All fields are required"
             });
            } 
    //Send a response back to the frontend
    res.status(200).json({
        message: "Registration details received successfully" + "\nName: " + name + "\nEmail: " + email + "\nRole: " + role,
        received: {
            name,
            email,
            role
        }
    });
});


// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

//Test API and database connection
app.get("/api/health", async (req, res) => {
try{
    await pool.query("SELECT 1");      
    
    res.json({

    status: "ok",
    database: "dispatchiq"
 });
//Error handling for database connection issues
} catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
        status: "error",
        message: "Database connection failed"
         });
        }
});

//Start server 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});