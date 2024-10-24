const Webinar = require("../models/webinarModel");
const axios = require("axios");

// Fungsi komentar user
exports.userComment = async (req, res) => {
  const { comment } = req.body;
  const userId = req.user.id;
  const name = req.user.name; // Dapatkan nama pengguna dari token JWT

  if (!comment) {
    return res.status(400).json({ message: "Comment is required" });
  }

  try {
    // Temukan webinar berdasarkan ID
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    if (!webinar.comments) {
      webinar.comments = [];
    }

    // Sertakan nama pengguna dan hasil analisis sentimen saat menambahkan komentar
    webinar.comments.push({ user: userId, name, comment });

    await webinar.save();

    res.status(201).json(webinar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// fungsi rating user
exports.userRating = async (req, res) => {
  const { rating } = req.body;

  try {
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    if (!webinar.ratings) {
      webinar.ratings = []; // Inisialisasi jika belum ada rating
    }

    const existingRating = webinar.ratings.find((r) => r.user.toString() === req.user.id);

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
    } else {
      // Tambahkan rating baru
      webinar.ratings.push({ user: req.user.id, rating });
    }

    await webinar.save();
    res.status(201).json(webinar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
