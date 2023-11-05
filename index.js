const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;


// middleware below
app.use(cors({
    credentials: true,
    origin: ['']
}));
app.use(express.json());

// ----------------------


// mongodb connection






app.get('/', (req, res) => res.send('Food Share server is running'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))