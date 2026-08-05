require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");

const PrismaSessionStore =
  require("@quixo3/prisma-session-store").PrismaSessionStore;

const prisma = require("./config/prisma");

const app = express();

//=========================================
//           MIDDLEWARE
//=========================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//=========================================
//           SESSION
//=========================================
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 1000 * 60 * 2,
      dbRecordIdIsSessionId: true,
    }),
  }),
);

//=========================================
//           PASSPORT
//=========================================
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//=========================================
//           ROUTES
//=========================================
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

//=========================================
//           ERROR HANDLER
//=========================================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).send(err.message);
});

//=========================================
//           LISTEN
//=========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
