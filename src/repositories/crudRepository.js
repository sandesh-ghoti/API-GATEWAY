const AppError = require("../utils/errors/appError");
const { StatusCodes } = require("http-status-codes");

class CrudRepository {
  constructor(model) {
    this.model = model;
  }
  async create(data) {
    const res = await this.model.create(data);
    return res;
  }
  async destroy(data) {
    const res = await this.model.destroy({
      where: { id: data },
    });
    if (!res) {
      throw new AppError(`unable to find the resource`, StatusCodes.NOT_FOUND);
    }
    return res;
  }
  async get(data) {
    const res = await this.model.findByPk(data);
    if (res === undefined || res === null) {
      throw new AppError(`unable to find the resource`, StatusCodes.NOT_FOUND);
    }
    return res;
  }
  async getAll() {
    const res = await this.model.findAll();
    return res;
  }
  async update(id, data) {
    //data must be object
    const res = await this.model.update(data, {
      where: { id: id },
    });
    if (!res[0]) {
      throw new AppError(`unable to find the resource`, StatusCodes.NOT_FOUND);
    }
    return res;
  }
}
module.exports = CrudRepository;
