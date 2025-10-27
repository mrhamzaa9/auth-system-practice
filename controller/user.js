const bcrypt = require('bcrypt');
const User = require("../model/user");
// const fs = require('fs');
// const path = require('path');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;
// const filePath = path.join(__dirname, '../data/users.json');

//  Read users from file
// function readUsers() {
//     try {
//         const data = fs.readFileSync(filePath, 'utf-8');
//         return JSON.parse(data || '[]');
//     } catch (err) {
//         console.error("Error reading users file:", err);
//         return [];
//     }
// }

// Write users to file
// function writeUsers(users) {
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
//     } catch (err) {
//         console.error("Error writing users file:", err);
//     }
// }

//  GET all users
const getUser =  async(req, res) => {
 const users = await User.find();  
    res.status(200).json(users);
};

//  SIGN UP
const addUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // const users = readUsers();

    // const existingUser = User.findOne({ email });
    // if (existingUser) {
    //     return res.status(400).json({ error: "User already exists" });
    // }
    const hashedPassword = await bcrypt.hash(password, 10)
    // const newUser = {
    //     name,
    //     email,
    //     password: hashedPassword
    // };
    newUser = new User({  name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", newUser });
};
// delete by id
const del = async (req, res) => {
     const id = req.params.id
     
    const user = await User.findByIdAndDelete(id); 
    // const userExists = users.find((u) => u.id === parseInt(req.params.id))
    if (!user) {
        res.status(404).send("This user does not exist.")
    }
    res.status(200).send("This user remove.")
    // else {
         
    //     // const filteredUsers = users.filter(u => u.id !== parseInt(req.params.id))
    //     // writeUsers(filteredUsers);
    //     // res.status(200).send({ message: "delted the user", newUserslist: filteredUsers })

    // }
}
//update 
const updateUser = (req, res) => {
    const users = readUsers();
    const user = users.find((u) => u.id === parseInt(req.params.id))
    if (!user) {
        -
        res.status(404).send("This user does not exist.")
    }

    user.name = req.body.name;
    user.email = req.body.email;
    writeUsers(user);
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });

    console.log("Generated Token:", token);
    res.status(201).json({ message: "User registered successfully", token })
}

//  LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;
    // const users = readUsers();

    // const user = users.find(u => u.email === email);
const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });

    console.log("Generated Token:", token);
    res.status(200).json({ message: "Login successful", token });
};

module.exports = { getUser, addUser, login, del, updateUser };
