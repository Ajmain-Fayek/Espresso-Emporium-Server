const express = require("express");

// Import cors Middleware
const cors = require("cors");

// Import Environment Variable Reader
require("dotenv").config();

// Import Mongodb client and table api server version
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

// Use Middleware
app.use(cors());
app.use(express.json());

// DB Connection String
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.su4k9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClentOptions object to set the stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
async function run() {
    try {
        // connect the client to the server (optional starting in v4.7)
        await client.connect();

        // ADD Collection
        const coffeeCollection = client
            .db("Expresso_Emperium")
            .collection("coffees");
        const userCollection = client
            .db("Expresso_Emperium")
            .collection("users");

        app.get("/coffees", async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/coffees/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        });

        app.post("/coffees", async (req, res) => {
            const newCoffee = req.body;
            // console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        });

        app.put("/coffees/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const { name, chef, taste, category, details, photo, supplier } =
                req.body;
            const updatedCoffee = {
                $set: {
                    name,
                    chef,
                    taste,
                    category,
                    details,
                    photo,
                    supplier,
                },
            };
            const result = await coffeeCollection.updateOne(
                filter,
                updatedCoffee,
                options
            );
            res.send(result);
        });

        app.delete("/coffees/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        });

        // Users Related APIs
        app.post("/users", async (req, res) => {
            const newUser = req.body;
            // console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        // send a ping to confirm a successfull connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensure that the client will close when you finish/error
        // await client.close()
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Yayy..!!! Backand working properly");
});

app.listen(port, () => {
    console.log(`Server is Runnig at PORT: ${port}`);
});
