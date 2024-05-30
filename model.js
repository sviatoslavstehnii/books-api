const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String },
    pageCount: { type: Number },
    publishedDate: {
      date: { type: Date },
    },
    thumbnailUrl: { type: String },
    shortDescription: { type: String },
    longDescription: { type: String },
    status: { type: String, enum: ["PUBLISH", "DRAFT"] },
    authors: { type: [String] },
  },
  { collection: "books" }
);

const Book = mongoose.model("books", bookSchema);
const ObjectId = mongoose.Types.ObjectId;

module.exports = { bookSchema, Book, ObjectId };
