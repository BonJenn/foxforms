import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongodb from 'mongodb';
const { MongoClient, ObjectId } = mongodb;
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

const app = express();
const uri = "mongodb+srv://bonjennprojects:123@cluster0.hggbu5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 5174;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors({
    origin: '*', // Adjust according to your front-end app's origin for security
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

let dbClient;
const mongoClientOptions = { ssl: true };

async function connectToDatabase() {
    dbClient = new MongoClient(uri, mongoClientOptions);
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

connectToDatabase().catch(console.error);

app.get('/', (req, res) => {
    res.send('Welcome to the Forms API!');
});

// Forms CRUD operations
app.post('/forms', async (req, res) => {
    const { title, customDomain } = req.body;
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const newForm = {
          
            title, 
            customDomain,
            createdAt: new Date(),
        };

        await formsCollection.insertOne(newForm);
        res.status(201).json(newForm);
    } catch (error) {
        console.error("Failed to create form:", error);
        res.status(500).send("An error occurred while creating the form.");
    }
});

app.get('/forms', async (req, res) => {
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const allForms = await formsCollection.find({}).toArray();
        res.json(allForms);
    } catch (error) {
        console.error("Failed to fetch forms:", error);
        res.status(500).send("An error occurred while fetching the forms.");
    }
});

app.put('/forms/:id', async (req, res) => {
    const { id } = req.params;
    const { title, customDomain } = req.body;
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const updateDocument = {
            $set: {
                title,
                customDomain,
                updatedAt: new Date(),
            },
        };

        const result = await formsCollection.updateOne({ _id: ObjectId(id) }, updateDocument);

        if (result.matchedCount === 0) {
            return res.status(404).send("Form not found.");
        }

        res.status(200).send("Form updated successfully.");
    } catch (error) {
        console.error("Failed to update form:", error);
        res.status(500).send("An error occurred while updating the form.");
    }
});

app.delete('/forms/:id', async (req, res) => {
    const { id } = req.params;
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const result = await formsCollection.deleteOne({ _id: ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send("Form not found.");
        }

        res.status(200).send("Form deleted successfully.");
    } catch (error) {
        console.error("Failed to delete form:", error);
        res.status(500).send("An error occurred while deleting the form.");
    }
});

// User authentication endpoints
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const usersCollection = dbClient.db('FoxForms').collection('users');

    try {
        const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).send('User already exists. Please login.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            _id: new ObjectId(),
            email: email.toLowerCase(),
            passwordHash: hashedPassword,
            createdAt: new Date(),
        };

        await usersCollection.insertOne(newUser);

        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ token, userId: newUser._id });
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).send("Error signing up user.");
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usersCollection = dbClient.db('FoxForms').collection('users');

    try {
        const user = await usersCollection.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).send('User does not exist.');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordCorrect) {
            return res.status(400).send('Invalid credentials.');
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send("Error logging in user.");
    }
});

app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;
    const usersCollection = dbClient.db('FoxForms').collection('users');

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updateDoc = {
            $set: {
                ...(email && { email: email.toLowerCase() }),
                ...(hashedPassword && { passwordHash: hashedPassword }),
            },
        };

        const result = await usersCollection.updateOne({ _id: ObjectId(id) }, updateDoc);
        if (result.matchedCount === 0) {
            return res.status(404).send('User not found.');
        }

        res.status(200).send('User updated successfully.');
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user.");
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(console.error);

