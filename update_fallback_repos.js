const fs = require('fs');
const https = require('https');

function handleError(err) {
  console.error('Error: ' + err);
}

const options = {
  host: 'api.github.com',
  path: '/users/tplk/repos?affiliation=owner&visibility=public',
  method: 'GET',
  headers: {'user-agent': 'node.js'},
};

const request = new Promise((resolve, reject) => {
  https.get(
    options,
    response => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    },
  ).on('error', err => reject(err));
});

request
  .then(res => JSON.parse(res))
  .then(repos => repos
    .filter(repo => repo.fork === false)
    .map(repo => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
    })))
  .then(repos => fs.writeFile(
    'fallback_repos.json',
    JSON.stringify(repos),
    'utf8',
    (err) => err ? handleError(err) : console.log('Fallback repos successfully updated!')
    ))
  .catch(err => handleError(err));
