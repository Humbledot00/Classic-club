const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Connection URL and database name for speakers
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';
const collectionName = 'formdatas';

// Connection URL and database name for registration
const dbNameregister = 'registration';

// Connection URL and database name for feedback
const dbNamefeedback = 'userfeedback';

// Connection URL and database name for membership
const dbNamemembership = 'usermembership';

// Add this route to serve images from the 'public/images' directory


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    // Fetch data from MongoDB and pass it to the 'index.ejs' template
    // (Add your MongoDB code here to retrieve data)
    res.render('index', { /* Pass the data here */ });
  } catch (err) {
    console.error(err);
    res.send('Error fetching data from MongoDB');
  }
});
// Fetch data from MongoDB and render the EJS template


app.get('/eventspage', async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
1

    const documents = await collection.find().toArray();

    const details = documents.map((box) => {
      return {
        title: box.title,
        content: box.content,
        image: `/images/${box.imageFilename}` // Assuming the image filenames are stored in the database
      };
    });
    res.render('eventspage', {  details: documents });
  } catch (err) {
    console.error(err);
    res.send('Error fetching data from MongoDB');
  }
});

app.get('/register', async (req, res) => {
  console.log('Landing page route triggered');
try {
  const client = await MongoClient.connect(url);
  const db = client.db(dbNameregister);
  const collection = db.collection('departments');

  // Fetch department names from the database
  const departments = await collection.find().toArray();

  res.render('register', { departments });

  client.close();
} catch (err) {
  console.error(err);
  res.send('Error fetching data from MongoDB');
}
});

app.get('/Contact', (req, res) => {
  console.log('Accessed index1 page');
  res.render('Contact');
});

app.get('/membership', (req, res) => {
  console.log('Accessed membership page');
  res.render('membership');
});


app.get('/aboutusindex', (req, res) => {
  console.log('Accessed membership page');
  res.render('aboutusindex');
});

// Route to handle form submission
app.post("/sign_up", async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('formdatas');

    const { name, year, department, usn, email, event } = req.body;

    const data = {
      Name: name,
      year: year,
      department: department,
      usn: usn,
      email: email,
      event: event
    };

    // Insert data into the database
    await collection.insertOne(data);

    client.close();

    // Redirect to the success page
    res.redirect('registration_success.html');
  } catch (err) {
    console.error(err);
    res.send('Error inserting data into MongoDB');
  }
});


app.post("/feedback", async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbNamefeedback);
    const collection = db.collection('feedback');

    const { name, email, message } = req.body;

    const data = {
      Name: name,
      email: email,
      message: message

    };

    // Insert data into the database
    await collection.insertOne(data);

    client.close();

    // Redirect to the success page
    res.redirect('registration_success.html');
  } catch (err) {
    console.error(err);
    res.send('Error inserting data into MongoDB');
  }
});

app.post("/membership", async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbNamemembership);
    const collection = db.collection('membership');

    const { name, year, department,  usn, email, domain } = req.body;

    const data = {
      Name: name,
      year: year,
      department: department,
      usn: usn,
      email: email,
      domain: domain

    };

    // Insert data into the database
    await collection.insertOne(data);

    client.close();

    // Redirect to the success page
    res.redirect('registration_success.html');
  } catch (err) {
    console.error(err);
    res.send('Error inserting data into MongoDB');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
