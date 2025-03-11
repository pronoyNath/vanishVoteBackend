# VanishVote - Polling Application API

VanishVote is a simple polling application API built with Node.js, Express, and MongoDB using Mongoose. This API allows users to create polls, vote on options, react to polls, and retrieve poll details, all with a defined expiration time and configurable visibility of results.

## Features

- **Create Polls**: Allows the creation of polls with a question, multiple options, and an expiration time.
- **Vote on Polls**: Users can vote for an option in a poll.
- **Reactions**: Users can react to a poll using emojis (e.g., "👍", "🔥").
- **Poll Expiration**: Polls can expire after a specified period, preventing further voting.
- **Visibility Control**: Poll creators can set the visibility of results ("show" or "hide").
- **MongoDB Integration**: Uses MongoDB to store poll data with Mongoose.

## Live Link
[**VanishVote - Live Demo Backend**](https://vote-backend-five.vercel.app)


This API can be deployed to platforms like Heroku or DigitalOcean. Once deployed, the live link can be shared here.

## Prerequisites

Before setting up this project, make sure you have:

- **Node.js**: [Download Node.js](https://nodejs.org/).
- **MongoDB**: Either install MongoDB locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vanishvote.git
cd vanishvote
