const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const pool = require("../config/database");

async function createInitialAdmin() {
    
    try {

    //Check if an admin user already exists
    const [existingAdmin] = await pool.execute(
        "SELECT user_id FROM dispatch_user WHERE role = ? LIMIT 1",
        ["system_admin"]
    );

    if (existingAdmin.length > 0) {
        console.log("A system admin already exists.");
        return;
    }

    //Generate a temporary password
    const temporaryPassword = crypto.randomBytes(12).toString("base64url");

    //Hash the password before storing it
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    //Create admin account
    await pool.execute(
        `INSERT INTO dispatch_user 
        (name, email, password_hash, role, is_active, must_change_password) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            "DispatchIQ Administrator",
            "admin@dispatchiq.local",
            passwordHash,
            "system_admin",
            true,
            true
        ]
    );

    console.log("Administrator account created successfully");
    console.log("Email: admin@dispatchiq.local");
    console.log("Temporary Password: " + temporaryPassword);
    console.log("Please change the password upon initial login.");

}catch (error) {

    console.error("Error creating administrator:", error.message);

}finally {

    await pool.end();

}
}

createInitialAdmin();