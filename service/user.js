const User = require("../models/User");

const Signup = async (name) => {
  try {
    // user_id에 해당하는 모든 카트를 찾음
    const savedUser = await User.create({ name });

    return savedUser;
  } catch (error) {
    return error;
  }
};

module.exports = {
  Signup,
};
