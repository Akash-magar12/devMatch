const validator = require("validator");

const validateSignupData = (req) => {
  const { name, email, password } = req.body;

  //! Check if all fields exist and are not empty after trimming
  if (!name || validator.isEmpty(name.trim())) {
    throw new Error(" name is required");
  }

  if (!email || validator.isEmpty(email.trim())) {
    throw new Error("Email is required");
  }

  if (!password || validator.isEmpty(password.trim())) {
    throw new Error("Password is required");
  }

  // Validate email format
  if (!validator.isEmail(email.trim())) {
    throw new Error("Invalid email format");
  }

  // Password length check
  if (!validator.isLength(password, { min: 6 })) {
    throw new Error("Password must be at least 6 characters long");
  }
};

const validateLoginData = (req) => {
  const { email, password } = req.body;

  if (!email || validator.isEmpty(email.trim())) {
    throw new Error("Email is required");
  }

  if (!validator.isEmail(email.trim())) {
    throw new Error("Invalid email format");
  }

  if (!password || validator.isEmpty(password.trim())) {
    throw new Error("Password is required");
  }

  if (!validator.isLength(password.trim(), { min: 6 })) {
    throw new Error("Password must be at least 6 characters long");
  }
};

const validateEditProfile = (req) => {
  const data = req.body;

  const allowedEditFields = [
    "name",
    "gender",
    "age",
    "bio",
    "location",
    "profileImage",
    "techStack",
    "github",
    "linkedin",
    "portfolio",
  ];
  const isEditAllowed = Object.keys(data).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = { validateSignupData, validateLoginData, validateEditProfile };
