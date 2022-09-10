import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ReactDOM from "react-dom";
import config from "./config.json"

const client = new W3CWebSocket(config.realyServerUrl);

class Scores extends React.Component {
  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.state = {
      players: [],
      currentHash: ""
    };
  }

  componentWillMount() {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const msgJSON = JSON.parse(message.data)
      console.log(msgJSON)
      if (msgJSON.Type === "4") {
        let scores = this.state.players;
        const index = scores.findIndex(
          (player) => player.playerId === msgJSON.playerId
        );
        if (index === -1) scores.push(msgJSON);
        else {
          scores[index] = msgJSON;
        }
        scores.sort(function (a, b) {
          return b.acc - a.acc;
        });
        this.setState({ players: scores });
      }
      if (msgJSON.Type === "1") {
        console.log("Match created");
        this.setState({ players: [] })
      }
      if (msgJSON.Type === "2") {
        console.log("Match deleted");
        this.setState({ players: [] })
        this.forceUpdate()
      }
      if (msgJSON.Type === "3") {
        this.setState({ currentHash: msgJSON.LevelId })
        this.setState({ players: [] })
      }
    };
  }

  render() {
    return (
      <div>
        {this.state.players.map((player, index) => (
          <Score
            key={index}
            playerName={player.playerName}
            acc={player.acc}
            score={player.score}
            combo={player.combo}
            playerId={player.playerId}
            pos={index + 1}
          />
        ))}
      </div>
    );
  }
}

class Score extends React.Component {
  render() {
    const { playerName, acc, score, combo, playerId, pos } = this.props;
    return (
      <div id="player">
        {pos}.
        <img
          src={`https://cdn.scoresaber.com/avatars/${playerId}.jpg`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src="https://cdn.scoresaber.com/avatars/oculus.png";
          }}
          alt="."
          width="40"
          height="40" />
        <div id="playerInfo">
          <div id="playerNameAcc"><div>{playerName}</div>  <div>{(Math.round(acc * 100 * 100) / 100).toFixed(2)}%</div></div>
          <div id="playerScoreCombo"> <div>{score}</div> <div>x{combo}</div></div>
        </div>
      </div>
    );
  }
}

<body id="root"></body>;

ReactDOM.render(<Scores></Scores>, document.getElementById("root"));

export default Scores;