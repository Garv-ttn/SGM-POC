let CFG = require("../models/cfg.model");

module.exports.getAll = async () => {
  return await CFG.find();
};

module.exports.getByType = async (type) => {
  return await CFG.find({ type });
};

module.exports.getOne = async (id) => {
  return await CFG.findById(id);
};

module.exports.addNew = async (data) => {
  try {
    if (data?.propositions?.length > 1) {
      const s = new Set();
      data.propositions.forEach(({ propId }) => {
        if (!s.has(propId)) s.add(propId);
        else
          throw {
            status: 400,
            message: "Propositions field should not contain dublicates",
          };
      });
    }

    const cfg = new CFG(data);
    return await cfg.save();
  } catch (error) {
    throw {
      status: error.status || 400,
      message: error.message,
    };
  }
};

module.exports.editOne = async (id, data) => {
  try {
    if (data?.propositions?.length > 1) {
      const s = new Set();
      data.propositions.forEach(({ propId }) => {
        if (!s.has(propId)) s.add(propId);
        else
          throw {
            status: 400,
            message: "Propositions field should not contain dublicates",
          };
      });
    }
    return await CFG.findByIdAndUpdate(id, { $set: data }, { new: true });
  } catch (error) {
    throw {
      status: error.status || 400,
      message: error.message,
    };
  }
};

module.exports.delete = async (id) => {
  return await CFG.findByIdAndDelete(id);
};
