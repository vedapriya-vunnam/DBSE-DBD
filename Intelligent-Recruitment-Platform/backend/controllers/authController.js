const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");

// REGISTER
const registerUser = async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            role,
            phone
        } = req.body;

        // Check required fields
        if (!full_name || !email || !password || !role) {
            return res.status(400).json({
                message: "Please provide full name, email, password and role"
            });
        }

        // Check role
        if (role !== "candidate" && role !== "recruiter") {
            return res.status(400).json({
                message: "Role must be candidate or recruiter"
            });
        }

        // Check existing email
        const [existingUsers] = await db.promise().query(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.promise().query(
            `INSERT INTO users 
            (full_name, email, password_hash, role, phone)
            VALUES (?, ?, ?, ?, ?)`,
            [
                full_name,
                email,
                passwordHash,
                role,
                phone || null
            ]
        );

        // Create profile based on role
        if (role === "candidate") {
            await db.promise().query(
                `INSERT INTO candidate_profiles (user_id)
                 VALUES (?)`,
                [result.insertId]
            );
        } else {
            // Recruiter company name will be updated later
            await db.promise().query(
                `INSERT INTO recruiter_profiles 
                (user_id, company_name)
                VALUES (?, ?)`,
                [result.insertId, "Company Not Added"]
            );
        }

        // Generate JWT
        const token = generateToken(result.insertId, role);

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                user_id: result.insertId,
                full_name,
                email,
                role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// LOGIN
const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const [users] = await db.promise().query(
            `SELECT 
                user_id,
                full_name,
                email,
                password_hash,
                role,
                phone,
                is_active
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Check active status
        if (!user.is_active) {
            return res.status(403).json({
                message: "Your account is inactive"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(
            user.user_id,
            user.role
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};