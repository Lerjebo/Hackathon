const firstRow = "qwertyuiop";
const secondRow = "asdfghjkl";
const thirdRow = "zxcvbnm";
const allChars = firstRow + secondRow + thirdRow;
const numWords = 5; // Number of words to generate

// Create an empty array to hold the generated words
let words = [];

// Use a loop to generate the words
for (let i = 0; i < numWords; i++) {
  // Determine the row that the word will be generated from
  let row = Math.floor(Math.random() * 3);
  let rowChars = "";
  if (row === 0) {
    rowChars = firstRow;
  } else if (row === 1) {
    rowChars = secondRow;
  } else {
    rowChars = thirdRow;
  }

  // Generate a random word of random length between 3 and 8
  let word = "";
  let wordLen = 3 + Math.floor(Math.random() * 6);
  for (let j = 0; j < wordLen; j++) {
    // Use a random number between 0 and 1 to determine if we're going to select
    // a character from a different row
    if (Math.random() < 0.2) {
      // 20% chance of selecting a character from a different row
      let otherRowChars = allChars.replace(rowChars, "");
      word += otherRowChars.charAt(
        Math.floor(Math.random() * otherRowChars.length)
      );
    } else {
      word += rowChars.charAt(Math.floor(Math.random() * rowChars.length));
    }
  }

  // Add the generated word to the array
  words.push(word);
}


var findWords = function(words) {
  const cache = {
  q: 0,
  w: 0,
  e: 0,
  r: 0,
  t: 0,
  y: 0,
  u: 0,
  i: 0,
  o: 0,
  p: 0,
  a: 1,
  s: 1,
  d: 1,
  f: 1,
  g: 1,
  h: 1,
  j: 1,
  k: 1,
  l: 1,
  z: 2,
  x: 2,
  c: 2,
  v: 2,
  b: 2,
  n: 2,
  m: 2,
};
const answ = [];
words.forEach(word => {
  if (word.length === 1) {
    answ.push(word);
  }
  else {
    const currRow = cache[word[0].toLowerCase()];
    for (let i = 1; i < word.length; i++) {
      if (cache[word[i].toLowerCase()] !== currRow) break;

      if (i === word.length - 1) answ.push(word);
    }
  }
});
return answ.length;
};
console.log(findWords(["zcvxlp","atsff","zvxvnci","dhxjhsa","skdgqls","zcbvb","mfm","ecf","jfd","nmb","dhghg","moaxg","trqx","rod","gagfkdv","gvt","thfqwt","bzcqznr","xxvnn","mcmbbvn","yos","pnryvdt","sslankal","hxf","wvjsj","sskfisl","toxwr","pvretoq","wotu","kasu","cji","eptoojy","dahem","uzx","bblmxv","xcc","jdk","rrc","ltee","quw","grplor","rubt","ghll","czxbbmjg","yol","wkqr","zvjnbv","iaqoo","hosghklf","oqe","yyq","zwakvwv","cvmvbrvc","bmxblx","czzvxxzn","zvqlmx","kbkqll","owxy","xjl","oiuy","mtlrr","gml","riyyqrlu","cbndzmz","lhlhfldy","wrwtrq","jsdhd","skhlg","gftdskkj","aoihywm","tuuq","cmzbcxvb","hlml","lgdmh","ujou","zcbrv","zzdmvzzv","xrnvhbvv","sflslf","sjsgsifl","fsll","glfh","znvbg","bnqbvg","wwrtuau","bzzi","wepp","yap","dhs","zbcf","ivat","qlkl","syw","ntw","bggkdydd","bxjcnxi","bxvnvc","ljdqgjlk","lkd","yiqv"]))