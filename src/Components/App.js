import React, {useState} from 'react';
import './App.css';
import {gameHandler, resetGameAC, setGameLvlAC, setPrevTile, startGame} from "../Redux/rootReducer";
import {connect} from "react-redux";
import {Tile} from "./Tile";

let App = (props) => {
  // Информация о уровнях сложности
  let lvlInfo = props.gameLevels.map(elem => {
    return (
        <>
          <br/>
          {elem.lvlTitle + ' - ' + elem.tilesCount}
        </>
    )
  });
  // Опции для select с уровнями сложности
  let lvlOptions = props.gameLevels.map(elem => {
    let isSelected = elem.lvl == props.gameSettings.lvl;
    return (
        <option key={elem.lvl} selected={isSelected} value={elem.lvl}>{elem.lvlTitle}</option>
    )
  });

  const [tileVisible, setTileVisible] = useState(false);
  const tileHandler = (tileId) => {
    props.gameHandler(tileId);
    props.setPrevTile(tileId);
  }

  let tileWidthHeight = 100 / Math.sqrt(props.gameSettings.tilesCount) + '%';
  let Board;
  if(props.tiles) {
    Board = props.tiles.map(elem => {
      return (
          <Tile key={elem.id}
                tileHandler={tileHandler}
                visible={tileVisible}
                tile={elem}
                WH={tileWidthHeight}
          />
      )
    })
  }
  const hideTiles = () => {
    setTileVisible(false);
  }
  const showTiles =() => {
    setTileVisible(true);
  }
  const start = () => {
    props.startGame();
  }
  const setLvl = (e) => {
    props.resetGame();
    props.setGameLvl(+e.target.value);
  }

  return (
    <div className="App">
      <div className="controllers">
        <div>
          <p>
            <b>Select the game level:</b>
            {lvlInfo}
          </p>
          <select onChange={setLvl}>
            {lvlOptions}
          </select>
        </div>
        <button className="start" onClick={start}>Start</button>
        <button className="showTiles" onClick={showTiles}>Show all tiles</button>
        <button className="hideTiles" onClick={hideTiles}>Hide all tiles</button>
      </div>
      <div className="round wrap">Round:
        <span className="roundState">{props.currentRound} / {props.gameSettings.tilesCount / 2 - 1}</span>
      </div>
      <div className="wrap">
        <div id="infoContainer">{props.gameMessage}</div>
        <div id="board">
          {Board}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    gameLevels: state.gameLevels,
    gameSettings: state.gameSettings,
    tiles: state.tiles,
    currentRound: state.currentRound,
    gameMessage: state.gameMessage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGameLvl: (lvl) => dispatch(setGameLvlAC(lvl)),
    startGame: () => dispatch(startGame()),
    setPrevTile: (tileId) => dispatch(setPrevTile(tileId)),
    gameHandler: (tileId) => dispatch(gameHandler(tileId)),
    resetGame: () => dispatch(resetGameAC())
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
