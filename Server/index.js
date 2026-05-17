import express from "express";

import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import UserModel from "./Models/userModel.js";
import bookModel from "./Models/bookModel.js";
import commentModel from "./Models/commentModel.js";
import postModel from "./Models/postModel.js";

const app = express();
app.use(express.json());
app.use(cors());

// Configure Multer for image uploads
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const costring = "mongodb+srv://mallak:mallak@cluster0.eijuzc4.mongodb.net/book?appName=Cluster0";

mongoose.connect(costring)
  .then(() => {
    console.log("Success: Connected to HIBR Database (book)");
    // Start the server only after the database is connected
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch((err) => console.error("Error: Could not connect to MongoDB", err));

// Static folder for serving uploaded images
app.use('/uploads', express.static('uploads'));

// Add a health check route to verify the server is reachable
app.get("/", (req, res) => {
    res.send("Server is running and reachable!");
});

app.post("/registerUser", async (req, res) => {
    try {
        const { username, email, password, gender, birthdate } = req.body;
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        

        const newUser = new UserModel({
            username,
            email,
            password: hashedpassword,
            gender,
            birthdate,
        });
        await newUser.save();
        
        const userResponse = newUser.toObject();
        delete userResponse.password;
        res.status(201).json({ user: userResponse, msg: "Added." });
        } catch (error) {
        console.error("Save Error:", error.message);
        res.status(500).json({ message: "Database Save Failed: " + error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json({ user: userResponse, message: "Success." });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Login Failed: " + error.message });
    }
});

app.put("/updateUserProfile/:email", upload.single("image"), async (req, res) => {
    try {
        const email = req.params.email.trim();
        const { username, password, gender, birthdate } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username) user.username = username;
        if (gender) user.gender = gender;
        if (birthdate) user.birthdate = birthdate;
        
        if (req.file) {
            user.image = req.file.filename;
        }
        
        // If a new password is provided and it's different from the hash
        if (password && password !== "") {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({ user, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update Error:", error.message);
        res.status(500).json({ message: "Update Failed: " + error.message });
    }
});

// Route for logging out a user
app.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
});

// Route to add a new book
app.post("/addBook", upload.single("image"), async (req, res) => {
    try {
        const { title, author, description, rating, userEmail } = req.body;
        const newBook = new bookModel({
            title,
            author,
            description,
            rating,
            userEmail,
            image: req.file ? req.file.filename : null
        });
        await newBook.save();
        res.status(201).json({ book: newBook, message: "Book added successfully" });
    } catch (error) {
        console.error("Add Book Error:", error.message);
        res.status(500).json({ message: "Failed to add book: " + error.message });
    }
});

// Route to get all books
app.get("/getBooks", async (req, res) => {
    try {
        // Fetch all books
        const books = await bookModel.find().lean().sort({ createdAt: -1 });
        
        // Fetch comments for each book and attach them
        const booksWithComments = await Promise.all(books.map(async (book) => {
            const comments = await commentModel.find({ bookId: book._id }).sort({ createdAt: -1 });
            return { ...book, comments };
        }));

        res.status(200).json(booksWithComments);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books: " + error.message });
    }
});

// Route to delete a book
app.delete("/deleteBook/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await bookModel.findByIdAndDelete(id);
    
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete the image file from the uploads folder if it exists
    if (deletedBook.image) {
      const imagePath = path.join(uploadDir, deletedBook.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting", error });
  }
});

// Route to add a comment to a book
app.post("/books/:bookId/comments", async (req, res) => {
    try {
        const { bookId } = req.params;
        const { text, userEmail, username } = req.body;

        const newComment = new commentModel({
            bookId,
            text,
            userEmail,
            username
        });

        await newComment.save();
        res.status(201).json({ comment: newComment, message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment: " + error.message });
    }
});

// Route to toggle like on a comment
app.put("/books/:bookId/comments/:commentId/like", async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userEmail } = req.body;

        const comment = await commentModel.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        const userIndex = comment.likes.users.indexOf(userEmail);

        if (userIndex !== -1) {
            // Toggle Off: remove from array
            comment.likes.users.splice(userIndex, 1);
        } else {
            // Toggle On: add to array
            comment.likes.users.push(userEmail);
        }

        // Deriving count from array length prevents -1 and keeps data in sync
        comment.likes.count = comment.likes.users.length;
        await comment.save();

        res.status(200).json({ 
            commentId: comment._id, 
            likes: comment.likes, 
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to like comment: " + error.message });
    }
});

/* --- Global Feed / Posts APIs --- */

// Get all posts for the global feed
app.get("/getPosts", async (req, res) => {
    try {
        const posts = await postModel.find().sort({ createdAt: -1 });
        const count = await postModel.countDocuments();
        res.status(200).json({ posts, count });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts: " + error.message });
    }
});

// Create a new global post
app.post("/savePost", async (req, res) => {
    try {
        const { postMsg, email, username } = req.body;
        const newPost = new postModel({ postMsg, email, username });
        await newPost.save();
        res.status(201).json({ post: newPost, msg: "Post shared successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to save post: " + error.message });
    }
});

// Toggle like on a global post
app.put("/likePost/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const { email } = req.body; // Using email as the unique identifier

        const postToUpdate = await postModel.findById(postId);
        if (!postToUpdate) return res.status(404).json({ message: "Post not found" });

        const userIndex = postToUpdate.likes.users.indexOf(email);

        if (userIndex !== -1) {
            postToUpdate.likes.users.splice(userIndex, 1);
        } else {
            postToUpdate.likes.users.push(email);
        }

        postToUpdate.likes.count = postToUpdate.likes.users.length;
        await postToUpdate.save();

        res.status(200).json({ post: postToUpdate, msg: userIndex !== -1 ? "Unliked" : "Liked" });
    } catch (error) {
        res.status(500).json({ message: "Interaction failed: " + error.message });
    }
});
