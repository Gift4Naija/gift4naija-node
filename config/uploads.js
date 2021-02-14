const path = require("path");

module.exports.uploads = {
  /**************************************************************************
   * The upload directory.                                                   *
   **************************************************************************/
  // dirpath: "asset/uploads",
  dirname: path.resolve("assets/uploads"),
  adapter: require("skipper-disk"),
};
