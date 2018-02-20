// apiKey=LwoT2HQa2Ozwopn32-gcB2crvgctRx7e
// mongoimport -h ds133558.mlab.com:33558 -d ivis -c test -u test -p test --file data-refugees.csv --type csv --headerline

function getCountriesFromYear(year, cb) {
    console.log(`Looking for countries at year: ${year}`)
    $.ajax({
      url: `https://api.mlab.com/api/1/databases/ivis/collections/test?q={'Year': ${year}}&apiKey=LwoT2HQa2Ozwopn32-gcB2crvgctRx7e`,
      type: "GET",
      contentType: "application/json"
  }).done(function( msg ) {
      cb(msg)
  });
}

