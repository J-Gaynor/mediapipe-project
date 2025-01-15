const express = require('express');
const cors = require('cors');
// const axios = require('axios');

const app = express();
app.use(cors({
    origin: ['http://localhost:3000']
}))
const port = 8000;

app.post('/identify', async (req, res) => {
    const { image } = req.body
    console.log(image);
    try {
        return true;
    } catch (err) {
        return (err);
    }
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})