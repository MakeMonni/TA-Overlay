import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ReactDOM from "react-dom";
import config from "./config.json"

const client = new W3CWebSocket(config.realyServerUrl);

class Song extends React.Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.state = {
            diff: 0,
            song: {}
        };
    }

    componentWillMount() {
        client.onopen = () => {
            console.log("WebSocket Client Connected");
        };
        client.onmessage = (message) => {
            const msgJSON = JSON.parse(message.data)
            if (msgJSON.Type === "3") {
                let mapHash = msgJSON.LevelId.replace("custom_level_", "");
                fetch(`http://api.monni.eu/map?h=${mapHash}`)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({ song: res })
                    })

            }
        }
    };


    render() {
        if (Object.keys(this.state.song).length !== 0) {
            const metadata = this.state.song.metadata
            const latestVersion = this.state.song.versions[0]
            let songName = (metadata.songName+" "+metadata.songSubName).substring(0,30)
            if(songName.length > 28) songName += "..."
            const i = latestVersion.diffs.length-1 // Add finding of difficulty index here, temporary solution because currently only highest diff is used.
            return (
                <div id="outer">

                    <img id="coverImg" src={latestVersion.coverURL} alt=""></img>

                    <div id="songInfo">
                        <div id="songName">{songName}</div>
                        <div id="artist">{metadata.songAuthorName}</div>


                        <div id="mapper">{metadata.levelAuthorName} - {this.state.song.key.toLowerCase()}</div>
                        <div id="key"></div>

                        <div id="lengthbpm">BPM {metadata.bpm} | {secondsToReadableTime(metadata.duration)}</div>
                        <div id="njsnps"> NPS {latestVersion.diffs[i].nps.toFixed(1)} | NJS {latestVersion.diffs[i].njs}</div>
                    </div>
                </div>
            );
        }
        return <div></div>
    }
}


<body id="root"></body>;

ReactDOM.render(<Song></Song>, document.getElementById("root"));

export default Song;

function secondsToReadableTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const second = seconds - minutes * 60
    return `${minutes}:${second}`
}