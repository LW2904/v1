const SteamUser = require('steam-user')
const steamtotp = require('steam-totp')

const DATA = require('../../steamdata')
const ACCOUNTS = [ 'main' ]

const INTERVAL_HIDE = 5 * 60 * 1000
const INTERVAL_ERROR = 10 * 60 * 1000
const INTERVAL_PLAYING = 15 * 60 * 1000
const INTERVAL_RATELIMIT = 6 * 60 * 60 * 1000

// const INTERVAL = {
//   hide: 5 * 60 * 1000,
//   error: 10 * 60 * 1000,
//   playing: 15 * 60 * 1000,
//   ratelimit: 6 * 60 * 60* 1000
// }

const hide = (client) => {
  console.log(`hide called`)
  client.gamesPlayed([])
  client.gamesPlayed([399220, 399080, 399480])
  client.gamesPlayed([])
}

const login = (client, account) => {
  console.log(`login called`)
  client.logOn({
    accountName: account.name,
    password: account.password
  })
}

const build = (account) => {
  console.log(`build called`)
  const client = new SteamUser()

  client.setOption('promptSteamGuardCode', false)

  login(client, account)

  client.on('steamGuard', (domain, callback) => {
    console.log(`steamGuard received`)
    steamtotp.getAuthCode(account.shasec, (err, code, offset, latency) => {
      if (err) console.error(err)
      callback(code)
    })
  })

  let timer
  client.on('loggedOn', details => {
    console.log(`loggedOn received`)
    hide(client)
    timer = setInterval(hide, INTERVAL_HIDE, client)
  })

  client.on('error', err => {
    clearInterval(timer)

    console.error('error: ' + err.message || err.msg || err) // Just in case.

    if (err.message === 'LoggedInElsewhere') {
      setTimeout(
        function () { timer = setInterval(hide, INTERVAL_PLAYING, client) },
        10*60*1000
      )
    } else {
      let i = (err.message === 'RateLimitExceeded' ? INTERVAL_RATELIMIT : INTERVAL_ERROR)
      client.logOff()
      setTimeout(login, i, client)
    }
  })
}

for (let name in DATA)
  if (ACCOUNTS.includes(name)) build(DATA[name])
