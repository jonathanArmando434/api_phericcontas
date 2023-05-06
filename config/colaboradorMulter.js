const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Defina o diretório onde os arquivos serão salvos
const currentDir = __dirname;
const parentDir = path.dirname(currentDir);
const uploadDirectory = path.join(parentDir, '/uploads/img/colaborador');

// Verifique se o diretório existe e, se não existir, crie-o
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure o multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const name = 'colaborador' + new Date() + path.extname(file.originalname)
    cb(null, name.replace(/\s+/g, ""));
  }
});

const upload = multer({ storage });

module.exports = upload;

