const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role_name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: null,
    },
    contact_number: {
      type: Number,
      default: null,
    },
  },
  { collection: "Users" }
);

userSchema.statics.signup = async function (
  name,
  email,
  password,
  role_name,
  contact_number
) {
  const user = await this.findOne({ email: email });
  if (user) {
    throw Error("Email already exits!!");
  }
  if (role_name === "Admin") {
    throw Error("You are not Authorized! to signup as a Admin");
  }
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password, salt);

  let newUser = {
    name: name,
    email: email,
    password: hashpassword,
    role_name: role_name,
    contact_number: contact_number,
  };
  const create_user = await this.create(newUser);
  return create_user;
};

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (!user) {
    throw Error("Email is not correct! try with another email");
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    throw Error("Password is incorrect!");
  }
  return user;
};
module.exports = mongoose.model("Users", userSchema);
