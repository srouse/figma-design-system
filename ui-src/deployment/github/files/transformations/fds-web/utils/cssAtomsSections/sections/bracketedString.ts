


export default class BracketedString {

  constructor() {
    this.brackets = [];
    this.entries = [];
  }

  brackets: string[][];
  entries: string[];

  addBracket(bracket: string | string[] | undefined) {
    if (bracket) {
      if (Array.isArray(bracket)) {
        let finalBracketArr = bracket.map(tmpBracket => tmpBracket.trim());
        this.brackets.push(
          finalBracketArr
        );
      } else {
        let finalBracket = bracket.trim();
        // take off brackets if already there...
        if (finalBracket.lastIndexOf('{') === finalBracket.length-1) {
          finalBracket = finalBracket.substring(0, finalBracket.length-1).trim();
        }
        let bracketArr = finalBracket.split('\n');
        bracketArr = bracketArr.map(bracket => {
          // lets take off the last comma just to be sure we get the ones we need
          let trimmedBracket = bracket.trim();
          if (trimmedBracket.lastIndexOf(',') === trimmedBracket.length-1) {
            trimmedBracket = trimmedBracket.substring(0, trimmedBracket.length-1).trim();
          }
          return trimmedBracket;
        })
        this.brackets.push(
          bracketArr
        );
      }
    }
  }

  addEntry(entry: string | undefined) {
    if (entry) {
      const entryArr = entry.split('\n');
      entryArr.map(entry => {
        if (entry.trim()) {
          this.entries.push(entry.trim());
        }
      });
    }
  }

  render() : string {
    const output: string[] = [];
    const indent = '  ';
    const totalBrackets = this.brackets.length;

    this.brackets.map((bracket, index) => {
      bracket.map((subBracket, subIndex) => {
        if (subIndex === bracket.length-1) {
          output.push(`${indent.repeat(index)}${subBracket} {`);
        }else{
          output.push(`${indent.repeat(index)}${subBracket},`);
        }
      });
    });

    this.entries.map((entry) => {
      output.push(`${indent.repeat(totalBrackets)}${entry}`);
    });

    this.brackets.map((bracket, index) => {
      output.push(`${indent.repeat(totalBrackets-index-1)}}`);
    });

    return output.join('\n');
  }
}
