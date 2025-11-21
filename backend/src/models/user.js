const mongoose =require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const {Schema} = mongoose;

const userSchema = Schema({
    first_name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email format" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password: " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 30
    },
    gender: {
        type: String,
        validate(value){
            if(!["Male", "Female", "Other"].includes(value)){
                throw new Error("Gender must be Male, Female, or Other");
            }
        }
    },
    photoURL: {
        type: String,
        default: "https://www.example.com/default-photo.jpg",
    },
    about: {
        type: String,
        default: "This is about me section.",
    },
    skills: {
        type: [String],
    }
},
{
    timestamps:true,
});

userSchema.methods.getJWT = async function (){
    const user  = this;

    const token = jwt.sign({ id: user._id }, "learn_nodejs", {
            expiresIn: "1h",
          });

    return token;
};


userSchema.methods.validationPassword = async function (inputPassword) {
    const user = this;
    const passwordHash = user.password;

    const  isPasswordvalid = await bcrypt.compare(inputPassword, passwordHash);

    return isPasswordvalid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;