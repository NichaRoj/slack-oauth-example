import express from 'express'
import { WebClient } from '@slack/web-api'

const router = express.Router()

router.get('/ping', function(req, res) {
    console.log("client_id: ", process.env.CLIENT_ID)
    console.log("client_secret: ", process.env.CLIENT_SECRET)
    console.log("redirect_uri: ", process.env.REDIRECT_URI)
    res.status(200).send('pong')
})

router.get('/token', function(req, res) {
    if(!req.query || !req.query.code) {
        res.status(400).send(`Missing attributes 'code'`)
    }

    const slack = new WebClient()
    slack.oauth.access({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code,
        redirect_uri: process.env.REDIRECT_URI
    }).then( json => {
        res.status(200).send(json)
    }).catch( error => {
        console.log(error)
        res.status(500).send(error)
    })
})

export default router