const express = require('express')
const path = require('path')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null
const inilitizeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log(`Server running at http://localhost:3000`)
    })
  } catch (e) {
    console.log(`Db Error ${e.message}`)
    process.exit(1)
  }
}

inilitizeDatabaseAndServer()

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    select 
    *
    from 
    cricket_team;`
  const playersArray = await db.all(getPlayersQuery)
  response.send(playersArray)
})

app.post('/players/', async (request, response) => {
  const getDetails = request.body
  const {playerName, jerseyNumber, role} = detDetails
  const addPlayerQuery = `
    INSERT INTO
      cricket_team(player_name, jersey_number, role)
    values (
        ${playerName},
        ${jerseyNumber},
        ${role}
    );`
  const dbResponse = await db.run(addPlayerQuery)
  response.send('Player Added To Team')
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
    select * From cricet_team
    where player_id = ${playerId};`
  const player = await db.get(getPlayerQuery)
  const {player_id, player_name, jersey_number, role} = player
  const dbresponse = {
    playerId: player_id,
    playerName: player_name,
    jerseyNumber: jersey_number,
    role: role,
  }
  response.send(dbresponse)
})

app.put('players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getBody = request.body
  const {playerName, jerseyNumber, role} = getBody
  const updatePlayerQuery = `
  update 
  cricket_team
  set 
  player_name : ${playerName},
  jersey_number : ${jerseyNumber},
  role:${role}
  where
  player_id = ${playerId};`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete('players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
    delete 
    from cricket_team
    where
    player_id = ${playerId};`
  await db.run(deletePlayerQuery)
  response.send('player Removed')
})

module.exports = app
