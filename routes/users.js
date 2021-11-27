const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


// @desc    Get user details
// @route   POST /api/user/
// @access  Private
router.get("/:id", async (req, res)=> {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

// @desc    Update user
// @route   POST /api/user/:id
// @access  Private
router.put("/:id", async (req, res) => {
    // Authorized only isAdmin or account owner
    if (req.body.userID === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has updated")
        } catch (err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("Unauthorized user to take this action")
    }
});

// @desc    Delete user
// @route   DELETE /api/user/:id
// @access  Private
router.delete("/:id", async (req, res) => {
    // Authorized only isAdmin or account owner
    if (req.body.userID === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete({_id: req.params.id});
            res.status(200).json("Account has been deleted")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("Unauthorized user to take this action")
    }
})

module.exports = router;