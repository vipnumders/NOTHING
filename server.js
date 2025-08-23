

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'test_data.csv');

app.use(cors());
app.use(express.json({ limit: '50mb' })); // For parsing application/json
app.use(express.static(__dirname)); // Serve static files from the root directory

// Endpoint to get all data
app.get('/api/data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send('Error reading data file.');
        }
        // Simple CSV to JSON conversion
        const rows = data.trim().split('\n').map(line => line.split(','));
        res.json(rows);
    });
});

// Endpoint to add new data
app.post('/api/data', (req, res) => {
    const newData = req.body; // Expecting an array of arrays

    if (!Array.isArray(newData) || !newData.every(Array.isArray)) {
        return res.status(400).send('Invalid data format. Expected an array of arrays.');
    }

    // Convert array of arrays to CSV string
    const csvString = newData.map(row => row.join(',')).join('\n');

    fs.appendFile(dataFilePath, '\n' + csvString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to data file:', err);
            return res.status(500).send('Error writing to data file.');
        }
        res.status(200).send('Data added successfully.');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Serving files from:', __dirname);
});
