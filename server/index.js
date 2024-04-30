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
    const { title, customDomain, infoType, additionalFields, dates, hasTimeSlots, items, slots, userId } = req.body; // Include items and slots in the destructuring
    console.log('Received userId:', userId); // Log the received userId
    if (!userId) {
        console.error("UserId is missing in the request");
        return res.status(400).json({ error: "UserId is required" });
    }
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        
        // Check if customDomain already exists
        const domainExists = await formsCollection.findOne({ customDomain: customDomain });
        if (domainExists) {
            return res.status(409).send('Custom domain is already taken.');
        }
        

        const newForm = {
            title, 
            customDomain,
            infoType,
            additionalFields,
            dates, // Add dates here
            hasTimeSlots, // Add this line
            userId, // Add userId to the form object
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
    const { userId } = req.query; // Retrieve userId from query parameters
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const allForms = await formsCollection.find({ userId: userId }).toArray(); // Filter forms by userId
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
    console.log("Received infoType:", req.body.infoType); // Add this line
    const { formId } = req.params;
    const { additionalFields, infoType, dates } = req.body; // Include additionalFields and infoType in the destructuring

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
    const { items, slots } = req.body; // Adjusted to include items and slots
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        // Logic to update the specific items and slots for the form
        // This is a simplified example. You'll need to adjust it based on your data structure
        const updateResult = await formsCollection.updateOne(
            { _id: new ObjectId(formId) },
            { $set: { items, slots } } // Updated to set items and slots
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
    console.log(`Attempting to delete form with ID: ${id}`); // Ensure ID is logged
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
        console.log("JWT_SECRET:", process.env.JWT_SECRET); // Verify JWT_SECRET is available
        console.log("Generating token for user:", { userId: result.insertedId, username: newUser.username });
        const token = jwt.sign({ userId: result.insertedId, username: newUser.username }, JWT_SECRET, { expiresIn: '24h' });
        console.log("Generated authToken for signup:", token); // Add this line
        res.status(201).json({ authToken: token, userId: result.insertedId, username: newUser.username });
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).json({ error: "Error signing up user." });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Attempting to log in with:', username); // Log the username attempting to log in

    const usersCollection = dbClient.db('FoxForms').collection('Users');

    try {
        const user = await usersCollection.findOne({ username: username.toLowerCase() });
        console.log('User found:', !!user); // Log whether the user was found

        if (!user) {
            return res.status(401).json({ message: 'User does not exist.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        console.log('Password correct:', isPasswordCorrect); // Log the result of the password check

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        console.log("JWT_SECRET:", process.env.JWT_SECRET); // Verify JWT_SECRET is available
        console.log("Generating token for user:", { userId: user._id, username: user.username });
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        console.log("Generated authToken for login:", token); // Add this line
        res.status(200).json({ authToken: token, userId: user._id, username: user.username });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user." });
    }
});



app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to update user with ID: ${id}`); // Ensure ID is logged
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
            eventID: new ObjectId(eventID), // Convert to ObjectId if necessary
            startTime: new Date(startTime), // Ensure this is a Date object
            endTime: new Date(endTime), // Ensure this is a Date object
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
    const { date, timeSlot, item, slots } = req.body; // Adjusted to match the instructions
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
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];
    console.log("Token received:", token); // Add this line to log the received token
    try {
        // Assuming you have a function to verify the token and extract user information
        // This could be a JWT token verification or a custom token validation logic
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        // Assuming you have a users collection and each user document has a username field
        const user = await dbClient.db('FoxForms').collection('Users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Send back the username
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

// Start the server
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(console.error);

// Dashboard specific route
app.get('/dashboard/:authToken', async (req, res) => {
    const { authToken } = req.params;

    try {
        // Verify the token
        const decoded = jwt.verify(authToken, JWT_SECRET);
        const userId = decoded.userId;

        // Fetch user-specific data
        const userData = await dbClient.db('FoxForms').collection('Users').findOne({ _id: new ObjectId(userId) });

        if (!userData) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Fetch forms specific to the user
        const userForms = await dbClient.db('FoxForms').collection('Forms').find({ userId: userId }).toArray();

        // Serve the dashboard content for the user
        res.json({ message: 'Dashboard content', data: userData, forms: userForms });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data.' });
    }
});
