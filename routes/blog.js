const {Router} = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = Router();


const uploadPath = path.join(__dirname, "../public/uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });



 
router.get("/add-new",(req,res)=>{
  return  res.render("addBlog",{
    user: req.user,
  });
});
router.post("/", upload.single("coverImage"),(req,res)=>{
  console.log(req.body);
  console.log(req.file);
  return res.redirect("/");

});


module.exports = router;