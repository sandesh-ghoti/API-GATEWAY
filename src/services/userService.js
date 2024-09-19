const { UserRepository, RoleRepository } = require("../repositories");
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const AppError = require("../utils/errors/appError");
const { StatusCodes } = require("http-status-codes");
const { RoleEnum } = require("../utils/common");
const { User_Role } = require("../models");
const { Op } = require("sequelize");
const {
  hashPassword,
  comparePassword,
  validPassword,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/common/auth");
const { where } = require("sequelize");
async function signup(data) {
  try {
    //if emailid not exists then create
    if (await userRepository.getUserByEmail(data.email)) {
      throw new AppError(["user already exits"], StatusCodes.BAD_REQUEST);
    }
    //validate password
    if (!validPassword(data.password)) {
      throw new AppError(
        ["password not fullfilling requirement"],
        StatusCodes.BAD_REQUEST
      );
    }
    //hash password
    data.password = await hashPassword(data.password);
    const user = await userRepository.create(data);
    user.password = "*******";
    const role = await roleRepository.getRoleByName(RoleEnum.CUSTOMER);
    if (!role) {
      throw new AppError(["role not found"], StatusCodes.NOT_FOUND);
    }
    user.addRole(role); // this is assocition method for many to many add+modelname provided by sequelize https://sequelize.org/docs/v6/core-concepts/assocs/#foobelongstomanybar--through-baz-
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else if (error.name == "TypeError") {
      throw new AppError(
        ["unable to signup"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } else if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((e) => {
        explanation.push(e.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name == "SequelizeForeignKeyConstraintError") {
      console.log(error);
      throw new AppError(
        [
          "ForeignKey Constraint Error please provide valid ${add here which foregin key has error}",
        ],
        StatusCodes.BAD_REQUEST
      );
    }
    throw new AppError(["unable to signup"], StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
async function signin(data) {
  try {
    //if emailid not exists then create
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(["user not found"], StatusCodes.NOT_FOUND);
    }
    //validate password
    let result = await comparePassword(data.password, user.password);
    console.log(result);
    if (!result) {
      throw new AppError(["password not match"], StatusCodes.BAD_REQUEST);
    }
    user.password = data.password;
    let accessToken = generateAccessToken({ id: user.id });
    let refreshToken = generateRefreshToken({ id: user.id });
    return { user, accessToken, refreshToken };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else if (error.name == "TypeError") {
      throw new AppError(
        ["unable to sign in"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } else if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((e) => {
        explanation.push(e.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name == "SequelizeForeignKeyConstraintError") {
      console.log(error);
      throw new AppError(
        [
          "ForeignKey Constraint Error please provide valid ${add here which foregin key has error}",
        ],
        StatusCodes.BAD_REQUEST
      );
    }
    throw new AppError(
      ["unable to sign in"],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function addRoleToUser(data) {
  try {
    const role = await roleRepository.get(data.roleId);
    if (!role) {
      throw new AppError(["role not found"], StatusCodes.NOT_FOUND);
    }
    const user = await userRepository.get(data.userId);
    if (!user) {
      throw new AppError(["user not found"], StatusCodes.NOT_FOUND);
    }
    await user.addRole(role);
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ["unable to add role to user"],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function isAdmin(user) {
  try {
    const adminRole = await roleRepository.getRoleByName(RoleEnum.ADMIN);
    if (!adminRole) {
      throw new AppError(["admin role not found"], StatusCodes.NOT_FOUND);
    }
    const newuser = await userRepository.get(user.id);

    if (!newuser) {
      throw new AppError(["user not found"], StatusCodes.NOT_FOUND);
    }
    console.log('checking is user admin');
    const role = await User_Role.findOne({
      where: { [Op.and]: [{ userId: newuser.id, roleId: adminRole.id }] },
    });
    if (!role) {
      console.log('user is not admin')
      throw new AppError(["user is not admin"], StatusCodes.NOT_FOUND);
    }
    return newuser;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ["unable to check user is admin"],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getAllUser() {
  try {
    const users = await userRepository.getAll();
    if (!users) {
      throw new AppError(["no users found"], StatusCodes.NOT_FOUND);
    }
    return users;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ["unable to find user"],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getAllRoles() {
  try {
    const users = await roleRepository.getAll();
    if (!users) {
      throw new AppError(["no roles found"], StatusCodes.NOT_FOUND);
    }
    return users;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ["unable to find roles"],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
module.exports = { signup, signin, addRoleToUser, isAdmin ,getAllUser,getAllRoles};
