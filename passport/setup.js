//authentication middleware
passport.use(
  new LocalStrategy(function (username, password, cb) {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return cb(null, false);
        }

        // Function defined at bottom of app.js
        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      })
      .catch((err) => {
        cb(err);
      });
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI, //(URI FROM.env file)
});

app.use(
  session({
    //secret: process.env.SECRET,
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 30,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
