import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongodb from 'mongodb';
const { MongoClient, ObjectId } = mongodb;
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcryptjs'; // Updated import
import rateLimit from 'express-rate-limit';
import awsServerlessExpress from 'aws-serverless-express'; // Updated import

const app = express();
app.enable('trust proxy');
const uri = "mongodb+srv://bonjennprojects:123@cluster0.hggbu5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors({
    origin: '*',
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    },
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
    const { title, customDomain, infoType, additionalFields, dates, hasTimeSlots, items, slots, userId } = req.body;
    console.log('Received userId:', userId);
    if (!userId) {
        console.error("UserId is missing in the request");
        return res.status(400).json({ error: "UserId is required" });
    }
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const domainExists = await formsCollection.findOne({ customDomain: customDomain });
        if (domainExists) {
            return res.status(409).send('Custom domain is already taken.');
        }

        const newForm = {
            title, 
            customDomain,
            infoType,
            additionalFields,
            dates,
            hasTimeSlots,
            userId,
            createdAt: new Date(),
        };

        const result = await formsCollection.insertOne(newForm);
        const createdForm = {
            _id: result.insertedId,
            ...newForm
        };

        res.status(201).json(createdForm);
    } catch (error) {
        console.error("Failed to create form:", error);
        res.status(500).json({ error: "An error occurred while creating the form." });
    }
});

app.get('/forms', async (req, res) => {
    const { userId } = req.query;
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const allForms = await formsCollection.find({ userId: userId }).toArray();
        res.json(allForms);
    } catch (error) {
        console.error("Failed to fetch forms:", error);
        res.status(500).json({ error: "An error occurred while fetching the forms." });
    }
});

app.get('/forms/:id', async (req, res) => {
    const { id } = req.params;
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const form = await formsCollection.findOne({ _id: new ObjectId(id) });
        if (!form) {
            return res.status(404).send("Form not found.");
        }
        res.json(form);
    } catch (error) {
        console.error("Failed to fetch form:", error);
        res.status(500).json({ error: "An error occurred while fetching the form." });
    }
});

// Update Forms
app.put('/forms/:formId', async (req, res) => {
    console.log("Received infoType:", req.body.infoType);
    const { formId } = req.params;
    const { additionalFields, infoType, dates } = req.body;

    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const updateDoc = {
            $set: {
                ...(additionalFields && { additionalFields: additionalFields }),
                ...(infoType && { infoType: infoType }),
                ...(dates && { dates: dates })
            }
        };

        const updateResult = await formsCollection.updateOne(
            { _id: new ObjectId(formId) },
            updateDoc
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send('Form not found.');
        }

        res.status(200).json({ message: 'Form updated successfully.' });
    } catch (error) {
        console.error("Failed to update form:", error);
        res.status(500).json({ error: "An error occurred while updating the form." });
    }
});

app.put('/forms/:formId/items', async (req, res) => {
    const { formId } = req.params;
    const { items, slots } = req.body;
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const updateResult = await formsCollection.updateOne(
            { _id: new ObjectId(formId) },
            { $set: { items, slots } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send('Form not found.');
        }

        res.status(200).json({ message: 'Items and slots updated successfully.' });
    } catch (error) {
        console.error("Error updating items and slots:", error);
        res.status(500).json({ error: "Error updating items and slots." });
    }
});

// Delete Forms
app.delete('/forms/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete form with ID: ${id}`);
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).send("Invalid ID format");
    }
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const result = await formsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send("Form not found.");
        }

        res.status(200).json({ message: "Form deleted successfully." });
    } catch (error) {
        console.error("Failed to delete form:", error);
        res.status(500).json({ error: "An error occurred while deleting the form." });
    }
});

// User authentication endpoints
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const usersCollection = dbClient.db('FoxForms').collection('Users');

    try {
        const existingUser = await usersCollection.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            return res.status(409).send('User already exists. Please login.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username: username.toLowerCase(),
            passwordHash: hashedPassword,
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("Generating token for user:", { userId: result.insertedId, username: newUser.username });
        const token = jwt.sign({ userId: result.insertedId, username: newUser.username }, JWT_SECRET, { expiresIn: '24h' });
        console.log("Generated authToken for signup:", token);
        res.cookie('authToken', token, { sameSite: 'None', secure: true, httpOnly: true, maxAge: 86400000 });
        res.status(201).json({ authToken: token, userId: result.insertedId, username: newUser.username });
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).json({ error: "Error signing up user." });
    }
});

app.post('/login', async (req, res) => {
    console.log('Received login request');
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Content-Type:', req.get('Content-Type'));

    const { username, password } = req.body;
    console.log('Attempting to log in with username:', username);
    console.log('Extracted username:', username);
    console.log('Extracted password:', password ? '[REDACTED]' : 'undefined');

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const usersCollection = dbClient.db('FoxForms').collection('Users');

    try {
        const user = await usersCollection.findOne({ username: username.toLowerCase() });
        console.log('User found:', !!user);

        if (!user) {
            return res.status(401).json({ message: 'User does not exist.' });
        }

        if (!user.passwordHash) {
            console.error('User found but passwordHash is missing:', user);
            return res.status(500).json({ message: 'Invalid user data.' });
        }

        console.log('Received password:', password);
        console.log('Stored password hash:', user.passwordHash);

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        console.log('Password correct:', isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("Generating token for user:", { userId: user._id, username: user.username });
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        console.log("Generated authToken for login:", token);
        res.cookie('authToken', token, { sameSite: 'None', secure: true, httpOnly: true, maxAge: 86400000 });
        res.status(200).json({ authToken: token, userId: user._id, username: user.username });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user.", error: error.toString() });
    }
});


app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to update user with ID: ${id}`);
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).send("Invalid ID format");
    }
    const { username, password } = req.body;
    const usersCollection = dbClient.db('FoxForms').collection('Users');

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updateDoc = {
            $set: {
                ...(username && { username: username.toLowerCase() }),
                ...(hashedPassword && { passwordHash: hashedPassword }),
            },
        };

        const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);
        if (result.matchedCount === 0) {
            return res.status(404).send('User not found.');
        }

        res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Error updating user." });
    }
});

// Time-Slots
app.post('/time-slots', async (req, res) => {
    const { eventID, startTime, endTime, maxParticipants, isBooked } = req.body;
    const timeSlotsCollection = dbClient.db('FoxForms').collection('Time-Slots');

    try {
        const newTimeSlot = {
            eventID: new ObjectId(eventID),
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            maxParticipants,
            isBooked
        };

        const result = await timeSlotsCollection.insertOne(newTimeSlot);
        console.log("Insert result", result);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error("Failed to create time slot:", error);
        res.status(500).json({ error: "An error occurred while creating the time slot." });
    }
});

app.get('/time-slots', async (req, res) => {
    const timeSlotsCollection = dbClient.db('FoxForms').collection('Time-Slots');

    try {
        const timeSlots = await timeSlotsCollection.find({}).toArray();
        res.json(timeSlots);
    } catch (error) {
        console.error("Failed to fetch time slots:", error);
        res.status(500).json({ error: "An error occurred while fetching the time slots." });
    }
});

app.post('/forms/:formId/time-slots/items', async (req, res) => {
    const { formId } = req.params;
    const { date, timeSlot, item, slots } = req.body;
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const updateResult = await formsCollection.updateOne(
            { _id: new ObjectId(formId), [`dates.${date}.timeSlots.${timeSlot}`]: { $exists: true } },
            { $push: { [`dates.${date}.timeSlots.${timeSlot}.items`]: { ...item, slots: slots } } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send('Form, date, or time slot not found.');
        }

        res.status(200).json({ message: 'Item added successfully.' });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: "Error adding item." });
    }
});

// Example implementation of processNestedStructure
function processNestedStructure(updates) {
    let processedUpdates = {};

    if (updates.dates) {
        processedUpdates.dates = updates.dates.map(date => {
            let dateObj = { date: date.date };

            if (date.timeSlots) {
                dateObj.timeSlots = date.timeSlots.map(timeSlot => {
                    let timeSlotObj = { startTime: timeSlot.startTime, endTime: timeSlot.endTime };

                    if (timeSlot.items) {
                        timeSlotObj.items = timeSlot.items.map(item => {
                            let itemObj = { name: item.name };

                            if (item.slots) {
                                itemObj.slots = item.slots;
                            }

                            return itemObj;
                        });
                    }

                    return timeSlotObj;
                });
            } else if (date.items) {
                dateObj.items = date.items.map(item => {
                    let itemObj = { name: item.name };

                    if (item.slots) {
                        itemObj.slots = item.slots;
                    }

                    return itemObj;
                });
            } else if (date.slots) {
                dateObj.slots = date.slots;
            }

            return dateObj;
        });
    }

    return processedUpdates;
}

app.get('/get-username', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];
    console.log("Token received:", token);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const user = await dbClient.db('FoxForms').collection('Users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json({ username: user.username });
    } catch (error) {
        console.error('Error fetching username:', error);
        res.status(500).send('Internal server error');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const server = awsServerlessExpress.createServer(app);

export const handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);
};

// Dashboard specific route
app.get('/dashboard/:authToken', async (req, res) => {
    const { authToken } = req.params;

    try {
        const decoded = jwt.verify(authToken, JWT_SECRET);
        const userId = decoded.userId;

        const userData = await dbClient.db('FoxForms').collection('Users').findOne({ _id: new ObjectId(userId) });

        if (!userData) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userForms = await dbClient.db('FoxForms').collection('Forms').find({ userId: userId }).toArray();

        res.json({ message: 'Dashboard content', data: userData, forms: userForms, formTitles: userForms.map(form => form.title) });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data.' });
    }
});
