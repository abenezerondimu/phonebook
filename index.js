const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let phonebooks = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(phonebooks);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const phonebook = phonebooks.filter((phone) => phone.id === id);
  if (!phonebook.length > 0) {
    return res.status(404).end();
  }
  res.json(phonebook);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phonebooks = phonebooks.filter((phone) => phone.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const randId = Math.round(Math.random() * 1000);
  return String(randId);
};

app.post("/api/persons/", (req, res) => {
  const names = phonebooks.map((phonebook) => phonebook.name); // get names to check if incomming name already exists
  // getting body
  if (!req.body.name) {
    return res.status(400).json({
      error: "name is missing",
    });
  }
  if (!req.body.number) {
    return res.status(400).json({
      error: "number is missing",
    });
  }
  if (names.find((name) => name === req.body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const phonebook = {
    id: generateId(),
    name: req.body.name,
    number: req.body.number,
  };
  phonebooks = phonebooks.concat(phonebook);

  res.json(phonebook);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${phonebooks.length} people</p>
    <p>${new Date(8.64e15).toString()}`
  );
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
