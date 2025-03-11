const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Poll Schema
const pollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  votes: { type: Map, of: Number, default: {} },
  reactions: { type: Map, of: Number, default: {} },
  expiresAt: Date,
  isPublic: { type: Boolean, default: true },
  showResults: { type: String, enum: ["hide", "show"], default: "hide" }, // Add this field
  createdAt: { type: Date, default: Date.now },
});

const Poll = mongoose.model("Poll", pollSchema);

// Routes
app.post("/api/polls", async (req, res) => {
  console.log("Request Body:", req.body); // Debug: Log the request body
  const { question, options, expiresIn, showResults } = req.body;

  if (!question || !options || !expiresIn || !showResults) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000); // Convert hours to milliseconds
    // const expiresAt = new Date(Date.now() + 10 * 1000); // 10 sec = 10 * 1000 ms


    const poll = new Poll({ question, options,showResults, expiresAt });
    await poll.save();
    console.log("Poll saved:", poll); // Debug: Log the saved poll
    res.json({ id: poll._id, link: `http://localhost:3000/poll/${poll._id}` });
  } catch (error) {
    console.error("Error saving poll:", error); // Debug: Log any errors
    res.status(500).json({ error: "Failed to save poll" });
  }
});
app.get("/api/polls/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // Ensure votes is a Map
    if (poll.votes && typeof poll.votes === "object" && !(poll.votes instanceof Map)) {
      poll.votes = new Map(Object.entries(poll.votes));
    }

    // Return the poll data even if it has expired
    res.json(poll);
  } catch (error) {
    console.error("Error fetching poll:", error);
    res.status(500).json({ error: "Failed to fetch poll" });
  }
});
app.get("/", async (req, res) => {
  const x = "hello";
  res.send(x)
});

app.post("/api/polls/:id/vote", async (req, res) => {
  const { option } = req.body;
  const poll = await Poll.findById(req.params.id);
  if (!poll || poll.expiresAt < new Date()) {
    return res.status(404).json({ error: "Poll not found or expired" });
  }
  poll.votes.set(option, (poll.votes.get(option) || 0) + 1);
  await poll.save();
  res.json({ success: true });
});
app.post("/api/polls/:id/react", async (req, res) => {
  const { reaction } = req.body; // Reaction type (e.g., "🔥", "👍")
  const poll = await Poll.findById(req.params.id);

  if (!poll || poll.expiresAt < new Date()) {
    return res.status(404).json({ error: "Poll not found or expired" });
  }

  // Increment the reaction count
  poll.reactions.set(reaction, (poll.reactions.get(reaction) || 0) + 1);
  await poll.save();

  res.json({ success: true, reactions: Object.fromEntries(poll.reactions) });
});



// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));