const http = require("http");
const multer = require("multer");
const path = require("path");

http
  .createServer((req, res) => {
    if (req.url == "/fileupload") {
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          // upload forlder
          cb(null, "uploads");
        },
        filename: (req, file, cb) => {
          cb(null, file.fieldname + "_" + Date.now() + ".jpg");
        },
      });
      const upload = multer({
        storage: storage,
        // limits: 1*1000*1000
        fileFilter: (req, file, cb) => {
          let fileTypes = /jpg|jpeg|png/;
          var mimetype = fileTypes.test(file.mimetype);
          const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
          );
          if (mimetype && extname) {
            return cb(null, true);
          }

          cb("Error: File upload only support images of type: " + fileTypes);
        },
        // name of input field on form
      }).single("filetoupload");

      try {
        upload(req, res, (err) => {
          if (err) {
            res.write(err);
            res.end();
          } else {
            res.write("<p>SUCCESS, image uploaded successfully! <a href='/download'/></p>");
            res.end();
          }
        });
      } catch (err) {
        res.write(err);
        res.end();
      }
      // res.write('file uploaded')
    } else {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });

      // html form
      res.write("<h1>hello ricky</h1>");
      res.write(
        "<form action='fileupload' method='post' enctype='multipart/form-data'>"
      );
      res.write("<input type='file' name='filetoupload' required><br>");
      res.write("<input type='submit' value='Upload file'>");
      res.write("</form>");
      return res.end();
    }
  })
  .listen(8000);
console.log("localhost:8000");
