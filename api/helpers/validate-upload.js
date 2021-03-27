const path = require("path");

module.exports = {
  friendlyName: "Validate upload",

  description: "",

  inputs: {
    files: {
      type: "ref",
      required: true,
    },

    max: {
      type: "number",
      required: false,
    },

    validateNoImage: {
      type: "boolean",
      required: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ files, max, validateNoImage }) {
    max = max || 6;
    validateNoImage = validateNoImage || false;
    files = Array.from(files);

    const uploadedFileLength = files && files.length;

    if (uploadedFileLength <= 0 && validateNoImage) {
      throw { msg: "No file was uploaded" };
    }

    if (uploadedFileLength > max) {
      files.forEach(async (item) => {
        const fileName = path.parse(item.fd).base;
        const filePath = path.resolve(`assets/uploads/${fileName}`);
        return await sails.rm(filePath);
      });
      throw { msg: `The maximum number of ${max} images has been uploaded` };
    }

    // get base name of all files
    const filesBaseName = files.map((file) => path.parse(file.fd).base);

    return filesBaseName;
  },
};
