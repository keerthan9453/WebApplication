const { MongoClient, ObjectId } = require('mongodb');
const uri = require("./atlasdb");
const client = new MongoClient(uri);
const dbname = "Tester1";
collectionn_name = "Test";
const accountsCollection = client.db(dbname).collection(collectionn_name);
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Middleware to parse JSON data from requests
app.use(bodyParser.json());

// Connect to the database
const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database`);
    } catch (err) {
        console.error('Failed to connect to the database', err);
    }
};

// API endpoint for updating user information
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Insert or update the account
        const result = await accountsCollection.updateOne(
            { username}, // Find by account_id
            {
                $set: {
                    password,
                    last_updated: new Date(),
                },
            },
            { upsert: true } // Create a new document if none exists
        );

        if (result.upsertedCount || result.modifiedCount) {
            res.status(200).send({ message: 'Account successfully updated or created', result });
        } else {
            res.status(200).send({ message: 'No changes made', result });
        }
    } catch (err) {
        console.error('Error updating account:', err);
        res.status(500).send({ error: 'Failed to update account' });
    }
});

const collection = client.db(dbname).collection("users");
module.exports = {accountsCollection, connectToDatabase};