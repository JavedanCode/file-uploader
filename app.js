const express = require("express");
const expressSession = require("express-session");

const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./config/prisma");

const authRouter = require("./routes/authRoutes");
const folderRouter = require("./routes/folder");
const fileRouter = require("./routes/file");
const shareRouter = require("./routes/shareRoutes");

require("dotenv").config();
require("./config/passport");

const path = require("node:path");
const PORT = process.env.PORT || 3000;
const methodOverride = require("method-override");

const app = express();

//=========================================
//           MIDDLEWARE
//=========================================
app.set("trust proxy", 1);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(methodOverride("_method"));

//=========================================
//           SESSION
//=========================================
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdFunction: undefined,
      dbRecordIdIsSessionId: true,
    }),
  }),
);

//=========================================
//           PASSPORT
//=========================================
app.use(passport.session());

//=========================================
//           ROUTES
//=========================================
app.use("/auth", authRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);
app.use("/", shareRouter);

//=========================================
//           ERROR HANDLER
//=========================================
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500);

  res.render("500", {
    title: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : null,
  });
});

//=========================================
//           LISTEN
//=========================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
