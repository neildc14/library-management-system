var Genre = require("../models/genre");
var Book = require("../models/book");
var async = require("async");
var mongoose = require("mongoose");

const navlinks = require("./modules/navlinks");

//middleware
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = function (req, res, next) {
  Genre.find()
    .sort({ name: "ascending" })
    .exec((err, list_genres) => {
      if (err) {
        return next(err);
      }
      res.render("genre_list", {
        title: "Genre List",
        genre_list: list_genres,
        error: err,
        active: "/catalog/genres",
        navlinks,
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = function (req, res, next) {
  var id = mongoose.Types.ObjectId(req.params.id);
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(id).exec(callback);
      },

      genre_books: function (callback) {
        Book.find({ genre: id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        var err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books,
        active: "/catalog/genres/:id",
        navlinks,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res, next) {
  res.render("genre_form", {
    title: "Create Genre",
    genre: undefined,
    error: null,
    active: "/catalog/genre/create",
    navlinks,
  });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  [body("name").toLowerCase().trim().isLength({ min: 1 }).escape()],

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    // const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre({ name: req.body.name });

    // Check if Genre with same name already exists.
    Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
      if (err) {
        return next(err);
      }

      if (found_genre) {
        // Genre exists, redirect to its detail page.
        // res.redirect(found_genre.url); original route
        res.render("genre_form", {
          title: "Create Genre",
          genre: genre,
          error: "This genre already exists.",
          active: "/catalog/genre/create",
          navlinks,
        });
      } else {
        genre.save(function (err) {
          if (err) {
            return next(err);
          }
          // Genre saved. Redirect to genre detail page.
          res.redirect(genre.url);
        });
      }
    });
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
