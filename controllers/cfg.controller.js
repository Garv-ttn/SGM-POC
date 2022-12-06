const cfgService = require("../services/cfg.service.js");

const cache = new Map();

const fs = require("fs");
var path = require("path");

module.exports.getSports = async (req, res) => {
  let fileName = "sports.json";
  fs.readFile(`${path.resolve()}/mock_data/${fileName}`, (err, json) => {
    let obj = JSON.parse(json);
    res.json(obj);
  });
};

module.exports.getMatches = async (req, res) => {
  let { sportName, competitionName } = req.params;
  let fileName = `${sportName}-${competitionName}.json`;
  fs.readFile(`${path.resolve()}/mock_data/${fileName}`, (err, json) => {
    err && console.log(err);
    let obj = JSON.parse(json);
    res.json(obj);
  });
};

module.exports.getFromTournament = async (req, res) => {
  let { sportName, competitionName, tournamentName } = req.params;
  let fileName = `${sportName}-${competitionName}-${tournamentName}.json`;
  fs.readFile(`${path.resolve()}/mock_data/${fileName}`, (err, json) => {
    err && console.log(err);
    let obj = JSON.parse(json);
    res.json(obj);
  });
};
module.exports.getTournamentMarkets = async (req, res) => {
  let { sportName, competitionName, tournamentName, matchName } = req.params;
  let fileName = `${sportName}-${competitionName}-${tournamentName}-${matchName}.json`;
  fs.readFile(`${path.resolve()}/mock_data/${fileName}`, (err, json) => {
    err && console.log(err);
    let obj = JSON.parse(json);
    res.json(obj);
  });
};
module.exports.getMarkets = async (req, res) => {
  let { sportName, competitionName, matchName } = req.params;
  let fileName = `${sportName}-${competitionName}-${matchName}.json`;
  fs.readFile(`${path.resolve()}/mock_data/${fileName}`, (err, json) => {
    err && console.log(err);
    let obj = JSON.parse(json);
    res.json(obj);
  });
};

module.exports.getAll = async (req, res, next) => {
  try {
    let result = [];
    const { type } = req.query;

    if (cache.size > 0) {
      if (type) {
        for (let i of cache.values()) i.type == type && result.push(i);
      } else result = Array.from(cache.values());
      return res.send(result);
    }

    if (type) {
      result = await cfgService.getByType(type);
    } else {
      result = await cfgService.getAll();
    }

    res.send(result);
    result.forEach((data) => cache.set(data.id, data));
  } catch (error) {
    next(error);
  }
};

module.exports.getOne = async (req, res, next) => {
  try {
    if (cache.size > 0) {
      const result = cache.get(req.params.id);
      if (result) return res.send(result);
    }

    let result = await cfgService.getOne(req.params.id);
    res.send(result);
    result && cache.set(result.id, result);
  } catch (error) {
    cache.clear();
    next(error);
  }
};

module.exports.addNew = async (req, res, next) => {
  try {
    let cfg = await cfgService.addNew(req.body);
    res.send(cfg);
    cache.clear();
  } catch (error) {
    next(error);
  }
};

module.exports.editOne = async (req, res, next) => {
  try {
    let cfg = await cfgService.editOne(req.params.id, req.body);
    res.send(cfg);
    cache.clear();
  } catch (error) {
    cache.clear();
    next(error);
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    let result = await cfgService.delete(req.params.id);
    if (!result)
      throw {
        status: 500,
        message: "invalid id check if id exists with the record",
      };
    res.send(result);
    cache.delete(req.params.id);
  } catch (error) {
    cache.clear();
    next(error);
  }
};
