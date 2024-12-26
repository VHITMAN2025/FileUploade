const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 1234;

// MongoDB Atlas connection URL
const url = 'mongodb+srv://vijjuroxxx143:0Z7DMARTXe8AuiAM@cluster0.swg7e.mongodb.net/Student?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the File schema
const fileSchema = mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String
});

// Create the File model
const fileModel = mongoose.model('File', fileSchema);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the upload.html file when visiting the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

// Route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const newFile = new fileModel({
        name: file.originalname,
        data: file.buffer,
        contentType: file.mimetype
    });

    newFile.save()
    .then(savedFile => res.send(`File uploaded and inserted successfully! File ID: ${savedFile._id}`))
    .catch(err => {
        console.error('Error saving file:', err);
        res.status(500).send('Internal Server Error');
    });
});

// Route to retrieve a file by ID using async/await
app.get('/view-file/:id', async (req, res) => {
    const fileId = req.params.id;
    try {
        const file = await fileModel.findById(fileId);
        if (!file) {
            return res.status(404).send('File not found');
        }
        res.setHeader('Content-Type', file.contentType);
        res.send(file.data);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
