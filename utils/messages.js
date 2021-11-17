module.exports = {
  required: (value) => `${value} is required!!!`,
  unAuthorization: (value) => `UnAuthorization!!!`,
  noLike: (value) => `Not allowed!!!`,
  noUser: (value) => `User doesn't exist`,
  userAlreadyExist: (value) => `Username is already taken!!!`,
  incorrectEmailOrPassword: (value) => `Incorrect username or password!!!`
};
