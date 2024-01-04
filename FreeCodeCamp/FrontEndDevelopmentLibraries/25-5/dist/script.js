/*****************************************************************************************/
const DEFAULT_BREAK = 5;
const DEFAULT_SESSION = 25;
const INCREMENT_BREAK = 'INCBK';
const DECREMENT_BREAK = 'DECBK';
const INCREMENT_SESSION = 'INCSN';
const DECREMENT_SESSION = 'DECSN';
const RESET = 'RESET';

/*****************************************************************************************/
// Redux Code
const defaultState = {
  breakCount: DEFAULT_BREAK,
  sessionCount: DEFAULT_SESSION };


const counterReducer = (state = defaultState, action) => {
  let nwObject = Object.assign({}, state);
  switch (action.type) {
    case INCREMENT_BREAK:
      nwObject.breakCount = nwObject.breakCount < 59 ? nwObject.breakCount + 1 : 60;
      return nwObject;
    case DECREMENT_BREAK:
      nwObject.breakCount = nwObject.breakCount > 1 ? nwObject.breakCount - 1 : 1;
      return nwObject;
    case INCREMENT_SESSION:
      nwObject.sessionCount = nwObject.sessionCount < 59 ? nwObject.sessionCount + 1 : 60;
      return nwObject;
    case DECREMENT_SESSION:
      nwObject.sessionCount = nwObject.sessionCount > 1 ? nwObject.sessionCount - 1 : 1;
      return nwObject;
    case RESET:
      return defaultState;}

  return state;
};

store = Redux.createStore(counterReducer);

const incBreakAction = { type: INCREMENT_BREAK };
const decBreakAction = { type: DECREMENT_BREAK };
const incSessnAction = { type: INCREMENT_SESSION };
const decSessnAction = { type: DECREMENT_SESSION };
const resetAction = { type: RESET };

const incBreakActionCreate = () => {return incBreakAction;};
const decBreakActionCreate = () => {return decBreakAction;};
const incSessnActionCreate = () => {return incSessnAction;};
const decSessnActionCreate = () => {return decSessnAction;};
const resetCreate = () => {return resetAction;};

// I/F between
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

/*****************************************************************************************/
// React Ccode
const SESSION_CLOCK = "Session";
const BREAK_CLOCK = "Break";
const MUSIC = "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

// Used for the timer clock
let interval = 0;

// React Code
function Counter(type, count, handleChange, upAction, downAction) {
  let label = type.toLowerCase() + "-label";
  let length = type.toLowerCase() + "-length";
  let upLabel = type.toLowerCase() + "-increment";
  let downLabel = type.toLowerCase() + "-decrement";

  return /*#__PURE__*/(
    React.createElement("div", { className: "container2" }, /*#__PURE__*/
    React.createElement("label", { id: label }, type, " Length"), /*#__PURE__*/
    React.createElement("label", { id: length }, count), /*#__PURE__*/
    React.createElement("button", { id: upLabel, onClick: () => handleChange(upAction) }, "\u21E7"), /*#__PURE__*/
    React.createElement("button", { id: downLabel, onClick: () => handleChange(downAction) }, "\u21E9")));

};

function Timer(minutes, seconds, clock_type, startStop) {
  let mins = minutes;
  let secs = seconds;
  mins = mins < 10 ? "0" + mins : mins;
  secs = secs < 10 ? "0" + secs : secs;
  let time = mins + ":" + secs;

  return /*#__PURE__*/(
    React.createElement("div", { className: "container3" }, /*#__PURE__*/
    React.createElement("label", { id: "timer-label" }, clock_type), /*#__PURE__*/
    React.createElement("label", { id: "time-left" }, time), /*#__PURE__*/
    React.createElement("button", { id: "start_stop", onClick: startStop }, "Start \u23F5 | Pause \u23F8"), /*#__PURE__*/

    React.createElement("audio", { id: "beep", src: MUSIC, loop: true }, "No Audio")));


}


class Envelope extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      clock_type: SESSION_CLOCK,
      minutes: DEFAULT_SESSION,
      seconds: 0 };


    this.updateTime = this.updateTime.bind(this);
    this.startStop = this.startStop.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);
  }

  // Changes to the session and break counters.
  handleChange(reduxHandle) {
    if (this.state.active == false) {
      // Call the redux handler
      reduxHandle();

      // Updates to the main clock

      // Need to get immediate feedback from the Redux store
      let storeState = store.getState();
      if (this.state.clock_type == SESSION_CLOCK) {
        this.updateTime(storeState.sessionCount, 0);
      } else {
        this.updateTime(storeState.breakCount, 0);
      }
    }
  }

  // Update the time store in local state
  updateTime(minutes, seconds) {
    this.setState({
      minutes: minutes,
      seconds: seconds });

  }

  // Reset everything to defaults
  reset() {
    this.setState({
      clock_type: SESSION_CLOCK,
      minutes: DEFAULT_SESSION,
      seconds: 0,
      active: false });

    this.props.resetAll();

    let element = document.getElementById("beep");
    element.pause();
    element.currentTime = 0;

    clearInterval(interval);
  }

  adjustTime(minutes, seconds) {
    let mins = minutes;
    let secs = seconds - 1;
    let atZero = false;

    if (secs < 0) {
      mins = mins - 1;
      secs = 59;
      if (mins < 0) {
        mins = 0;
        secs = 0;
        atZero = true;
      }
    }
    this.updateTime(mins, secs);
    return atZero;
  }

  playBell() {
    let element = document.getElementById("beep");

    function stopBeep() {
      element.pause();
      element.currentTime = 0;
    }
    element.play();
    let tout = setTimeout(stopBeep, 1000);
  }

  startStop() {
    let active = this.state.active;
    let atZero = false;

    if (active) {
      active = false;
      clearInterval(interval);
    } else {
      active = true;
      interval = setInterval(() => {
        atZero = this.adjustTime(this.state.minutes, this.state.seconds);
        if (atZero) {
          // Ring Alarm
          this.playBell();

          // Change clock type
          if (this.state.clock_type == SESSION_CLOCK) {
            let storeState = store.getState();
            this.updateTime(storeState.breakCount, 0);
            this.setState({ clock_type: BREAK_CLOCK });
            // Clear the timers. Countdown complete.
          } else {
            let storeState = store.getState();
            this.updateTime(storeState.sessionCount, 0);
            this.setState({ clock_type: SESSION_CLOCK });
          }
        }
      }, 1000);
    }
    this.setState({ active: active });
  }

  render() {

    return /*#__PURE__*/(
      React.createElement("div", { className: "container" },
      Counter("Break",
      this.props.breakCount,
      this.handleChange, this.props.handleBreakUp, this.props.handleBreakDown),


      Counter("Session",
      this.props.sessionCount,
      this.handleChange, this.props.handleSessionUp, this.props.handleSessionDown),

      Timer(this.state.minutes, this.state.seconds, this.state.clock_type, this.startStop), /*#__PURE__*/
      React.createElement("button", { id: "reset", resetAll: this.props.resetAll, onClick: this.reset }, "Reset \u21BA")));


  }}
;

// React - Redux Joining together
const mapStateToProps = state => {
  return { breakCount: state.breakCount,
    sessionCount: state.sessionCount };

};

const mapDispatchToProps = dispatch => {
  return {
    handleBreakUp: () => {dispatch(incBreakActionCreate());},
    handleBreakDown: () => {dispatch(decBreakActionCreate());},
    handleSessionUp: () => {dispatch(incSessnActionCreate());},
    handleSessionDown: () => {dispatch(decSessnActionCreate());},
    resetAll: () => {dispatch(resetCreate());} };

};
const Container = connect(mapStateToProps, mapDispatchToProps)(Envelope);
class AppWrapper extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement(Provider, { store: store }, /*#__PURE__*/
      React.createElement(Container, null)));


  }}
;

// Final Rendering to the dom
ReactDOM.render( /*#__PURE__*/React.createElement(AppWrapper, null), document.getElementById("root"));