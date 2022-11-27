/*Module*/
const express = require("express");
var cors = require("cors");

/*Mes modules*/
const gestion_api_music = require("./gestion_api_music");
const gestion_user = require("./gestion_user");

/*creation app express*/
const listen = express();

/*Gestion requete externe*/
var corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200, // For legacy browser support
};
listen.use(cors(corsOptions));

/*Lire contenu json des requetes recu*/
listen.use(express.urlencoded({ extended: true }));
listen.use(express.json());

/*Requete parole*/
listen.get("/lyricsGestion/getLyrics/:singer-:song", async function (req, res) {
  if (req.params.singer && req.params.song) {
    try {
      const data = await gestion_api_music.GetLyrics(
        req.params.singer,
        req.params.song
      );
      res.status(200).json({ paroles: data });
    } catch (error) {
      console.log("here");
      res.status(400).send("Erreur lors de la recupération de la musique");
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});

listen.get(
  "/lyricsGestion/getsLyricsWithHole/:singer-:song-:difficulty",
  async function (req, res) {
    if (req.params.singer && req.params.song && req.params.difficulty) {
      try {
        const data = await gestion_api_music.GetLyricsWithHole(
          req.params.singer,
          req.params.song,
          req.params.difficulty
        );
        res.status(200).send(data);
      } catch (error) {
        res.status(500).send("Erreur lors de la recupération de la musique");
      }
    } else {
      res.status(400).send("Not enough parameters");
    }
  }
);

listen.post("/lyricsGestion/saveLyrics", async (req, res) => {
  if (req.body.artiste && req.body.musique) {
    try {
      let user = await gestion_user.verifyToken(req.headers["x-access-token"]);
      res.status(200).json({
        message: user,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});

/*Requete user*/
listen.post("/userGestion/register", async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      let retour = await gestion_user.register(
        req.body.username,
        req.body.password
      );
      res.status(200).json({
        message: retour,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});

listen.post("/userGestion/login", async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      let retour = await gestion_user.login(
        req.body.username,
        req.body.password
      );
      res.status(200).json(retour);
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});

/*gestion autres requetes*/
listen.use(function (req, res, next) {
  res.status(404).send("Nothing Here");
});

listen;

module.exports = listen;
