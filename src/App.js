import React, {Component} from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';

let zeroToNine = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"]

function hmsms(msec) {
    var sec = (msec / 1000) | 0;
    var ms = (msec % 1000) | 0;
    var s = (sec % 60) | 0;
    var m = (sec % 3600 / 60) | 0;
    var h = (sec / 3600) | 0;

    var sb = "";
    sb += 0 <= h && h < 10 ? zeroToNine[h] : h;
    sb += ":";
    sb += 0 <= m && m < 10 ? zeroToNine[m] : m;
    sb += ":";
    sb += 0 <= s && s < 10 ? zeroToNine[s] : s;
    sb += ".";
    if (ms >= 100) {
        sb += ms;
    } else if (ms >= 10) {
        sb += '0' + ms;
    } else {
        sb += "00" + ms;
    }
    return sb;
}

let FPS = 24;
let DIFF_PER_SEC = 9000000;
const codecs = [
    {
        value: 'h264',
        label: 'h264',
    },
    {
        value: 'prores',
        label: 'prores',
    },
    {
        value: 'dpx',
        label: 'dpx',
    }
];

class App extends Component {

    state = {
        dbsize: 42,
        bitrate: 5000,
        network: 100,
        inputvideo: 1,
        ingestTime: 0,
        codec: 'h264',
        decodeFps: 420,
        processingTime: 0
    };

    handleChange = (prop) => event => {
        console.log(prop, event.target.value);
        let newState = Object.assign({}, this.state);
        newState[prop] = event.target.value;
        if ("codec" === prop) {
            switch (event.target.value) {
                case "h264":
                    newState.bitrate = 5000;
                    newState.decodeFps = 420;
                    break;
                case "dpx":
                    newState.bitrate = 1920 * 1080 * 6 * 8 * FPS / 1024;
                    newState.decodeFps = 30;
                    break;
                case "prores":
                    newState.bitrate = 200000;
                    newState.decodeFps = 75;
                    break;
            }
        }
        this.recalc(newState);
        this.setState(newState);
    };

    recalc(newState) {
        let inputFrames = newState.inputvideo * 3600 * FPS;
        let itime = newState.inputvideo * 3600 * newState.bitrate / (newState.network * 1000);
        let ttime = inputFrames / newState.decodeFps;
        let ptime = inputFrames * newState.dbsize * 3600 * FPS / DIFF_PER_SEC;
        console.log(itime, ptime);
        newState.ingestTime = Math.max(ttime, itime) * 1000;
        newState.processingTime = ptime * 1000;
        this.setState(newState);
    }

    componentDidMount() {
        this.recalc(Object.assign({},this.state))
    };

    render() {
        return (
            <div>
                <h1>VideoGorillas Bigfoot performance calculator</h1>
                <TextField
                    id="outlined-name"
                    label="Input video (hours)"
                    value={this.state.inputvideo}
                    onChange={this.handleChange("inputvideo")}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="bla"
                    label="Existing db size (hours)"
                    value={this.state.dbsize}
                    onChange={this.handleChange("dbsize")}
                    margin="normal"
                    variant="outlined"
                />

                <TextField
                    id="bla"
                    label="Video Bitrate (kbps)"
                    value={this.state.bitrate}
                    onChange={this.handleChange("bitrate")}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="bla"
                    label="Network speed (mbps)"
                    value={this.state.network}
                    onChange={this.handleChange("network")}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="standard-select-currency-native"
                    select
                    label="Codec"
                    value={this.state.codec}
                    onChange={this.handleChange('codec')}
                    SelectProps={{
                        native: true,
                        //     MenuProps: {
                        //         className: classes.menu,
                        //     },
                    }}
                    helperText="Select your codec"
                    margin="normal"
                >
                    {codecs.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
                <br/>
                <h1>Expected time</h1>

                <TextField
                    id="outlined-read-only-input"
                    label="Ingest time"
                    value={hmsms(this.state.ingestTime)}
                    defaultValue="00:00:00.000"
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="outlined"
                />

                <TextField
                    id="outlined-read-only-input2"
                    label="Processing time"
                    value={hmsms(this.state.processingTime)}
                    defaultValue="00:00:00.000"
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="outlined"
                />

            </div>
        );
    }

}

export default App;
