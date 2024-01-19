const { getUsersModel } = require("../models/users.model");

exports.getUsersController = async (req, res, next) => {
  try {
    const users = await getUsersModel();
    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};
