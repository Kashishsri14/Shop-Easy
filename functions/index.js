
// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const express = require("express");
const cors = require("cors");
// const { request } = require('express');
const stripe = require("stripe")
("sk_test_51P6dkTSBJVCyXidXSWEu3UKcxyxMER48THfyfXDcAAD9xwSHYhwy9ECymj9Y5L9Y1mBqNBiFLdLhhEMpzaPwo6Uw00qCvpqLOk")
//API 


// API config
const app = express();

// - MIddlewares
app.use(cors({ origin: true}));
app.use(express.json());

// - API routes
app.get('/', (request, response) => response.status(200).send('hello world'))

app.post('/payments/create', async(request, response) => {
    const total = request.query.total;

    console.log('Payment request recieved boom! foor amount>>', total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, // subunits of currency
        currency: "usd",
    });
    // OK created
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})
// - Listen command
exports.api = functions.https.onRequest(app)


//example endpoint
//http://127.0.0.1:9300/challenge-75ee6/us-central1/api