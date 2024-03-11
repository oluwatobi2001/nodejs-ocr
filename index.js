const express =  require("express");
const app = express()
const multer  = require("multer")
const tesseract  =  require("node-tesseract-ocr");
const path= require("path");
const cors = require("cors");


app.use(cors({
    origin: 'http://localhost:5173',
    mathods: ['GET', 'POST']
    }))

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null,     file.originalname )
    },
  
})

const upload = multer({
    storage: storage
})
;
const config = {
    lang: 'eng',
    oem: 1,
    psm: 3
}
app.post("/img-upload", upload.single('file'), (req, res) => {
    const file  = req.file.filename;
    tesseract.recognize(`uploads/${file}`, config).then((text) => {
        console.log("text: " + text);
        res.status(200).json(text)
    }).catch((err) => {
        console.log(err)
        res.status(500).json(err)
    })
    
})
app.listen("5000", () => {
console.log("Hello")
});
