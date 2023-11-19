const express = require("express");
const fetchuser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Route 1: Get all notes
router.get("/allnotes", fetchuser, async (req, res) => {
  const notes = await Note.find({ user: req.user});
  res.json(notes);
});

//Route 2: Create a note
router.post(
  "/createnote",
  fetchuser,
  [
    body("title", "Enter Valid Title").isLength({ min: 2 }),
    body("description", "Description must be atleast 5 charcters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //errors any ? return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //Create new note
      const note = new Note({
        title,
        description,
        tag,
        user: req.user,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 3 : Edit/update an existing note
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Note not found");
    }

    // Check if the authenticated user is the owner of the note
    if (note.user.toString() !== req.user) {
      return res.status(401).send("Unauthorized access");
    }

    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ updatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE 4 : Delete an existing note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Note not found");
    }

    // Check if the authenticated user is the owner of the note
    if (note.user.toString() !== req.user) {
      return res.status(401).send("Unauthorized access");
    }

    // Update the note
    const noteToBeDeleted = await Note.findByIdAndDelete(req.params.id);
    res.json({
      Success: "Note has been deleted",
      note: note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
