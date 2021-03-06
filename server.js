const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const passport = require("passport");
const routes = require("./routes/auth-route");
const cookieSession = require("cookie-session");
const controlRoutes = require("./controllers");
const passportSetup = require("./config/passport-setup");
const profileRoutes = require('./routes/profile-routes');
const helpers = require("./utils/helpers");
const http = require("./config/gamescript");
require('dotenv').config

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;


const hbs = exphbs.create({
  helpers: {
    cap: function (arr) {
      if (!Array.isArray(arr)) {
        return [];
      }
      return arr.slice(0, 9);
    },
  },
});

const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(cookieSession({
  // To change how long the cookie lasts change the first number which is based on hours
  maxAge: 24*60*60*1000,
  keys: [ process.env.COOKIEKEY]
}));

// initialize passport
app.enable("trust proxy");
app.use(passport.initialize());
app.use(passport.session());

app.use(session(sess));
app.use(express.static("public"));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "/../public")));

// app.use(routes);npm
app.use("/auth", routes);
app.use('/googleprofile', profileRoutes);
app.use(controlRoutes);
app.use(express(http));

// app.get('/',(req,res => {
//   res.prependListener('homepage')

// }))

// app.post("/login", passportSetup.authenticate("local"), function (req, res) {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   res.redirect("/users/" + req.user.username);
// });

app.use((req, res) => {
  res.status(404).end();
});

// app.listen(PORT);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on: http://localhost:` + PORT)
  );
});

// app.listen(PORT, () => {
//     console.log(`Server running on: http://localhost:` + PORT);
// });
