/*----------------------------------------------------------------------------*/
/* Uses an array of quotes and authors. Length is recorded also               */
/*----------------------------------------------------------------------------*/
const quotes = [
["To be or not to be, that is the question.", "William Shakespeare"],
["Heaven is a place on earth.", "Belinda Carlisle"],
["The greatest glory in living lies not in never falling, but in rising every time we fall.", "Nelson Mandela"],
["The way to get started is to quit talking and begin doing.", "Walt Disney"],
["Your time is limited, so don't waste it living someone else's life.", "Steve Jobs"],
["If life were predictable it would cease to be life, and be without flavor.", "Eleanor Roosevelt"],
["If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.", "Oprah Winfrey"],
["If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", "James Cameron"],
["Life is what happens when you're busy making other plans.", "John Lennon"]
];
const numQuotes = quotes.length;
/*------------------------------------------------------------------------*/
/* Array of colors                                                        */
const colors = [
  "AliceBlue", 
  "Aqua", "Azure", 
  "Beize","Bisque",
  "burleyWood", "DarkGoldenRod"
];
const numColors = colors.length;
/*------------------------------------------------------------------------*/
/* Main Code                                                              */
/*------------------------------------------------------------------------*/
// Uses bootstrap, React

class Quotations extends React.Component {
  constructor(props) {
    super(props);
    
    /* Store as a state variable an index into the quotations and colors */
    this.state = {
      quotation: 0,
      colorIndex: 0
    }
    this.getQuoteAndColor=this.getQuoteAndColor.bind(this);
  }
  
  /* Chooses a random color and quotation */
  getQuoteAndColor() {
    this.setState({
      quotation: Math.floor(Math.random() * numQuotes),
      colorIndex: Math.floor(Math.random() * numColors)
    });
  }
  render() {
    /* I want to update the color on the fly */
    /* So create a style variable */
    let inputStyle = {
      'background-color':       
                  colors[this.state.colorIndex]
    };
    
    /* The link to twitter */
    let href = "https://twitter.com/intent/tweet?"
        href = href + "&hashtags=quotes" 
        href = href + "&text=" + quotes[this.state.quotation][0]
        href = href + " - "    + quotes[this.state.quotation][1];

    return (
      <div className="quote" style={inputStyle} style={inputStyle}>
        <h2 id="text">"{quotes[this.state.quotation][0]}"</h2>
        <h3 id="author">-{quotes[this.state.quotation][1]}</h3>
        <div className="row" id="button-row">
          <div className="col-lg">
            <a  target="_top" href={href} id="tweet-quote"
                className="btn btn-change btn-block btn-lg fa-brands fa-twitter"></a>
          </div>
          <div className="col-12 col-lg-auto">
            <button className="btn btn-change btn-block btn-lg"
              id="new-quote" onClick={this.getQuoteAndColor}><b>New Quote</b></button>
          </div>
         </div>
       </div>
  )}};

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return ( <Quotations /> );
  }
}

ReactDOM.render(<App />, document.getElementById("quote-box"))