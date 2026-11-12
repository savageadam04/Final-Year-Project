const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

app.post("/api/login", async (req, res) => {
    
    //Get email and password sent by frontend
    const { email, password } = req.body;

    //Check both fields provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }
    try{
        //Find the user in the database using their email.
        const [users] = await pool.execute(
            "SELECT user_id, name, email, password_hash, role, is_active, must_change_password FROM dispatch_user WHERE email = ? LIMIT 1",
            [email]
        );

        //Check whether user exists.
        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        //Check whether user is account is active
        if (!user.is_active) {
            return res.status(403).json({
                message: "Account is inactive. Please contact the administrator."
            });
        }

        //Compare entered password with stored hash.
        const passwordMatch = await bcrypt.compare(
        password,
         user.password_hash
        );

        if(!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        //Generate a JWT token for the user
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        //Send succesful login response.
        res.json({
            message: "Login successful",
            token: token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                must_change_password: user.must_change_password
            }
        });
            
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            message: "An error occurred during login"
        });
    }

        });

//Start server 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});