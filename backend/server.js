require('dotenv').config()

const express = require('express')

const app = express()

app.listen(process.env.PORT, () => {
    console.log('listening for requests on port from backend', process.env.PORT)
})

app.get('/api/v1/getfiles/:userId/:projectId/:type', (req, res) => {
    const { userId, projectId, type } = req.params;
    res.send({ 
        userId: userId,
        projectId: projectId,
        type: type,
     });
})