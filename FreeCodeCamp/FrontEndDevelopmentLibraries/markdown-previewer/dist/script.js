/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Below is the sample code used to test this application
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const sample = "\
# Welcome to my React Markdown Previewer! \n\
## This is a sub-heading... \n\
### And here's some other cool stuff: \n\
\n\
Heres some code, `<div></div>`, between 2 backticks.\n\
\n\
``` \n\
// this is multi-line code: \n\
\n\
function anotherExample(firstLine, lastLine) { \n\
  if (firstLine == '```' && lastLine == '```') { \n\
    return multiLineCode; \n\
  } \n\
} \n\
``` \n\
You can also make text **bold**... whoa! \n\
Or _italic_. \n\
Or... wait for it... **_both!_** \n\
And feel free to go crazy ~~crossing stuff out~~. \n\
\n\
There's also [links](https://www.freecodecamp.org), and\n\
> Block Quotes!\n\
\n\
And if you want to get really crazy, even tables:\n\
\n\
Wild Header | Crazy Header | Another Header?\n\
------------ | ------------- | -------------\n\
Your content can | be here, and it | can be here....\n\
And here. | Okay. | I think we get it.\n\
\n\
\n\
- And of course there are lists.\n\
  - Some are bulleted.\n\
     - With different indentation levels.\n\
        - That look like this.\n\
\n\
\n\
1. And there are numbered lists too.\n\
1. Use just 1s if you want!\n\
1. And last but not least, let's not forget embedded images:\n\
\n\
![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)\n\
\
Simulate a \rBR\r\
";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* ******************************************************* */

/* Start of React Code */
class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: sample };

    this.handleChange = this.handleChange.bind(this);
  }

  // Gets called on every key press in the editor text area
  handleChange(event) {
    this.setState({
      input: event.target.value });

  }

  // Produces the HTML from Markup
  getMarkdownText(text) {
    // Required for optional test.
    marked.use({
      breaks: true, // interpret \r as <BR>
      gfm: true // required for above. Use GitHub flavour
    });

    // console.log(DOMPurify.sanitize(marked(text)))
    // Use purify to check safety of HTML
    // Use marked to parse the markup
    return { __html: DOMPurify.sanitize(marked(text)) };
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "bundary", className: "container-fluid" }, /*#__PURE__*/
      React.createElement("div", { className: "row", id: "head-row" }, /*#__PURE__*/
      React.createElement("div", { className: "col-6", id: "title" }, /*#__PURE__*/
      React.createElement("h1", null, "Editor")), /*#__PURE__*/

      React.createElement("div", { className: "col-6", id: "title" }, /*#__PURE__*/
      React.createElement("h1", null, "Preview"))), /*#__PURE__*/



      React.createElement("div", { className: "row", id: "text-row" }, /*#__PURE__*/

      React.createElement("div", { className: "col-6" }, /*#__PURE__*/
      React.createElement("textarea", { id: "editor",
        className: "form-control",
        rows: "15",
        value: this.state.input,
        onChange: this.handleChange })), /*#__PURE__*/



      React.createElement("div", { className: "col-6 preview",
        id: "preview",
        dangerouslySetInnerHTML:
        this.getMarkdownText(this.state.input) }))));





  }}
;

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement(Editor, null);

  }}



ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("markup_edit"));