function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} /******************************************/
const buttonBeats = [
{
  src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  id: "Heater-1",
  label: 'Q' },

{
  src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  id: "Heater-2",
  label: 'W' },

{
  src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
  id: "Heater-3",
  label: 'E' },

{
  src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  id: "Heater-4",
  label: 'A' },

{
  src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  id: "Heater-5-Clap",
  label: 'S' },

{
  src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
  id: "Open-HH",
  label: 'D' },

{
  src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
  id: "Kick-N-Hat",
  label: 'Z' },

{
  src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
  id: "Kick",
  label: 'X' },

{
  src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
  id: "Closed-HH",
  label: 'C' }];


/******************************************/

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
        document.getElementById(this.props.label).play());

    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.checkKey.bind(this));
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.checkKey.bind(this));
  }

  checkKey() {
    let key = event.key;
    key = key.toUpperCase();
    if (key === this.props.label) {
      this.playDrum();
    }
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("button", {
        className: "drum-pad grid-item",
        id: this.props.id,
        onClick: this.playDrum }, " ",
      this.props.label, /*#__PURE__*/
      React.createElement("audio", {
        id: this.props.label,
        src: this.props.src,
        className: "clip" }, "No Audio")));



  }}


/* This component manages the keypad */
class BtnLst extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "grid-container" },
      buttonBeats.map((button) => /*#__PURE__*/
      React.createElement(Btn, {
        label: button.label,
        src: button.src,
        id: button.id,
        power: this.props.power,
        changeState: this.props.changeState }))));




  }}


class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const style =
    {
      'background-color':
      this.props.power === "On" ?
      "green" : "red" };


    return /*#__PURE__*/(
      React.createElement("div", { id: "control-panel" }, /*#__PURE__*/
      React.createElement("h4", { id: "pwr-cnt" }, "Power"), /*#__PURE__*/
      React.createElement("button", { id: "on-off",
        onClick: this.props.onOff,
        style: style },

      this.props.power), /*#__PURE__*/

      React.createElement("h3", { id: "spacer" }), /*#__PURE__*/
      React.createElement("h3", { id: "display" }, this.props.display)));


  }}


class Drums extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "top-row" }, /*#__PURE__*/
      React.createElement(BtnLst, {
        changeState: this.props.changeState,
        power: this.props.power }), /*#__PURE__*/

      React.createElement(ControlPanel, {
        display: this.props.display,
        onOff: this.props.onOff,
        power: this.props.power })));


  }}

class App extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "changeState",





    display => {
      this.setState({
        display: display });

    });_defineProperty(this, "onOff",
    () => {
      const x = this.state.power === "On" ?
      "Off" : "On";
      this.setState({
        power: x });

    });this.state = { display: "", power: "On" };}
  render() {
    return /*#__PURE__*/(
      React.createElement(Drums, {
        display: this.state.display,
        changeState: this.changeState,
        power: this.state.power,
        onOff: this.onOff }));

  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("drum-machine"));