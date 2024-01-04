function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} /***********************************************/
/* Code Camp Challenges                        */
/*vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv*/

// Challenge #1: Palindrone Checker
function palindrome(str) {
  // 1st get rid of junk
  let nwStr = str.toLowerCase().replace(/\W|\_/g, "");

  let iPos = 0; // Start of String Pos
  let ePos = nwStr.length - 1; // End of String

  // Check beginning of string against end of string
  while (iPos <= ePos) {
    if (nwStr[iPos] != nwStr[ePos]) {
      return false;
    }
    iPos++;
    ePos--;
  }
  return true;
}

// Challenge #2: Roman Numeral Convertor
function convertToRoman(num) {

  const RomanNumerals = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"]];


  let outStr = "";

  // Loop around the numbers
  for (let i = 0; i < RomanNumerals.length; i++) {
    // The divisor to use
    let div = RomanNumerals[i][0];

    // What it corresponds to 
    let chr = RomanNumerals[i][1];

    // Get the modulo and floor
    // Reset num to the modulo
    let nwNum = num % div;
    let tstNum = Math.floor(num / div);
    num = nwNum;

    // If we have any digits from the floor command
    // Add them to the resulting string
    if (tstNum > 0) {
      while (tstNum > 0) {
        outStr += chr;
        tstNum--;
      }
    }
  }
  return outStr;
}

// Challenge #3: Caesars Cipher
function rot13(str) {
  const rot = 13; // Amount to shift
  const low = "A".charCodeAt(0); // beginning of alphabet
  const hi = "Z".charCodeAt(0); // End of alphabet

  // Some local variables used in map function
  let tmp = 0;
  let cur = 0;
  let adj = 0;
  let nw = 0;

  let newStr = str.
  split('') // split of space
  .map(
  (item) => (
  cur = item[0].charCodeAt(0), // get the ascii
  adj = cur - rot, // this is new char
  // a value adjusted for alphabet beg/end
  tmp = hi - (low - adj - 1),
  // if value is outside range of alphabet
  cur < low || cur > hi ?
  // Ignore non-alphbet chars
  String.fromCharCode(cur)

  // adjusted value is outside the range
  // wrap around to 'Z' using 'tmp'
  // else use adjusted char
  // in both cases convert back to char
  : adj < low ?
  String.fromCharCode(tmp) :
  String.fromCharCode(adj))).


  join('');

  return newStr;
}

// Challenge #4: Telephone Number Validator
function telephoneCheck(str) {
  // ^(1?)\s?                   -> Can start with '1'
  //                               and/or space
  // ((\([0-9]{3}\)|[0-9]{3}))  -> Potential brackets
  // ((\s|\-)?)                 -> Potential '-'
  // ([0-9]{3})                 -> next 3 digits
  // ((\s|\-)?)                 -> Potential '-'
  // ([0-9]{4})                 -> 4 digits
  let re = /^(1?)\s?((\([0-9]{3}\)|[0-9]{3}))((\s|\-)?)([0-9]{3})((\s|\-)?)([0-9]{4})$/;
  return re.test(str);
}

// Challenge #5: Cash Register
function checkCashRegister(price, cash, cid) {
  const currency = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.10,
    "QUARTER": 0.25,
    "ONE": 1.00,

    "FIVE": 5.00,
    "TEN": 10.00,
    "TWENTY": 20.00,
    "ONE HUNDRED": 100 };


  // Calculates the required change
  function getCurrencyChange(type, wanted, avail)
  {
    // Denomination of the currency
    let denominator = currency[type];
    // Amount available
    let availNts = Math.floor(avail / denominator);
    // Number of 'denominator' required
    let reqdNts = Math.floor(wanted / denominator);
    // Adjust notes to cope with more reqd than avail
    reqdNts = reqdNts > availNts ? availNts : reqdNts;

    // Adjust available notes
    availNts = availNts - reqdNts;

    // Amount of cash and available
    // as multiple of 'denominator'
    reqdNts = reqdNts * denominator;
    availNts = availNts * denominator;
    return [reqdNts, availNts];
  }

  let change = Math.round((cash - price) * 100) / 100;
  let totalTill = 0;
  let changeArr = [];

  // Make array local
  let newCid = [...cid];

  // For each type of denominator
  for (let i = cid.length - 1; i >= 0; i--) {
    let type = newCid[i][0];
    let amount = newCid[i][1];

    // If the cash register doens't have any money
    // of this type, skip it.
    if (amount > 0) {

      // Check change against register and update values
      let retVal = getCurrencyChange(type, change, amount);
      let cngAdj = retVal[0];
      let avlAdj = retVal[1];

      // Some rounding to ensure whole numbers
      totalTill += avlAdj;
      change -= cngAdj;
      totalTill = Math.round(totalTill * 100) / 100;
      change = Math.round(change * 100) / 100;

      // Add change to the change array result
      if (cngAdj > 0) {
        changeArr.push([type, cngAdj]);
      }

      // Update copy of cash register with change
      newCid[i][1] = cngAdj;
    }
  }

  let obj = {};
  let status = 0;

  if (change > 0) {
    status = "INSUFFICIENT_FUNDS";
    obj = {
      status: status,
      change: [] };

  } else {
    if (totalTill > 0) {
      obj = {
        status: "OPEN",
        // Contains the exact change required
        change: changeArr };

    } else {
      obj = {
        status: "CLOSED",
        // Contains the amount of change needed but not 
        // available
        change: newCid };

    }
  }
  return obj;
}
/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
/* Code Camp Challenges                        */
/***********************************************/

/***********************************************/
let freshRender = true;

const PALINDROME = 0;
const ROMAN = 1;
const CIPHER = 2;
const VALIDATOR = 3;
const REGISTER = 4;

let challenge_type = PALINDROME;

const palindrome_text =
"Checks for a palidrome. Ignores spaces and underscores " +
"whilst checking. To check, enter your palindrome below.";
const roman_text =
"Convert the given number into a roman numeral.";
const cipher_text =
"Simple way to hide text meaning: shift letters along by 13 places, move back to 'A' when 'Z' " +
"is reached. Upper case letters only (as per code camp challenge)";
const validator_text =
"Text for a valid US phone number, including country code of '1', brackets, spaces and '-'s. " +
"Examples: '555-555-5555', '(555)555-5555', '(555) 555-5555', '555 555 5555', '5555555555', '1 555 555 5555'";
const cash_register_text =
"A cash register function that " +
"accepts purchase price (cost), payment, and cash available in register." +
"Shows change due, updates cash register and status. Status Insufficient funds: " +
"Not enough funds to cover required " +
"change. Status Open: Change given and cash register still has cash. Status Closed: Change given, " +
"emptying cash register of achnge";

const challenge_text = [
{
  id: PALINDROME,
  desc: "Palindrome Check",
  text: palindrome_text,
  sample: "Type a word or sentence to check if a palindrome",
  input_type: "text" },

{
  id: ROMAN,
  desc: "Convert Number To Roman Numerals",
  text: roman_text,
  sample: "Type a number",
  input_type: "number" },

{
  id: CIPHER,
  desc: "Caesars Cipher",
  text: cipher_text,
  sample: "Enter Cipher Text, Example: SERR PBQR PNZC",
  input_type: "text" },

{
  id: VALIDATOR,
  desc: "Telephone Number Validator",
  text: validator_text,
  sample: "Enter US telephone number, example (555) 555-5555",
  input_type: "text" },

{
  id: REGISTER,
  desc: "Cash Register",
  text: cash_register_text,
  sample: "Enter Price, Payment and Cash in Register. ",
  input_type: "text" }];



// Placeholder for undeveloped code
class Empty extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "", class: "challenge-div" }, /*#__PURE__*/
      React.createElement("h1", null, "Nothing to see")));


  }}


// HTML harness to test the challenges
class Challenges extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      result: '' };

    this.updateInput = this.updateInput.bind(this);
    this.runAlgorithm = this.runAlgorithm.bind(this);
    this.reset = this.reset.bind(this);
  }
  reset() {
    this.state = {
      input: '',
      result: '' };

  }
  updateInput(event) {
    this.setState({
      input: event.target.value,
      result: '' });

  }
  telephoneValidator(toCheck) {
    let restxt = "";
    if (toCheck) {
      let result = telephoneCheck(toCheck);
      if (result)
      restxt = "Yep, you've got yourself a valid number";else
      {
        restxt = "Nope, not a valid telephone number";
      }
    }
    return restxt;
  }
  caesarsCipher(toCheck) {
    let result = "";
    if (toCheck) {
      result = "Decoded Message: ";
      result = result + rot13(toCheck);
    }
    return result;
  }
  convertToRoman(toCheck) {
    const numToCheck = Number(toCheck);
    let result = "";
    if (toCheck) {
      result = toCheck + " represented as roman numerals is: ";
      result = result + convertToRoman(toCheck);
    }
    return result;
  }
  testPalindrome(toCheck) {
    let restxt = "";
    if (toCheck) {
      let result = palindrome(toCheck);
      if (result)
      restxt = "Yep, you've got yourself a palindrome";else
      {
        restxt = "Nope, not a palindrome";
      }
    }
    return restxt;
  }
  runAlgorithm() {
    const toCheck = this.state.input;
    let restxt = "";
    switch (challenge_type) {
      case PALINDROME:
        restxt = this.testPalindrome(toCheck);
        break;
      case ROMAN:
        restxt = this.convertToRoman(toCheck);
        break;
      case CIPHER:
        restxt = this.caesarsCipher(toCheck);
        break;
      case VALIDATOR:
        restxt = this.telephoneValidator(toCheck);
      default:
        break;}

    this.setState({
      result: restxt,
      input: '' });

  }
  render() {
    if (freshRender) {
      this.reset();
      freshRender = false;
    }
    return /*#__PURE__*/(
      React.createElement("div", { class: "challenge-div" }, /*#__PURE__*/
      React.createElement("h1", { class: "description" },
      challenge_text[challenge_type].desc), /*#__PURE__*/

      React.createElement("p", { class: "desc-text" },
      challenge_text[challenge_type].text), /*#__PURE__*/

      React.createElement("input", { name: "data-input",
        class: "data-input",
        type: challenge_text[challenge_type].input_type,
        placeholder: challenge_text[challenge_type].sample,
        value: this.state.input,
        onChange: this.updateInput }), /*#__PURE__*/

      React.createElement("input", { type: "button",
        value: "Submit",
        class: "submit-button", onClick: this.runAlgorithm }), /*#__PURE__*/
      React.createElement("h1", { id: "result" }, this.state.result)));


  }}


/************************************************/
// Cash Register ....
// More complex so separate React code 
/************************************************/
// So we know what value a denominator has
const MONEY = [
["PENNY", 0.01], ["NICKEL", 0.05], ["DIME", 0.1], ["QUARTER", 0.25],
["ONE", 1], ["FIVE", 5], ["TEN", 10], ["TWENTY", 20],
["HUNDRED", 100]];

// The freeCodeCamp tests. 
const REGISTER_PRESETS = [
{ price: 19.5,
  payment: 20,
  cid: { penny: 1.01, nickel: 2.05, dime: 3.1, quarter: 4.25, one: 90, five: 55, ten: 20, twenty: 60, hundred: 100 },
  change: [["QUARTER", 0.5]] },

{ price: 3.26,
  payment: 100,
  cid: { penny: 1.01, nickel: 2.05, dime: 3.1, quarter: 4.25, one: 90, five: 55, ten: 20, twenty: 60, hundred: 100 },
  change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]] },

{ price: 19.5,
  payment: 20,
  cid: { penny: 0.01, nickel: 0, dime: 0, quarter: 0, one: 0, five: 0, ten: 0, twenty: 0, hundred: 0 },
  change: [] },

{ price: 19.5,
  payment: 20,
  cid: { penny: 0.01, nickel: 0, dime: 0, quarter: 0, one: 1, five: 0, ten: 0, twenty: 0, hundred: 0 },
  change: [] },

{ price: 19.5,
  payment: 20,
  cid: { penny: 0.5, nickel: 0, dime: 0, quarter: 0, one: 0, five: 0, ten: 0, twenty: 0, hundred: 0 },
  change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]] }];



// Currency format
const formatter = new Intl.NumberFormat('en-US',
{
  style: 'currency',
  currency: 'USD' });


// Tooltips
function ToolTip(contents) {
  return /*#__PURE__*/(
    React.createElement("span", { class: "tooltiptext" }, contents));

}

// Labels and buttons to show money line
// When called as part of input, it includes adjustment buttons
// Otherwise just shows the cash line
class MoneyMap extends React.Component {
  constructor(props) {
    super(props);
  }
  showValue(label, type) {
    let newLabel = label.toLowerCase();
    let value = type == "input" ? this.props.state.cid[newLabel] : this.props.state.change[newLabel];
    return value;
  }
  changeValue(action) {
    const cid = Object.assign({}, this.props.state.cid);
    const label = this.props.label;
    const newLabel = label.toLowerCase();
    const currentValue = cid[newLabel];
    let newValue = action == "inc" ? currentValue + this.props.valueOf : currentValue - this.props.valueOf;
    newValue = newValue < 0 ? 0 : newValue;
    newValue = Math.round(newValue * 100) / 100;
    cid[newLabel] = newValue;
    this.props.changeState("cid", cid);
  }
  render() {
    const type = this.props.type;
    const label = this.props.label;
    const rawValue = this.showValue(label, type);
    const value = formatter.format(rawValue);
    const b0 = (type == "input" || rawValue > 0) && /*#__PURE__*/React.createElement("label", { class: "currency-label" }, label);
    const b1 = type == "input" && /*#__PURE__*/
    React.createElement("div", { class: "tooltip" }, /*#__PURE__*/
    React.createElement("button", { type: "button", onClick: e => this.changeValue("inc") }, "+"),
    ToolTip("Increment this value"));


    const b2 = (type == "input" || rawValue > 0) && /*#__PURE__*/React.createElement("label", { class: "currency" }, value);
    const b3 = type == "input" && /*#__PURE__*/
    React.createElement("div", { class: "tooltip" }, /*#__PURE__*/
    React.createElement("button", { type: "button", onClick: e => this.changeValue("dec") }, "-"),
    ToolTip("Decrement this value"));


    return /*#__PURE__*/(
      React.createElement("div", { class: "money-line" },
      b0,
      b1,
      b2,
      b3));


  }}

// User can select one of the freecodecamp tests 
// Handy for testing and for user to 'play'
class PresetInputs extends React.Component {
  constructor(props) {
    super(props);
  }
  setParentState(value) {
    let data = REGISTER_PRESETS[value];
    this.props.changeState("price", data.price);
    this.props.changeState("payment", data.payment);
    this.props.changeState("cid", data.cid);
    this.props.changeState("preset", value);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("select", { name: "dropdown",
        id: "dropdown",
        value: this.props.state.preset,
        onChange: e => this.setParentState(e.target.value) }, /*#__PURE__*/

      React.createElement("option", { selected: "true", disabled: true, value: "" }, "Preset Inputs"),



      REGISTER_PRESETS.map((item, i) => /*#__PURE__*/
      React.createElement("option", { id: "option", value: i }, "Preset #",
      i + 1))));






  }}

// Main input screen for the challenge
// Constists of two input fields and
// a set of buttons and values representing
// the cash register. Also contains
// A set of buttons to control algorithm
// set values according to preset tests,
// reset all values, and submit to run the 
// FCC algorithm
class RegisterInputs extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { class: "register-display-panel",
        id: "register-inputs" }, /*#__PURE__*/
      React.createElement("div", { class: "input-field" }, /*#__PURE__*/
      React.createElement("label", { class: "field-label" }, "Item Cost"), /*#__PURE__*/
      React.createElement("input", { id: "price-input",
        name: "price-input",
        class: "field-input",
        type: "number",
        value: this.props.state.price,
        onChange: this.props.updatePrice })), /*#__PURE__*/


      React.createElement("div", { class: "break" }), /*#__PURE__*/
      React.createElement("div", { class: "input-field" }, /*#__PURE__*/
      React.createElement("label", { class: "field-label" }, "Customer Payment"), /*#__PURE__*/
      React.createElement("input", { id: "payment-input",
        name: "payment-input",
        class: "field-input",
        type: "number",
        value: this.props.state.payment,
        onChange: this.props.updatePayment })), /*#__PURE__*/

      React.createElement("div", { class: "break" }), /*#__PURE__*/
      React.createElement("div", { class: "cash-and-change" }, /*#__PURE__*/
      React.createElement("label", { id: "cash-register-buttons-title" }, "Cash In Register: "),

      MONEY.map((item, i) => /*#__PURE__*/
      React.createElement(MoneyMap, {
        label: item[0],
        valueOf: item[1],
        state: this.props.state,
        changeState: this.props.changeState,
        type: "input" }))), /*#__PURE__*/



      React.createElement("div", { class: "break" }), /*#__PURE__*/
      React.createElement("div", { class: "button-bar" }, /*#__PURE__*/
      React.createElement("div", { class: "tooltip div-width" }, /*#__PURE__*/
      React.createElement(PresetInputs, {
        state: this.props.state,
        changeState: this.props.changeState }),

      ToolTip("Preset values for testing")), /*#__PURE__*/


      React.createElement("div", { class: "tooltip div-width" }, /*#__PURE__*/
      React.createElement("input", { type: "button",
        value: "Reset",
        class: "butonbar-button",
        onClick: this.props.reset }),

      ToolTip("Reset all data")), /*#__PURE__*/


      React.createElement("div", { class: "tooltip div-width" }, /*#__PURE__*/
      React.createElement("input", { type: "button",
        value: "Submit",
        class: "butonbar-button",
        onClick: this.props.runAlgorithm }),

      ToolTip("Run the CashRegister algorithm and update all fields")))));





  }}

// Main output area for this challenge
// Contains result plus the change (if any) required
// based on the input values
class RegisterOutputs extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const status = this.props.state.status;
    const penny = this.props.state.change.penny;
    const nickel = this.props.state.change.nickel;
    const dime = this.props.state.change.dime;
    const quarter = this.props.state.change.quarter;
    const one = this.props.state.change.one;
    const five = this.props.state.change.five;
    const ten = this.props.state.change.ten;
    const twenty = this.props.state.change.twenty;
    const hundred = this.props.state.change.dime;
    const no_money = penny == 0 &&
    nickel == 0 &&
    dime == 0 &&
    quarter == 0 &&
    one == 0 &&
    five == 0 &&
    ten == 0 &&
    twenty == 0 &&
    hundred == 0;

    // If status has a value; means user has pressed 'submit'
    const b0 = status && /*#__PURE__*/React.createElement(React.Fragment, null, " ", /*#__PURE__*/React.createElement("label", null, "Result Status: "), /*#__PURE__*/
    React.createElement("label", null, this.props.state.status), /*#__PURE__*/
    React.createElement("div", { class: "break" }));


    // Money can be empty if no change is required
    const b1 = !no_money && /*#__PURE__*/React.createElement("label", null, "Change due:");

    return /*#__PURE__*/(
      React.createElement("div", { class: "register-display-panel tooltip",
        id: "register-outputs" },
      b0, /*#__PURE__*/
      React.createElement("div", { class: "cash-and-change" },
      b1,

      MONEY.map((item, i) => /*#__PURE__*/
      React.createElement(MoneyMap, {
        label: item[0],
        valueOf: item[1],
        state: this.props.state,
        type: "output" }))),





      ToolTip("This panel will show the output from CashRegister algorithm")));




  }}


// Cash register is more complex so need different HTML to manage it
// Main React function for this challenge. Calls functions above
class CashRegisterChallenges extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "changeState",















































    (toChange, state) => {
      this.setState({ [toChange]: state });
    });this.state = { price: 0, payment: 0, cid: { penny: 0, nickel: 0, dime: 0, quarter: 0, one: 0, five: 0, ten: 0, twenty: 0, hundred: 0 }, status: '', change: { penny: 0, nickel: 0, dime: 0, quarter: 0, one: 0, five: 0, ten: 0, twenty: 0, hundred: 0 }, preset: '' };this.reset = this.reset.bind(this);this.updatePrice = this.updatePrice.bind(this);this.updatePayment = this.updatePayment.bind(this);this.runAlgorithm = this.runAlgorithm.bind(this);} // Set everything back to defaults.
  reset() {const cid = { penny: 0, nickel: 0, dime: 0, quarter: 0, one: 0, five: 0, ten: 0, twenty: 0, hundred: 0 };const change = { penny: 0, nickel: 0, dime: 0, quarter: 0, one: 0, five: 0, ten: 0, twenty: 0, hundred: 0 };this.setState({ price: 0, payment: 0, cid: cid, status: '', change: change, preset: '' });} // Set change back to '0'
  resetChange() {const change = { penny: 0, nickel: 0, dime: 0, quarter: 0, one: 0, five: 0, ten: 0, twenty: 0, hundred: 0 };this.setState({ change: change });}updatePrice(event) {this.setState({ price: event.target.value });}updatePayment(event) {this.setState({ payment: event.target.value });} // Main function to run the FCC challenge code
  // Includes extra tests for sanity checking
  runAlgorithm() {
    const price = this.state.price;
    const payment = this.state.payment;

    // Ensure we get a local copy of cash register for updating
    const cid = Object.assign({}, this.state.cid);

    // Change will be set initially within this local object
    const change = { penny: 0, nickel: 0, dime: 0, quarter: 0, one: 0, five: 0, ten: 0, twenty: 0, hundred: 0 };

    // Ensure that the order is correct by manually setting values
    const registerArray = [
    ["PENNY", cid.penny],
    ["NICKEL", cid.nickel],
    ["DIME", cid.dime],
    ["QUARTER", cid.quarter],
    ["ONE", cid.one],
    ["FIVE", cid.five],
    ["TEN", cid.ten],
    ["TWENTY", cid.twenty],
    ["ONE HUNDRED", cid.hundred]];

    // Some extra checking of inputs
    // Should be part of FCC algorithm, but not part of brief
    // so placed here to keep FCC as submitted
    if (price > 0) {
      if (payment > 0) {
        if (payment >= price) {
          // The actual FreeCodeCamp algorithm.
          const retVal = checkCashRegister(price, payment, registerArray);
          const changeArray = retVal.change;

          // Processing of algorithm results
          // Show change, AND update the cash register
          // to subtract the change.
          changeArray.map(item => {
            const toChange = item[0].toLowerCase();
            const value = item[1];
            change[toChange] = value;
            cid[toChange] = Math.round((cid[toChange] - value) * 100) / 100;
          });
          this.setState({
            status: retVal.status,
            change: change,
            cid: cid });

        } else
        {
          const status = "Payment is not enough to cover cost";
          this.setState({
            status: status });

        }
      } else
      {
        const status = "Payment is zero";
        this.setState({
          status: status });

      }
    } else {
      const status = "Item Cost is zero";
      this.setState({
        status: status });

    }
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "cash-register-details", class: "challenge-div" }, /*#__PURE__*/
      React.createElement("h1", { class: "description" },
      challenge_text[challenge_type].desc), /*#__PURE__*/

      React.createElement("p", { class: "desc-text" },
      challenge_text[challenge_type].text), /*#__PURE__*/

      React.createElement("div", { id: "challenge-details" }, /*#__PURE__*/
      React.createElement(RegisterInputs, {
        state: this.state,
        changeState: this.changeState,
        updatePrice: this.updatePrice,
        updatePayment: this.updatePayment,
        runAlgorithm: this.runAlgorithm,
        reset: this.reset }), /*#__PURE__*/

      React.createElement("div", { class: "break-vertical" }), /*#__PURE__*/
      React.createElement(RegisterOutputs, {
        state: this.state }))));



  }}


/************************************************/
// Back to generic code
/************************************************/
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // Challenge choice is non-react HTML
    const algorithm = document.querySelector('input[name="challenge-choice"]:checked').value;
    challenge_type = Number(algorithm);
    let obj;
    switch (challenge_type) {
      case PALINDROME:
      case ROMAN:
      case CIPHER:
      case VALIDATOR:
        // All four of these are handled in the same react harness
        obj = /*#__PURE__*/React.createElement(Challenges, null);
        break;
      case REGISTER:
        // Cash register is more complex so need different code to manage it
        obj = /*#__PURE__*/React.createElement(CashRegisterChallenges, null);
        break;
      default:
        obj = /*#__PURE__*/React.createElement(Empty, null);
        break;}

    return obj;
  }}


/************************************************/
/* Called when radio button is chosen from HTML */
/* Non React Javascript code                    */
/************************************************/
function algorithmSelected() {
  const algorithm = document.querySelector('input[name="challenge-choice"]:checked').value;
  challenge_type = algorithm;
  freshRender = true;
  ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("activity"));
}

// Kick things off
algorithmSelected();