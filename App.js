import React, { useState } from 'react';
import playerData from './data';
import Dropdown from './dropdown';
import Record from './Record';
import RoundRecord from './RoundRecord';
import YearRecord from './YearRecord';
import RoundPie from './RoundPie';
import RoundRecordKey from './RoundRecordKey';
import SetsRecordPie from './SetsRecordPie';
import SetsRecordPieKey from './SetsRecordPieKey';
import YearPie from './YearPie';
import YearPieKey from './YearPieKey';
import YearTimeRecord from './YearTimeRecord';
import SetsRecord from './SetsRecord';



function App() {

  const [player, setPlayer] = useState("Roger Federer")

  const selectPlayer = (playerName) => {
    setPlayer(playerName);
  }

  function findAvgRanking(playerName) {
    var winsRankingTotal = 0;
    var lossesRankingTotal = 0;
  
    for(let i=0; i<playerData[player]["wins"].length;i++) {
      let rank = parseInt(playerData[player]["wins"][i][5]);
      if (rank > 0) {
        winsRankingTotal += rank;
      }
    }
    for(let i=0; i<playerData[player]["losses"].length;i++) {
      let rank = parseInt(playerData[player]["losses"][i][5]);
      if(rank > 0) {
        lossesRankingTotal += rank;
      }
    }
    return ((winsRankingTotal + lossesRankingTotal) / (playerData[player]["wins"].length + playerData[player]["losses"].length)).toString().slice(0, 5);  
  }

  function findAvgRankingByResult (player, result) {
    var rankingTotal = 0;
  
    for(let i=0; i<playerData[player][result].length;i++) {
      let rank = parseInt(playerData[player][result][i][5]);
      if (rank > 0) {
        rankingTotal += rank;
      }
    }
    return (rankingTotal/playerData[player][result].length).toString().slice(0, 5);
  }

  function findMostPlayed(player) {
    var opps = [];
    for(let k = 0; k<playerData[player]["wins"].length; k++) {
      opps.push(playerData[player]["wins"][k][4]);
    }
    for(let k = 0; k<playerData[player]["losses"].length; k++) {
      opps.push(playerData[player]["losses"][k][4]);
    }

    return (opps.sort((a,b) =>
          opps.filter(v => v===a).length - opps.filter(v => v===b).length
    ).pop());
  }

  return (
    <main>
      <section className="main-section section">
        <div className='title'>
          <h2>Player Stats</h2>
        </div>
        <div className='spacer'></div>
        <Dropdown playersList={playerData} setPlayer={setPlayer}/>

        <div className='spacer'></div>
        <div className='spacer'></div>

        <div className='flex'>
          <div className='player-bio-wrapper'>
            <h2>{player}</h2>
            <div className='spacer'></div>
            <div className='spacer'></div>
            <div className='grid'>
              <div>
                <p><b>Age:</b> {playerData[player]["Age"]}</p>
                <p><b>Country:</b> {playerData[player]["Country"]}</p>
                <p><b>Turned Pro:</b> {playerData[player]["Pro"]}</p>
              </div>
              <div>
                <p><b>Ranking:</b> {playerData[player]["Rank"]}</p>
                <p><b>Titles:</b> {playerData[player]["Titles"]}</p>
                <p><b>Prize Money:</b> {playerData[player]["Prize Money"]}</p>
              </div>
            </div>
            <div className='spacer'></div>
          </div>
        </div>

        <div className='spacer'></div>
        <div className='spacer'></div>


        <div className='flex'>
          <div className='matches-played-wrapper'>
            <div className='spacer'></div>
            <div className='matches'>
              <p>Matches Played</p>
              <h3>{playerData[player]["wins"].length + playerData[player]["losses"].length}</h3>
            </div>
            
            <div id="recordWrapper" className='flex'>
              <Record data={[playerData[player]["wins"].length, playerData[player]["losses"].length]} id={0}/>
            </div>

            <div className='opponent'>
              <p>Average Opponent Ranking</p>
              <h3>{findAvgRanking(player)}</h3>
            </div>
            
            <div className='opponent'>
              <p>Average Opponent Ranking By Result</p>
              <div className='grid'>
                <div className='result-opp-ranking green'>
                  <p className='result-label green'>Win</p>
                  <h3>{findAvgRankingByResult(player, "wins")}</h3>
                </div>
                <div className='result-opp-ranking red'>
                  <p className='result-label red'>Loss</p>
                  <h3>{findAvgRankingByResult(player, "losses")}</h3>
                </div>
              </div>
              
            </div>
            <div className='opponent'>
              <p>Most Played Opponent</p>
              <h3>{findMostPlayed(player)}</h3>
            </div>

            <div className='spacer'></div>
          </div>
        </div>

        <div className='spacer'></div>
        <div className='spacer'></div>

        <div className='flex'>
          <div className='match-record-year-wrapper'>
            <div className='spacer'></div>
            <p>Match Record Per Year</p>

            <div className='flex' id="record-year-graph">
              <YearRecord data={playerData[player]} id={1} />
            </div>
          </div>
        </div>

        <div className='spacer'></div>
        <div className='spacer'></div>

        <div className='flex'>
          <div className='match-record-round-pie-wrapper'>
            <div className='spacer'></div>
            <p>Match Amount Per Round</p>
            <div className='spacer'></div>
            <div className='spacer'></div>
            <div className='grid'>
              <div className='flex' id="record-round-pie-graph">
                <RoundPie data={playerData[player]} id={2} />
              </div>
              <div className='flex' id="record-round-pie-graph-key">
                <RoundRecordKey />
              </div>
              
              
            </div>
            <div className='spacer'></div>
            <div className='spacer'></div>
          </div>
        </div>

        <div className='spacer'></div>
        <div className='spacer'></div>

        <div className='flex'>
          <div className='match-record-round-wrapper'>
            <div className='spacer'></div>
            <p>Match Record Per Round</p>

            <div className='flex' id="record-round-graph">
              <RoundRecord data={playerData[player]} id={4} />
              <div className='spacer'></div>
            </div>
            
          </div>
        </div>
        
        <div className='spacer'></div>
        <div className='spacer'></div>

        <div className='flex'>
          <div className='match-record-sets-pie-wrapper'>
            <div className='spacer'></div>
            <p>Match Record Per Sets</p>
            <div className='spacer'></div>
            <div className='spacer'></div>
            <div className='grid'>
              <div className='flex' id="record-sets-pie-graph">
                <SetsRecordPie data={playerData[player]} id={5} />
              </div>
              <div className='flex' id="record-sets-pie-graph-key">
                <SetsRecordPieKey />
              </div>
              
              
            </div>
            <div className='spacer'></div>
            <div className='spacer'></div>
          </div>
        </div>

        <div className='spacer'></div>
        <div className='spacer'></div>

        <div className='flex'>
          <div className='match-record-sets-wrapper'>
            <div className='spacer'></div>
            <p>Match Record Per Number of Sets</p>

            <div className='flex' id="record-sets-graph">
              <SetsRecord data={playerData[player]} id={4} />
              <div className='spacer'></div>
            </div>
            
          </div>
        </div>

        <div className='spacer'></div>
        <div className='spacer'></div>

        <div className='flex'>
          <div className='match-record-year-pie-wrapper'>
            <div className='spacer'></div>
            <p>Match Amount Per Time of Year</p>
            <div className='spacer'></div>
            <div className='spacer'></div>
            <div className='grid'>
              <div className='flex' id="record-year-pie-graph">
                <YearPie data={playerData[player]} id={5} />
              </div>
              <div className='flex' id="record-year-pie-graph-key">
                <YearPieKey />
              </div>
              
              
            </div>
            <div className='spacer'></div>
            <div className='spacer'></div>
          </div>
        </div>

        <div className='spacer'></div>
        <div className='spacer'></div>

        <div className='flex'>
          <div className='match-record-yeartime-wrapper'>
            <div className='spacer'></div>
            <p>Match Record Per Time of Year</p>

            <div className='flex' id="record-yeartime-graph">
              <YearTimeRecord data={playerData[player]} id={4} />
              <div className='spacer'></div>
            </div>
            
          </div>
        </div>


        
        
        
      </section>
    </main>
  );
}

export default App;


/* 
TODO:

New colors for round pie chart
DONE: Add interesting header for entire website
DONE: Change color of player select button

DONE: New colors for year time pie chart

DONE: Make highlights for pie chart consistent with other highlights
DONE: make highlights for the match record per round graph
DONE: Add win rate to year record graph

DONE: Add color text for record bar?

DONE: Fix X axis for match record per round graph

DONE: Switch order of tooltip text

DONE: Add percents to all pie chart slices

DONE: Add new graphs for new info
  DONE: Results by sets number bar graph
  DONE: Matches per time of year pie chart
  DONE: Results by time of year bar graph

DONE: Add header with player stats
  DONE: Name
  DONE: Country
  DONE: Age
  DONE: Ranking
  DONE: Titles
  DONE: Prize money



*/