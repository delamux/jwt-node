const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload({ useTemFiles: true }));

app.put('/upload', function(req, res) {
    if (Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.upload_file;
    let fileSplit = sampleFile.name.split('.');
    let fileExtension = fileSplit[fileSplit.length -1];
    let allowedExtensions =['jpg', 'jpeg', 'png'];
    if (allowedExtensions.indexOf(fileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'File extension not allowed'
            }
        });
    }

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./uploads/filename.jpg', (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            message: 'File uploaded successfully!'
        });
    });
});

module.exports = app;
