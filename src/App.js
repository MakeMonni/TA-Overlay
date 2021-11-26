import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ReactDOM from "react-dom";

const client = new W3CWebSocket("ws://127.0.0.1:8000");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.state = {
      players: [],
    };
  }

  componentWillMount() {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const msgJSON = JSON.parse(message.data);
      if (msgJSON.type === "mapChange") {
        const emptyArr = []
        this.setState({ players: emptyArr })
      }
      else {
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

        console.log({ msgJSON, scores, index });
        this.setState({ players: scores });
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
        <img src={`https://cdn.scoresaber.com/avatars/${playerId}.jpg`} alt={playerId} width="40" height="40" />
        <div id="playerInfo">
          <div id="playerNameAcc"><div>{playerName}</div>  <div>{(Math.round(acc * 100 * 100) / 100).toFixed(2)}%</div></div>
          <div id="playerScoreCombo"> <div>{score}</div> <div>x{combo}</div></div>
        </div>
      </div>
    );
  }
}

<body id="root"></body>;

ReactDOM.render(<App></App>, document.getElementById("root"));

export default App;