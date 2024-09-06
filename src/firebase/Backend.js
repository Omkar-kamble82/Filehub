import express from "express";

const router = express.Router()
const app = express()

app.listen(5000, () => {
    console.log('listening for requests on port from backend', 5000)
})

app.get('/api/v1/getfiles/:userId/:projectId/:type', (req, res) => {
    const { userId, projectId, type } = req.params;
    res.send({ 
        userId: userId,
        projectId: projectId,
        type: type,
     });
})