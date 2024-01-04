/* 
  This is used to define all the buttons used.
  Order is importnat as they fit into a 4x4 grid.
  Some buttons (AC,0, '=') occupy two spaces,
  dictated by the CSS.
 */
const calcPad = [
  { value: 'AC', id:'clear'    },
  { value: '/',  id:'divide'   },
  { value: 'x',  id:'multiply' },
  { value: '7',  id:"seven"    },
  { value: '8',  id:"eight"    },
  { value: '9',  id:"nine"     },
  { value: '-',  id:'subtract' },
  { value: '5',  id:'five'     },
  { value: '4',  id:'four'     },
  { value: '6',  id:'six'      },
  { value: '+',  id:'add'      },
  { value: '1',  id:"one"      },
  { value: '2',  id:"two"      },
  { value: '3',  id:"three"    },
  { value: '=',  id:'equals'   },
  { value: '0',  id:"zero"     },
  { value: '.',  id:"decimal"  }
];

// Two pass approach to parsing. Carry out division and multiplication,
// then do addition and subtraction. Uses an intermediate array post
// pass 1.
function evalMaths (str) {
    // Split string into constituent parts
    let mathArr=str.split(" ");

    // Store the results of pass 1
    let nwArr=[];

    let numOne, numTwo, operator;
    let nwNum=0, res=0;
    let lstOp;
  
    /* BOGMAS order -- Multiplication & Division */
    let x=0;
    while (x+1<mathArr.length) {
      numOne = (lstOp=="*"|lstOp=="/") ? nwNum : mathArr[x];
      operator = mathArr[x+1];
      numTwo   = mathArr[x+2];
    
      switch (operator) {
        case '-':
        case '+':
          (nwArr.length==0) ? nwArr.push(numOne) : "";
          nwArr.push(operator);
          nwArr.push(numTwo);
          break;
        case '*':
          nwNum=numOne*numTwo;
          (nwArr.length==0) ? nwArr.push(nwNum) : nwArr[nwArr.length-1]=nwNum;
          break;
        case '/':
          nwNum=numOne/numTwo;
          (nwArr.length==0) ? nwArr.push(nwNum) : nwArr[nwArr.length-1]=nwNum;
          break;
      }
      lstOp = operator;
      x = x + 2;
  }

  /* BOGMAS order -- Addition & Subtraction */
  mathArr=nwArr;
  res=mathArr[0];
  x=0;
  while (x+1<mathArr.length) {
    operator = mathArr[x+1];
    numTwo   = mathArr[x+2]; 
    res=(operator=='+') ? Number(res) + Number(numTwo) : Number(res) - Number(numTwo);
    x = x + 2;
  }
  return(res)
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.handleButton = this.handleButton.bind(this);
  }
  
  // 'AC' just resets the screen
  dealWithClear() {
    this.props.changeState("equation", "");
    this.props.changeState("result", "0");
  }

  dealWithDecimalPoint() {
    let currNum  = this.props.state.result;
    let equation = this.props.state.equation;
    let currCh   = this.props.value;
    
    // Regular expressions
    const numberAndDecimalPoint    = /(^[0-9]+\.)/
    const operatorAsLastCharacter  = /^(0|\+|\-|\/|\=|x)$/
    const numberAtEquationEndMatch = /([0-9]+)(([.][0-9]*)?)$/
    
    // Clear any old equation
    if (/\=/.test(equation)) {
      currNum="0";
      equation="";
    }
    
    // Updating the current number
    if (numberAndDecimalPoint.test(currNum)) {
      /* Do Nothing - this is a duplicate decimal point */
    } else 
    // Start of a new number
    if (operatorAsLastCharacter.test(currNum)) {
      currNum="0."
    } else {
      currNum=currNum+currCh
    }
    
    // Updating the main equation
    if (numberAtEquationEndMatch.test(equation)) {
      equation = equation.replace(numberAtEquationEndMatch, currNum)  
    }
    
    // Update the state - gets reflected on the display
    this.props.changeState("result", currNum);
    this.props.changeState("equation", equation);
  }
  
  dealWithNumber() {
    let result   = this.props.state.result;
    let equation = this.props.state.equation;
    let currCh   = this.props.value;

    // Regular expressions
    const curNumStartsWithOperator = /(^|\+|\-|\/|x)$/
    const partialNumber            = /(^[0-9]?[.])?([0-9]?)$/
    const halfwayThroughNumber      = /^((.*)([\+|\-|\/|x]))(.*?)$/
    const operatorAlreadyInEquation = /(\+|x|\-|\.|\/)\-?$/
    
    // Clear any old equation
    if (/\=/.test(equation)) {
      result="";
      equation="";
    }
    
    // Dealing with the current number
    
    // Beginning of new number, either empty, an operator, or equal
    if (curNumStartsWithOperator.test(result) || result==="0" || result=="=") {
          result = currCh
    } else {
      if (partialNumber.test(result)) {
        result = result + currCh
      } else {
        result = currCh
      }
    }
    
    // Reflecting in the main equation
    if (halfwayThroughNumber.test(equation)) { 
      equation=equation.replace(halfwayThroughNumber, '$1'+result)
    } else { 
      if (operatorAlreadyInEquation.test(result)) {
        equation=equation+result;
      } else {
        equation=result;
      }
    }
    
    // Update the state - gets reflected on the display
    this.props.changeState("result", result)
    this.props.changeState("equation", equation);
  }
  
  dealWithOperator() {
    let equation = this.props.state.equation;
    let currCh   = this.props.value;

    // Regular Expressions
    const operatorWithOptionalMinus = /((\+|x|\-|\.|\/)\-?)$/
    const operator                  = /[0-9]+(\+|x|\-|\/?)$/
    const minusOperator             = /^\-$/
    
    if (equation!="") {
      if (minusOperator.test(equation)) {
          /* Do nothing, this is a negative number at start of equation */
      } else {
        // has the equal sign been pressed previously?
        if (/\=/.test(equation)) {
          equation=equation.replace(/.*\=(.*)/, '$1');
          equation=equation+currCh;
        } else
        // Minus has to be treat differently due to negative numbers 
        if (minusOperator.test(currCh)) {
          // Another operator, so append
          if (operator.test(equation)) {
            equation=equation+currCh
          } else {
            equation=equation.replace(operatorWithOptionalMinus, currCh);
          }
        } 
        // Other operator
        else if (operatorWithOptionalMinus.test(equation)) {
          equation=equation.replace(operatorWithOptionalMinus, currCh);
        } else {
          equation = equation + currCh;
        }
      }
    } 
    // Empty equation
    else {
      // Possible to have a negative number to start with
      if (minusOperator.test(currCh)) {
        equation=currCh;
      }
    }
    this.props.changeState("result",   currCh)
    this.props.changeState("equation", equation);
  }

  dealWithEqual() {
    let lEquation                 = this.props.state.equation;
    const operatorAsLastCharacter = /(\+|\-|\/|\=|x)$/;
    const operator                = /[\+\-\/x]+/;
    const equalSignAlready        = /\=/;

    // 1st get rid of nonsense edge cases
    if (equalSignAlready.test(lEquation)) {
      /* Do Nothing - already has an equal sign */
    } else 
    if (operatorAsLastCharacter.test(lEquation)) {
      /* Do Nothing - incomplete equation */
    } else
    if (!operator.test(lEquation)) {
      /* Do Nothing - no operator to apply */
    } else 
    if (!lEquation) {
      /* Do Nothing - no equation to process */
    } else { 
      // Tidy up the equation. More machine friendly rather than user friendly
      lEquation=lEquation.replace(/[x]/g,"*");
      lEquation=lEquation.replace(/([0-9]+)(\*|\/|\+|\-)/g, "$1 $2 ")
    
      // 1st bash at this used built in function
      // let outcome=eval(equation)
    
      // Uses a very basic maths parser to evaluate the equation
      let outcome = evalMaths(lEquation);
    
      // Round off numbers
      const precision = 100000
      outcome=Math.round(outcome*precision)/precision    
    
      // Update screen
      this.props.changeState("equation", this.props.state.equation+"="+outcome);
      this.props.changeState("result",   outcome)
    }
  }
  
  handleButton() {
    // let result   = this.props.state.result;
    let equation = this.props.state.equation;
    let currCh   = this.props.value;
    
    // Regexps to check
    const infinity     = /Infinity|NaN/;
    const isNum        = /^[0-9]$/
    const isDecimalPt  = /^\.$/
    const isOperator   = /(\+|x|\/|\-)$/
    
    if (currCh === 'AC') {
      this.dealWithClear();     
    } else
    if (infinity.test(equation)) {
      /* Do Nothing - last calc error'd */
    }
    else if (currCh === "=") {
      this.dealWithEqual()
    } else
    if (isNum.test(currCh)) {
      this.dealWithNumber();
    } else
    if (isDecimalPt.test(currCh)) {
      this.dealWithDecimalPoint();
    }
    if (isOperator.test(currCh)) {
        this.dealWithOperator();
    }
  }
  render() {
    return (
       <button className="grid-item" 
               id={this.props.id}
               onClick={this.handleButton}
       >{this.props.value}</button>
    )
  }
}
  
class ButtonPad extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (  
      <div className="grid-container" id="calculator-pad">
      { calcPad.map((button) => 
          <Button className="grid-item" 
                  id={button.id}
                  value={button.value}
                  state={this.props.state}
                  changeState={this.props.changeState}
          />
          )
      }
      </div>
    );
  }
}

class DisplayScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return ( 
      <div className="grid-container display-panel">
        <label id="equation">{this.props.equation}</label>
        <label id="display">{this.props.result}</label>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equation: "",
      result: "0"
    }
  }
  changeState = (toChange, state) => {
    this.setState({ [toChange]: state });
  }
  render() {
    return (
      <div id="calculator" >
        <DisplayScreen
          equation={this.state.equation}
          result={this.state.result}
        />
        <ButtonPad 
          changeState={this.changeState}
          state={this.state}
        />
      </div>
    );
  }
}

const rootElt = document.getElementById("root")      
ReactDOM.render(<App />, rootElt)