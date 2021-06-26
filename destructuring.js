const app = {
  headshotURL:
    'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/',
  idURL: 'http://data.nba.net/data/10s/prod/v1/2020/players.json',
  profileURL: 'http://data.nba.net/data/10s/prod/v1/2020/players',

  $divContent: $('div.content'),
  $playerImg: $('img.playerImage'),

  getID: function () {
    const response = $.ajax({
      url: app.idURL,
      method: 'GET',
      dataType: 'json',
    });
    return response;
  },

  getProfile: function (personId) {
    const response = $.ajax({
      url: `${app.profileURL}/${personId}_profile.json`,
      method: 'GET',
      dataType: 'json',
    });
    return response;
  },

  displayInfo: function () {
    const id = app.getID();
    id.done(function (data) {
      $('form').on('submit', function (event) {
        event.preventDefault();
        $('div.content').empty();
        $('img').attr('src', '');
        $('img').attr('alt', '');
        const userSelection = $('.playerSearch').val().trim().toLowerCase();
        const dataSet = data.league.standard;

        if (userSelection.includes(' ') === true) {
          dataSet.forEach(function (player) {
            const {
              firstName,
              lastName,
              personId,
              pos,
              dateOfBirthUTC,
              heightFeet,
              heightInches,
              jersey,
              weightPounds,
              country,
            } = player;

            if (
              userSelection ===
              `${firstName.toLowerCase()} ${lastName.toLowerCase()}`
            ) {
              const playerProfile = app.getProfile(personId);
              playerProfile.done(function (player) {
                const ppg = player.league.standard.stats.latest.ppg;
                const rpg = player.league.standard.stats.latest.rpg;
                const apg = player.league.standard.stats.latest.apg;
                const year = player.league.standard.stats.latest.seasonYear;
                const bpg = player.league.standard.stats.latest.bpg;
                const spg = player.league.standard.stats.latest.spg;
                const assist = player.league.standard.stats.latest.assists;
                const block = player.league.standard.stats.latest.blocks;
                const steal = player.league.standard.stats.latest.steals;
                const offRebound = player.league.standard.stats.latest.offReb;
                const defRebound = player.league.standard.stats.latest.defReb;
                const point = player.league.standard.stats.latest.points;
                const gamesPlayed =
                  player.league.standard.stats.latest.gamesPlayed;
                const gamesStarted =
                  player.league.standard.stats.latest.gamesStarted;
                const playerInfo = `
                <div>
                <h2>${firstName} ${lastName}</h2>
                <p>Position: ${pos} Number: ${jersey} year: ${year}</p>
                <p>Date of Birth: ${dateOfBirthUTC} Country: ${country}</p> 
                <p>Height: ${heightFeet}.${heightInches} feets Weight: ${weightPounds} lb</p>
                <p>PPG: ${ppg} RPG: ${rpg} APG: ${apg} BPG: ${bpg} spg: ${spg}</p>
                <p>Points: ${point} Offensive Rebounds: ${offRebound} Defensive Rebounds: ${defRebound}</p>
                <p>Assists: ${assist} Blocks: ${block} Steals: ${steal}</p>
                <p>Games Played: ${gamesPlayed} Games Started: ${gamesStarted}</p>
                </div>
                `;
                app.$divContent.append(playerInfo).hide().show('slow');
              });
              app.$playerImg.attr('src', `${app.headshotURL}/${personId}.png`);
              app.$playerImg.attr(
                'alt',
                `Headshot image for ${firstName} ${lastName}`
              );
            }
          });
        } else {
          alert('Please enter full name to search players');
        }
      });
    });
  },

  init: function () {
    app.displayInfo();
  },
};

$('document').ready(function () {
  app.init();
});
