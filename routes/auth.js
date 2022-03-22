const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// For Test //
// router.get("/register", async (req,res)=>{
//     const user = await new User({
//         username: "John",
//         email: "john@email.com",
//         password: "test123*"
//     });

//     await user.save();
//     res.send("Saved")
// });

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        });
    
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        console.log(err);
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req,res)=>{
    try{
        // find email
        const userDetails = await User.findOne({ email: req.body.email });
        !userDetails && res.status(404).json("User not found");

        // compare request with DB
        const validPwd = await bcrypt.compare(req.body.password, userDetails.password);
        !validPwd && res.status(400).json("Wrong email or password");

        res.status(200).json(userDetails);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;