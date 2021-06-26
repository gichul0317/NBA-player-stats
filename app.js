const app = {
  headshotURL:
    'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/',
  idURL: 'http://data.nba.net/data/10s/prod/v1/2020/players.json',
  profileURL: 'http://data.nba.net/data/10s/prod/v1/2020/players',

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
            const originalFirstName = player.firstName;
            const originalLastName = player.lastName;
            const firstName = player.firstName.toLowerCase();
            const lastName = player.lastName.toLowerCase();
            const playerID = player.personId;
            const position = player.pos;
            const dateofBirth = player.dateOfBirthUTC;
            const heightFeet = player.heightFeet;
            const heightInches = player.heightInches;
            const jersey = player.jersey;
            const weight = player.weightPounds;
            const country = player.country;

            if (userSelection === `${firstName} ${lastName}`) {
              const playerProfile = app.getProfile(playerID);
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
                <h2>${originalFirstName} ${originalLastName}</h2>
                <p>Position: ${position} Number: ${jersey} year: ${year}</p>
                <p>Date of Birth: ${dateofBirth} Country: ${country}</p> 
                <p>Height: ${heightFeet}.${heightInches} feets Weight: ${weight} lb</p>
                <p>PPG: ${ppg} RPG: ${rpg} APG: ${apg} BPG: ${bpg} spg: ${spg}</p>
                <p>Points: ${point} Offensive Rebounds: ${offRebound} Defensive Rebounds: ${defRebound}</p>
                <p>Assists: ${assist} Blocks: ${block} Steals: ${steal}</p>
                <p>Games Played: ${gamesPlayed} Games Started: ${gamesStarted}</p>
                </div>
                `;
                $('div.content').append(playerInfo).hide().show('slow');
              });
              $('img.playerImage').attr(
                'src',
                `${app.headshotURL}/${playerID}.png`
              );
              $('img.playerImage').attr(
                'alt',
                `Headshot image for ${originalLastName} ${originalLastName}`
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
