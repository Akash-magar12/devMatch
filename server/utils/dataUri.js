// Importing the DatauriParser class from the 'datauri' library
const DatauriParser = require("datauri/parser.js");

// Importing 'path' module to handle file extensions
const path = require("path");

// This function takes a file object (from multer) and converts it to a Data URI format
const getDataUri = (file) => {
  // Creating a new instance of the DatauriParser
  const parser = new DatauriParser();

  // Extracting the file extension (e.g., '.jpg', '.png') from the original filename
  const extName = path.extname(file.originalname).toString();

  // Returning the result of parser.format which includes the Data URI
  // file.buffer contains the actual image data in memory
  return parser.format(extName, file.buffer);
};

// Exporting the function so it can be used in other files
module.exports = getDataUri;
