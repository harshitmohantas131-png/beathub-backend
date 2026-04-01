const userToDTO = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
};

module.exports = { userToDTO };