/******************************************/
const buttonBeats = [
  {
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
    id: "Heater-1",
    label: 'Q'
  },
  {
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
    id:"Heater-2",
    label:'W'
  },
  {
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
    id:"Heater-3",
    label:'E'
  },
  {
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
    id:"Heater-4",
    label:'A'
  },
  {
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
    id:"Heater-5-Clap",
    label:'S'
  },
  {
    src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
    id:"Open-HH",
    label:'D'
  },
  {
    src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
    id:"Kick-N-Hat",
    label:'Z'
  },
  {
    src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
    id:"Kick",
    label:'X'
  },
  {
    src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
    id:"Closed-HH",
    label:'C'
  }
]
/******************************************/
/* Main Code */

/* This component manages the keypad */
class Btn extends React.Component {
  constructor(props) {
    super(props);
    this.playDrum = this.playDrum.bind(this);
  }

  playDrum() {
    if (this.props.power != "On") {
      return;
    } else {
      this.props.changeState(this.props.id);
      return (
        document.getElementById(this.props.label).play()
      )
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.checkKey.bind(this))
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.checkKey.bind(this))
  }
   
  checkKey() {
    let key=event.key
    key = key.toUpperCase();
    if (key === this.props.label) {
      this.playDrum()
    }
  }
  
  render() {
    return (
      <button 
          className="drum-pad grid-item"
          id={ this.props.id } 
          onClick={ this.playDrum }
        > {this.props.label}
         <audio
           id={ this.props.label }
           src={ this.props.src }
           className="clip"
         >No Audio</audio>       
        </button>
    );
  }
}

/* This component manages the keypad */
class BtnLst extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="grid-container">
      { buttonBeats.map((button) => 
          <Btn
            label={button.label}
            src={button.src} 
            id={button.id}
            power={this.props.power}
            changeState={this.props.changeState}
          />
      ) }
      </div>
    )
  }
}

class ControlPanel extends React.Component {
 constructor(props) {
    super(props);
 }
 render() {
   const style =
         {
           'background-color': 
                (this.props.power === "On") ?
                    "green" : "red"
         };
   
   return (
    <div id="control-panel">
      <h4 id="pwr-cnt">Power</h4>
      <button id="on-off" 
              onClick={this.props.onOff}
              style={style}
      >
      {this.props.power}
      </button>
      <h3 id="spacer"></h3>
      <h3 id="display">{this.props.display}</h3>
    </div>
   )
 }
}

class Drums extends React.Component {
 constructor(props) {
    super(props);
 }
 render() {
  return (
    <div id="top-row">
     <BtnLst 
       changeState={this.props.changeState}
       power={this.props.power}
     />
     <ControlPanel 
       display={this.props.display}
       onOff={this.props.onOff}
       power={this.props.power}
     />
    </div>
  ) } }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      power: "On"
    };
  }
  changeState = (display) => {
    this.setState({
      display: display
    })
  }
  onOff = () => {
    const x = (this.state.power === "On") ?
          "Off" : "On";
    this.setState({
      power: x
    })
 }
  render() {
    return ( 
      <Drums 
        display={this.state.display}
        changeState={this.changeState}
        power={this.state.power}
        onOff={this.onOff}
      /> );
  }
}

ReactDOM.render(<App />, document.getElementById("drum-machine"))