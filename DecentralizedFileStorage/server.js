const express = require('express');
const multer = require('multer');
const IPFS = require('ipfs-http-client');

const app = express();
const port = 3000;

// Initialize IPFS client
const ipfs = IPFS.create({ host: 'localhost', port: 5001, protocol: 'http' });

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const result = await ipfs.add(fileBuffer);

        // Store the IPFS hash and other file metadata in a database (not shown here)
        const ipfsHash = result[0].hash;

        res.json({ ipfsHash });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading file to IPFS' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
