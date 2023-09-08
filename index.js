const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://task:nOwdToqGl5MXtQJf@cluster0.oikwqb2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Define your routes here, outside of the run function
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/allTask', async (req, res) => {
    try {
        const taskCollection = client.db("taskdata").collection('alltask');
        const query = {};
        const tasks = await taskCollection.find(query).toArray();
        res.json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ error: 'An error occurred while fetching tasks.' });
    }
});

app.post('/allTask', async (req, res) => {
    const taskCollection = client.db("taskdata").collection('alltask');
    const task = req.body;
    const result = await taskCollection.insertOne(task);
    res.json({ success: true, result });


});
app.put('/allTask/start/:id', async (req, res) => {
    const taskCollection = client.db("taskdata").collection('alltask');
    const id = req.params.id;
    //condition er maddome j request dicce she admin kina dekhsi,jodi tar role admin hoi ta hole she onno jon k admin dite parbe,,noito parbena...fornidden maessage dibe

    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const updateDoc = {
        $set: { status: 'Progress' },//database user role addmin hishebe set hobe
    }
    const result = await taskCollection.updateOne(filter, updateDoc, options);
    res.send({ result });
});
app.put('/allTask/complete/:id', async (req, res) => {
    const taskCollection = client.db("taskdata").collection('alltask');
    const id = req.params.id;
    //condition er maddome j request dicce she admin kina dekhsi,jodi tar role admin hoi ta hole she onno jon k admin dite parbe,,noito parbena...fornidden maessage dibe

    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const updateDoc = {
        $set: { status: 'Complete' },//database user role addmin hishebe set hobe
    }
    const result = await taskCollection.updateOne(filter, updateDoc, options);
    res.send({ result });
});

app.get('/allTask/status', async (req, res) => {
    try {
        const task=req.params.status
        const taskCollection = client.db("taskdata").collection('alltask');
        const query = {task:task};
        const tasks = await taskCollection.find(query).toArray();
        res.json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ error: 'An error occurred while fetching tasks.' });
    }
});

app.get('/myTask', async (req, res) => {
    try {
        const taskCollection = client.db("taskdata").collection('alltask');
        const { email } = req.query
        const myTask= await taskCollection.find({ email }).toArray();
        res.send(myTask);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ error: 'An error occurred while fetching tasks.' });
    }
});


async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log('Your database is connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Task manager listening on port ${port}`);
});
