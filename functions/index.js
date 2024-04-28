

const functions = require('firebase-functions');
const express = require("express");
const cors = require("cors");
// const { request } = require('express');
const stripe = require("stripe")
("")
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