const router = require("express").Router();

router.get("/", (req,res)=>{
    res.send("Auth routes")
});

module.exports = router;