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
    const { title, customDomain, infoType, additionalFields, dates, hasTimeSlots, items, slots } = req.body; // Include items and slots in the destructuring
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
            items, // Add items here
            slots, // Add slots here
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
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const allForms = await formsCollection.find({}).toArray();
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
    const updates = req.body; // This should include the structured payload with nested items and slots

    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        // Adjust this section to handle nested structure
        // Example: Assuming 'updates' contains dates with nested timeSlots, which in turn contain nested items
        const processedUpdates = processNestedStructure(updates); // You need to implement this function based on your data structure

        if (updates.infoType) {
            processedUpdates.infoType = updates.infoType;
            console.log(`infoType ${updates.infoType} successfully written to the backend for formId: ${formId}`);
        }

        const updateResult = await formsCollection.updateOne(
            { _id: new ObjectId(formId) },
            { $set: processedUpdates }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send('Form not found.');
        }

        res.status(200).json({ message: 'Form updated successfully with nested items and slots.' });
    } catch (error) {
        console.error("Failed to update form:", error);
        res.status(500).json({ error: "An error occurred while updating the form." });
    }
});

// Testing Saving InfoType

app.put('/forms/:formId/updateInfoType', async (req, res) => {
    const { formId } = req.params;
    const { infoType } = req.body;

    try {
        const updateResult = await formsCollection.updateOne(
            { _id: new ObjectId(formId) },
            { $set: { infoType } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send('Form not found.');
        }

        res.status(200).json({ message: 'infoType updated successfully.' });
    } catch (error) {
        console.error("Failed to update infoType:", error);
        res.status(500).json({ error: "An error occurred while updating the infoType." });
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
    const { email, password } = req.body;
    const usersCollection = dbClient.db('FoxForms').collection('Users');

    try {
        const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).send('User already exists. Please login.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            email: email.toLowerCase(),
            passwordHash: hashedPassword,
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);
        const token = jwt.sign({ userId: result.insertedId, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ token, userId: result.insertedId });
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).json({ error: "Error signing up user." });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usersCollection = dbClient.db('FoxForms').collection('Users');

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
        res.status(500).json({ error: "Error logging in user." });
    }
});

app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to update user with ID: ${id}`); // Ensure ID is logged
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).send("Invalid ID format");
    }
    const { email, password } = req.body;
    const usersCollection = dbClient.db('FoxForms').collection('Users');

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updateDoc = {
            $set: {
                ...(email && { email: email.toLowerCase() }),
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
    const { date, timeSlot, itemName, slots } = req.body;
    const formsCollection = dbClient.db('FoxForms').collection('Forms');

    try {
        const updateResult = await formsCollection.updateOne(
            { _id: new ObjectId(formId), [`dates.${date}.timeSlots.${timeSlot}`]: { $exists: true } },
            { $push: { [`dates.${date}.timeSlots.${timeSlot}.items`]: { name: itemName, slots: slots } } }
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


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start the server
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(console.error);
