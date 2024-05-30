const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Book, ObjectId } = require("./model");

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database is now connected!");
    app.listen(PORT, () => {
      console.log(`App is now working on ${PORT} port`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/api/v1/books", async (req, res) => {
  try {
    const books = await Book.find();
    res
      .status(200)
      .json({ status: "success", results: books.length, data: { books } });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/v1/books/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID" });
  }
  try {
    const book = await Book.findById(new ObjectId(id));
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ status: "success", data: { book } });
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/v1/books", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json({ status: "success", data: { book: newBook } });
  } catch (error) {
    console.error("Error creating new book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/v1/books/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID" });
  }
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    Object.assign(book, req.body);
    await book.save();
    res.status(200).json({ status: "success", data: { book } });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/v1/books/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID" });
  }
  try {
    const result = await Book.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
