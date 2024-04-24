/** Textual markov chain generator */
class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.obj;
    this.makeChains();
  }

  checkWord(word){ // check word and remove any fat from the string including '.', ';', '!', etc, anything that would duplicate the same word.
    if(!word){
      return null;
    }
    let restrictions = new Set([',', '.', '!', ';', '?', '"', '-', '_', '(', ')', ':', '“', '”']);
    let fixed_word = "";
    for(let i = 0; i < word.length; i++){
      let char = word[i];
      if(!(restrictions.has(char))){
        fixed_word += char;
      }
    }
    return fixed_word.toLowerCase();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    // TODO
    let obj = {};
    let sentence = this.words;
    let word_set = new Set();

    for(let i=0; i<sentence.length; i++){
      let word = this.checkWord(sentence[i]);
      if(obj[word]){
        obj[word].add(this.checkWord(sentence[i+1]));
      }
      else{
        obj[word] = new Set([this.checkWord(sentence[i+1] || null)]);
      }
      word_set.add(word);
    }
    for(let i in obj){ // convert sets in obj to list
      obj[i] = Array.from(obj[i]);
    }
    this.obj = obj;
  }


  /** return random text from chains */

  makeText(numWords = 100) {
    if(this.obj == null){
      print("Error: No obj currently exists. Did you run makeChains?");
      process.exit(1);
    }

    let sentence = "";
    let obj = this.obj;
    let keys_list = Object.keys(obj);

    for(let i = 0; i<numWords; i++){
      let random_index = Math.floor(Math.random() * keys_list.length);
      let new_key = keys_list[random_index];
      
      sentence += `${new_key} `;
      keys_list = obj[new_key];

    }
    return sentence;
  }
}

module.exports = {
  MarkovMachine: MarkovMachine
};
