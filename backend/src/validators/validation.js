const validator = require("validator");

const isignUpValidtion = (req) => {
    const { first_name, last_name, email, password, age, gender , skills} = req.body;

    const allowedGenders = ["male", "female", "other"];

    if (!first_name || !last_name || !email || !password) {
        throw new Error("First name, last name, email, and password are required.");
    }

    else if (!validator.isEmail(email)) {
        throw new Error("Invalid email format post.");
    }
    
    else if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1   
    })) {
        throw new Error("Password is not strong enough.");
    }

    else if (age && (!validator.isInt(age.toString(), { min: 0 }))) {
        throw new Error("Age must be a positive integer.");
    }

    else if (gender && !allowedGenders.includes(gender.toLowerCase())) {
        throw new Error("Invalid gender. Allowed values are male, female, or other.");
    }
    else if (skills) {
        // skills must be an array
        if (!Array.isArray(skills)) {
            throw new Error("Skills must be an array of strings.");
        }

        // limit number of skills
        if (skills.length > 5) {
            throw new Error("You can provide at most 5 skills.");
        }

        // ensure each skill is a non-empty string
        if (!skills.every(s => typeof s === 'string' && s.trim().length > 0)) {
            throw new Error("Each skill must be a non-empty string.");
        }
    }
};  

const validatedEditProfiledata = (req) => {
  const allowedValidateFields = [
    "first_name",
    "last_name",
    "email",
    "age",
    "gender",
    "skills",
    "photoURL",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((filed) =>
    allowedValidateFields.includes(filed)
  );

  return isEditAllowed;
};

module.exports = {
    isignUpValidtion,
    validatedEditProfiledata
};