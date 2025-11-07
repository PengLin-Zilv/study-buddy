// Import dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');  
const fs = require('fs').promises;
const path = require('path');  

// Load environment variables from .env file
dotenv.config();



// Create an Express app 
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is working!',
        timestamp: new Date()
    });
});

// NEW: Onboarding endpoint
app.post('/api/onboarding', async(req, res) => {
    try {
        const userData = req.body;
        console.log('Received user onboarding data:', userData);
        console.log(' Subject:', userData.subject);
        console.log(' Exam Date:', userData.examDate);
        console.log(' Daily Study Time:', userData.dailyTime);
        console.log(' Goal:', userData.goal);
        
        // Generate Unique User ID
        const userId = 'user_' + Date.now();

        // Create a user object with ID and timestamp
        const userWithMeta = {
            id: userId,
            ...userData,
            createdAt: new Date().toISOString()
        };

        // Save to file
        const filePath = path.join(__dirname, 'data', `${userId}.json`);
        await fs.writeFile(filePath, JSON.stringify(userWithMeta, null, 2));

        console.log('Saved to file:', filePath);

        res.json({
            success: true,
            message: 'Onboarding data received successfully!',
            userId: userId,
            data: userWithMeta
        });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save onboarding data.'
        });
    }
});


app.get('/api/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const filePath = path.join(__dirname, 'data', `${userId}.json`);

        const data = await fs.readFile(filePath, 'utf-8');
        const userData = JSON.parse(data);

        res.json({
            success: true,
            data: userData
        });

    } catch (error) {
        console.error('Error reading user data', error );
        res.status(404).json({
            success: false,
            message: 'User data not found'
        });
     }
});

const dataDir = path.join(__dirname, 'data');
fs.mkdir(dataDir, { recursive: true }).catch(console.error);

// Start the server 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});