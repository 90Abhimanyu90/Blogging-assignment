/*const {Schema,model} = require ("mongoose");
const { createHmac,randomBytes } = require('crypto');
const userSchema = new Schema({
  fullName:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  salt:{
     type:String,
    
  },
  password:{
    type:String,
    required:true,
  },
  profileImageUrl:{
    type:String,
    default:"/images/images.png",
  },
  role:{
    type:String,
    enum:["USER","ADMIN"],
    default:"USER",
  },
},{timestamps:true}
);
userSchema.pre("save",function(next){
  const user = this;
  if(!user.isModified("password")) return ;
  const salt = "someRandomSalt";
  const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});
userSchema.static("matchPassword", async function(email,password){
  const user =  await this.findOne({email});
  if(!user) throw new Error("User not found");
  console.log(user);
  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedpassword = createHmac("sha256",salt).update(password).digest("hex");
  if(hashedPassword !== userProvidedpassword) throw new Error("Incorrect Password");
    return {...user,password:undefined,salt:undefined};
});
const user = model("user", userSchema);
module.exports = user;*/
/*const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createWebToken } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/images.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;
  next();
});

// Static method to match password
userSchema.static("matchPasswordAndGenerateToken"  , async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const userProvidedPassword = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (user.password !== userProvidedPassword)
    throw new Error("Incorrect Password");
  const token = createWebToken(user);
  return token;

  // Return safe object (hide password & salt)
  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.salt;

  return safeUser;
});

const User = model("User", userSchema);
module.exports = User;*/
const { Schema, model } = require("mongoose");
const { createHmac } = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  salt: { type: String },
  password: { type: String, required: true },
  profileImageUrl: { type: String, default: "/images/images.png" },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
}, { timestamps: true });

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = "someRandomSalt";  // fixed salt (acha hoga agar randomBytes use karo)
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const userProvidedPassword = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (user.password !== userProvidedPassword) {
    throw new Error("Incorrect Password");
  }


  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    "mysecretkey",              // secret key (env variable me rakho)
    { expiresIn: "1h" }         // token expiry
  );

  return token;
};

const User = model("user", userSchema);
module.exports = User;


