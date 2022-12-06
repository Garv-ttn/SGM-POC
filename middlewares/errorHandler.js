module.exports = (err, req, res) => {
  //console.log(err);
  if (!err.status) {
    res.status(500).send({
      error: { code: "UNKNOWN_ERROR", message: "An unknown error occurred." },
    });
  } else {
    res
      .status(err.status)
      .send({ error: { code: err.status, message: err.message } });
  }
};
