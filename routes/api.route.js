const router = require("express").Router();
const cfg = require("../controllers/cfg.controller.js");

router.get("/popular-sgm/sports", cfg.getSports);
router.get(
  ///popular-sgm/sport/soccer/competition/UEFA-Europa-League-Futures/matches
  "/popular-sgm/sport/:sportName/competition/:competitionName/matches",
  cfg.getMatches
);
router.get(
  ///popular-sgm/sport/soccer/competition/UEFA-Europa-League-Futures/matches/UEFA-Europa-League-22-23/markets
  "/popular-sgm/sport/:sportName/competition/:competitionName/matches/:matchName/markets",
  cfg.getMarkets
);
router.get(
  ///popular-sgm/sport/soccer/competition/UEFA-Europa-League-Futures/matches/UEFA-Europa-League-22-23/markets
  "/popular-sgm/sport/:sportName/competition/:competitionName/tournament/:tournamentName/matches",
  cfg.getFromTournament
);
router.get(
  ///popular-sgm/sport/tennis/competition/Wimbledon/tournaments/WimbledonMens-Futures/matches/WimbledonMens-Winner-20-23/markets
  "/popular-sgm/sport/:sportName/competition/:competitionName/tournaments/:tournamentName/matches/:matchName/markets",
  cfg.getTournamentMarkets
);

module.exports = router;
