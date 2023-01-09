function parseNumber(string) {
    // Create an object that maps the words for each number to the corresponding number
    const numberWords = {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      thirteen: 13,
      fourteen: 14,
      fifteen: 15,
      sixteen: 16,
      seventeen: 17,
      eighteen: 18,
      nineteen: 19,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50,
      sixty: 60,
      seventy: 70,
      eighty: 80,
      ninety: 90,
      hundred : 100,
      thousand:1000
    };
  
    // Split the string into an array of words
    const words = string.split(" ");
  
    // Initialize a variable to hold the total value of the number
    let total = 0;
  
    // Iterate through the array of words
    let hasHundred = false
    let hasThousand = false

    for (const word of words.reverse()) {
      // If the word is in the numberWords object, add its value to the total
      if (word in numberWords) {
        console.log(word)
        if (word =="hundred"){
                hasHundred=true
        }else if(word =="thousand"){
            hasThousand=true
        }else{
            if(hasHundred && hasThousand){
                total += numberWords[word]*100*1000;
                hasHundred = false
                hasThousand = false

            }
            else if(hasHundred ){
            total += numberWords[word]*100;
            hasHundred = false

            }else if(hasThousand){
                total += numberWords[word]*1000;
                hasThousand = false
            }
            else{
                total += numberWords[word];

            }

        }
      }
    }
  
    // Return the total value
    return total;
  }
  
  // Test the function
  console.log(parseNumber("nine hundred thousand two hundred one")); // Output: 26
  console.log(parseNumber("seventy five")); // Output: 75