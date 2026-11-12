const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
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