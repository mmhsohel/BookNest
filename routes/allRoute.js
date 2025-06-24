import express from "express";
import PrimaryTextBook from "../models/PrimaryBooks.js";
import HighTextBook from "../models/HighBooks.js";
import BtptBook from "../models/BtptBooks.js";
import TeachersGuide from "../models/TeachersGuide.js";
import CarouselImage from "../models/Carousel.js";
import Card from "../models/Card.js";
import BEdBook from "../models/BEdBooks.js";
import MEdBook from "../models/MEdBooks.js";
import IbtedayeTextBook from "../models/IbtedayeBooks.js";
import TechnicalTextBook from "../models/TechnicalBooks.js";
import LessonPlan from "../models/LessonPlan.js";
import DakilTextBook from "../models/DakilBooks.js";
import { auth, authorize } from "../middleware/auth.js";
import OtherBook from "../models/Other.js";
import Other1Book from "../models/Other1.js";
import Other2Book from "../models/Other2.js";
import Other3Book from "../models/Other3.js";
import Other4Book from "../models/Other4.js";
import Other5Book from "../models/Other5.js";

const router = express.Router();

router.get("/:modelName", async (req, res) => {
  const { modelName } = req.params;

  let Model;
  switch (modelName.toLowerCase()) {
    case "btptbooks":
      Model = BtptBook;
      break;
    case "hightextbooks":
      Model = HighTextBook;
      break;
    case "ibtedayetextbooks":
      Model = IbtedayeTextBook;
      break;
    case "technicaltextbooks":
      Model = TechnicalTextBook;
      break;
    case "dakiltextbooks":
      Model = DakilTextBook;
      break;
    case "lessonplans":
      Model = LessonPlan;
      break;
    case "primarytextbooks":
      Model = PrimaryTextBook;
      break;
    case "teachersguide":
      Model = TeachersGuide;
      break;
    case "bedbooks":
      Model = BEdBook;
      break;
    case "medbooks":
      Model = MEdBook;
      break;
    case "other":
      Model = OtherBook;
      break;

    case "other1":
      Model = Other1Book;
      break;

    case "other2":
      Model = Other2Book;
      break;

    case "other3":
      Model = Other3Book;
      break;
    case "other4":
      Model = Other4Book;
      break;

    case "other5":
      Model = Other5Book;
      break;

    case "carousel":
      Model = CarouselImage;
      break;
    case "card":
      Model = Card;
      break;
    default:
      return res.status(400).json({ message: "Invalid model name" });
  }
  const data = await Model.find();
  res.json(data);
});

// PATCH: Update a specific book by its class and book ID
router.patch("/:modelName/:className/:subName/:bookId", async (req, res) => {
  const { modelName, className, subName, bookId } = req.params;
  const updatedBook = req.body;
  let Model;
  switch (modelName.toLowerCase()) {
    case "btptbooks":
      Model = BtptBook;
      break;
    case "hightextbooks":
      Model = HighTextBook;
      break;
    case "ibtedayetextbooks":
      Model = IbtedayeTextBook;
      break;
    case "technicaltextbooks":
      Model = TechnicalTextBook;
      break;
    case "dakiltextbooks":
      Model = DakilTextBook;
      break;
    case "lessonplans":
      Model = LessonPlan;
      break;
    case "primarytextbooks":
      Model = PrimaryTextBook;
      break;
    case "teachersguide":
      Model = TeachersGuide;
      break;
    case "bedbooks":
      Model = BEdBook;
      break;
    case "medbooks":
      Model = MEdBook;
      break;
       case "other":
      Model = OtherBook;
      break;

    case "other1":
      Model = Other1Book;
      break;

    case "other2":
      Model = Other2Book;
      break;

    case "other3":
      Model = Other3Book;
      break;
    case "other4":
      Model = Other4Book;
      break;

    case "other5":
      Model = Other5Book;
      break;

    default:
      return res.status(400).json({ message: "Invalid model name" });
  }

  try {
    // Find the correct BtptBook document

    const collections = await Model.findOne({
      $or: [{ class: className }, { envClass: className }],
    });

    if (!collections)
      return res.status(404).json({ message: "Class not found" });

    // Prefer `subs`, fallback to `envSubs`
    const subsArray = collections[subName];
    console.log("subarray", subsArray);

    // Find the book by ID
    const book = subsArray.id(bookId); // Mongoose method
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Update the fields
    Object.assign(book, updatedBook);

    // Mark modified if needed (optional for nested docs)
    collections.markModified(subName);

    // Save changes
    await collections.save();

    res.json({ message: "Book updated", success: "ok", book });
  } catch (error) {
    console.error("Error updating book:", error.message);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
});

router.post("/:modelName/:className/:subName/add", async (req, res) => {
  const { modelName, className, subName } = req.params;
  const newBook = req.body;

  console.log("request from create book", req.params, "body", req.body);

  let Model;
  switch (modelName.toLowerCase()) {
    case "btptbooks":
      Model = BtptBook;
      break;
    case "hightextbooks":
      Model = HighTextBook;
      break;
    case "ibtedayetextbooks":
      Model = IbtedayeTextBook;
      break;
    case "technicaltextbooks":
      Model = TechnicalTextBook;
      break;
    case "dakiltextbooks":
      Model = DakilTextBook;
      break;
    case "lessonplans":
      Model = LessonPlan;
      break;
    case "primarytextbooks":
      Model = PrimaryTextBook;
      break;
    case "teachersguide":
      Model = TeachersGuide;
      break;
    case "bedbooks":
      Model = BEdBook;
      break;
    case "medbooks":
      Model = MEdBook;
      break;
 case "other":
      Model = OtherBook;
      break;

    case "other1":
      Model = Other1Book;
      break;

    case "other2":
      Model = Other2Book;
      break;

    case "other3":
      Model = Other3Book;
      break;
    case "other4":
      Model = Other4Book;
      break;

    case "other5":
      Model = Other5Book;
      break;

    default:
      return res.status(400).json({ message: "Invalid model name" });
  }

  try {
    const collection = await Model.findOne({
      $or: [{ class: className }, { envClass: className }],
    });

    if (!collection) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Add the book to subs or envSubs
    if (!Array.isArray(collection[subName])) {
      return res.status(400).json({ message: `Invalid subName: ${subName}` });
    }

    collection[subName].push(newBook);
    collection.markModified(subName);
    await collection.save();
    const createdBook = collection[subName][collection[subName].length - 1];
    console.log("createBook", createdBook);

    res
      .status(201)
      .json({ message: "Book added", success: true, data: createdBook });
  } catch (error) {
    console.error("Error adding book:", error.message);
    res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
});

// DELETE by class name
router.delete("/:modelName/:className", async (req, res) => {
  const { modelName, className } = req.params;

  let Model;
  switch (modelName.toLowerCase()) {
    case "btptbooks":
      Model = BtptBook;
      break;
    case "hightextbooks":
      Model = HighTextBook;
      break;
    case "ibtedayetextbooks":
      Model = IbtedayeTextBook;
      break;
    case "technicaltextbooks":
      Model = TechnicalTextBook;
      break;
    case "dakiltextbooks":
      Model = DakilTextBook;
      break;
    case "lessonplans":
      Model = LessonPlan;
      break;
    case "primarytextbooks":
      Model = PrimaryTextBook;
      break;
    case "teachersguide":
      Model = TeachersGuide;
      break;
    case "bedbooks":
      Model = BEdBook;
      break;
    case "medbooks":
      Model = MEdBook;
      break;
 case "other":
      Model = OtherBook;
      break;

    case "other1":
      Model = Other1Book;
      break;

    case "other2":
      Model = Other2Book;
      break;

    case "other3":
      Model = Other3Book;
      break;
    case "other4":
      Model = Other4Book;
      break;

    case "other5":
      Model = Other5Book;
      break;

    default:
      return res.status(400).json({ message: "Invalid model name" });
  }
  try {
    const deleted = await Model.findOneAndDelete({
      $or: [{ class: className }, { envClass: className }],
    }); // match by class field
    if (deleted) {
      res.json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Class not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

router.post("/:modelName", async (req, res) => {
  const { modelName } = req.params;
  const data = req.body;

  let Model;
  switch (modelName.toLowerCase()) {
    case "btptbooks":
      Model = BtptBook;
      break;
    case "hightextbooks":
      Model = HighTextBook;
      break;
    case "ibtedayetextbooks":
      Model = IbtedayeTextBook;
      break;
    case "technicaltextbooks":
      Model = TechnicalTextBook;
      break;
    case "dakiltextbooks":
      Model = DakilTextBook;
      break;
    case "lessonplans":
      Model = LessonPlan;
      break;
    case "primarytextbooks":
      Model = PrimaryTextBook;
      break;
    case "teachersguide":
      Model = TeachersGuide;
      break;
    case "bedbooks":
      Model = BEdBook;
      break;
    case "medbooks":
      Model = MEdBook;
      break;
       case "other":
      Model = OtherBook;
      break;

    case "other1":
      Model = Other1Book;
      break;

    case "other2":
      Model = Other2Book;
      break;

    case "other3":
      Model = Other3Book;
      break;
    case "other4":
      Model = Other4Book;
      break;

    case "other5":
      Model = Other5Book;
      break;
    case "carousel":
      Model = CarouselImage;
      break;
    case "card":
      Model = Card;
      break;
    default:
      return res.status(400).json({ message: "Invalid model name" });
  }

  console.log("data from class create", data);

  try {
    const newData = new Model(data); // Create a new Mongoose document from the incoming data
    await newData.save(); // Save it to MongoDB

    return res.status(201).json({
      // Send a success response with status 201 (Created)
      message: "Data saved",
      data: newData,
    });
  } catch (error) {
    console.error("Error saving data:", error); // Log error for debugging

    return res.status(500).json({
      // Send a 500 response for server error
      message: "Failed to save",
      error: error.message,
    });
  }
});

router.patch("/:modelName/:className", async (req, res) => {
  const { modelName, className } = req.params;
  // Avoid destructuring reserved keyword 'class'
  const { class: banglaClassData, envClass, version, serial } = req.body;
  console.log(req.body);
  // Dynamically get the correct model
  let Model;
  switch (modelName.toLowerCase()) {
    case "btptbooks":
      Model = BtptBook;
      break;
    case "hightextbooks":
      Model = HighTextBook;
      break;
    case "ibtedayetextbooks":
      Model = IbtedayeTextBook;
      break;
    case "technicaltextbooks":
      Model = TechnicalTextBook;
      break;
    case "dakiltextbooks":
      Model = DakilTextBook;
      break;
    case "lessonplans":
      Model = LessonPlan;
      break;
    case "primarytextbooks":
      Model = PrimaryTextBook;
      break;
    case "teachersguide":
      Model = TeachersGuide;
      break;
    case "bedbooks":
      Model = BEdBook;
      break;
    case "medbooks":
      Model = MEdBook;
      break;
       case "other":
      Model = OtherBook;
      break;

    case "other1":
      Model = Other1Book;
      break;

    case "other2":
      Model = Other2Book;
      break;

    case "other3":
      Model = Other3Book;
      break;
    case "other4":
      Model = Other4Book;
      break;

    case "other5":
      Model = Other5Book;
      break;
    default:
      return res.status(400).json({ message: "Invalid model name" });
  }

  try {
    const book = await Model.findOne({
      $or: [{ class: className }, { envClass: className }],
    });

    if (!book) return res.status(404).json({ message: "Class not found" });

    // Merge new data into the existing document
    if (version === "bangla") {
      (book.class = banglaClassData), (book.serial = serial);
    } else {
      book.envClass = envClass;
      book.serial = serial;
    }

    await book.save();

    res.json({ message: "Book updated successfully", success: true });
  } catch (error) {
    console.error("Error updating book:", error.message);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
});

router.patch("/cardandcarousel/:card/:cardId", async (req, res) => {
  const { card, cardId } = req.params;
  // Avoid destructuring reserved keyword 'class'

  try {
    const data = req.body;
    const Model = card === "card" ? Card : CarouselImage;
    console.log("card", card, "cardId", cardId, "data", data);

    const book = await Model.findById(cardId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    console.log("Book is found", book);

    Object.assign(book, data);

    await book.save();

    res.json({ message: "Book updated successfully", success: true, book });
  } catch (error) {
    console.error("Error updating book:", error.message);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
});

router.delete("/cardandcarousel/:card/:cardId", async (req, res) => {
  const { card, cardId } = req.params;

  try {
    console.log("card:", card, "cardId:", cardId);
    const Model = card === "card" ? Card : CarouselImage;

    const deletedBook = await Model.findByIdAndDelete(cardId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    console.log("Deleted book:", deletedBook);

    res.json({ message: "Book deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
});

router.delete("/:modelName/:className/:version/:bookId", async (req, res) => {
  const { modelName, className, version, bookId } = req.params;
  console.log(modelName, className, version, bookId);
  try {
    const book = await TechnicalTextBook.findOne({
      $or: [{ class: className }, { envClass: className }],
    });
    if (!book) return res.status(404).json({ message: "Class not found" });

    if (version === "bangla") {
      const updatedSubs = book?.subs.filter((b) => b._id.toString() !== bookId);
      book.subs = updatedSubs;
    } else {
      const updatedEnvSubs = book?.envSubs.filter(
        (b) => b._id.toString() !== bookId
      );
      book.envSubs = updatedEnvSubs;
    }

    await book.save(); // ✅ Save the updated document to MongoDB

    return res.status(200).json({ message: "Book deleted successfully", book });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
});

export default router;
