
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose")
const router = express.Router();
const server = express();
server.use(express.json());
server.use(bodyParser.json());



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb://localhost:27017/shortener`);
    console.log("connect");

    // use await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test'); if your database has auth enabled
}
server.use(cors());

const userSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    shortId: String,
});

const URL = mongoose.model('URL', userSchema);
function addDefaultProtocol(longUrl) {
    if (!/^(?:f|ht)tps?:\/\//i.test(longUrl)) {
        return "http://" + longUrl;
    }
    return longUrl;
}

server.post('/shortener', async (req, res) => {
    try {
        console.log(req.body);

        const user = new URL();
        user.longUrl = addDefaultProtocol(req.body.longUrl);
        user.shortUrl = req.body.shortUrl;
        user.shortId = req.body.shortId;
        const doc = await user.save();
        console.log(doc);

        res.json(doc);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Failed to save URL data.' });
    }
});

server.get("/:shortUrl", async (req, res) => {
    try {
        const shortUrl = "http://localhost:8080/" + req.params.shortUrl;
        console.log("shortUrl => " + shortUrl);


        const url = await URL.findOne({ shortUrl });
        console.log(url)

        if (!url) {
            return res.status(404).json({ error: 'Short URL not found.' });
        }

        // If the URL document is found, redirect the user to the long URL
        const longUrl = url.longUrl;
        console.log("Original URL => " + longUrl);
        return res.redirect(301, longUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error.'



        });
    }
});

server.listen(8080, () => {
    console.log("server started")
})