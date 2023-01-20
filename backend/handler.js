'use strict'
const AWS = require('aws-sdk')
// Set region
// Set the AWS Region.

AWS.config.update({ region: 'eu-west-1' })
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' })
var dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateString (length) {
  let result = ' '
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

module.exports.getChallenge = async (event, context) => {
  var params = {
    TableName: 'HackathonChallenges',
    Select: 'ALL_ATTRIBUTES'
  }
  let resp = await dynamodb.scan(params).promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(resp)
  }
}

const s3 = new AWS.S3()

module.exports.upLoadInput = async (event, context) => {
  let data = JSON.parse(event['body'])
  let teamName = data['teamName']

  let resp = await s3
    .putObject({
      Bucket: 'codepage-hackathon-hackathon-inputfilesbucket-34eho671ijhs',
      Key: 'YOUR_FILE_NAME.txt',
      Body: 'formData'
    })
    .promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(resp)
  }
}

module.exports.getInput = async (event, context) => {
  let values = event['path'].split('/')
  let inputId = values[3]

  let resp = await s3.getSignedUrl('getObject', {
    Bucket: 'codepage-hackathon-hackathon-inputfilesbucket-34eho671ijhs',
    Key: inputId + '.txt',
    Expires: 100000
  })
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: resp
  }
}



module.exports.isCorrect = async (event, context) => {
  let values = event['path'].split('/')
  let tempS = ''
  var arrayLength = values.length
  for (var i = 3; i < arrayLength; i++) {
    tempS += decodeURIComponent(values[i])
  }

  let teamId = decodeURIComponent(values[3])
  let challengeId = decodeURIComponent(values[5])
  let answer = decodeURIComponent(values[7])

  var params = {
    TableName: 'HackathonTeams',
    Key: {
      PK: {
        S: teamId
      }
    }
  }
  let resp = await dynamodb.getItem(params).promise()
  let correctAnswer = "False"
  
  if(typeof resp.Item != "undefined"){


    if(typeof resp.Item.ChallengeExpectedOutputs.M[challengeId].N != "undefined"){
      correctAnswer = resp.Item.ChallengeExpectedOutputs.M[challengeId].N == parseFloat(answer) ? "True" : correctAnswer
    }else if(typeof resp.Item.ChallengeExpectedOutputs.M[challengeId].S != "undefined"){
      correctAnswer = resp.Item.ChallengeExpectedOutputs.M[challengeId].S == answer ? "True" : correctAnswer
    }

    

  }



  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: correctAnswer
  }
}



module.exports.getTeam = async (event, context) => {
  let values = event['path'].split('/')
  let tempS = ''
  var arrayLength = values.length
  for (var i = 3; i < arrayLength; i++) {
    tempS += decodeURIComponent(values[i])
  }

  let teamId = decodeURIComponent(values[3])
  var params = {
    TableName: 'HackathonTeams',
    Key: {
      PK: {
        S: teamId
      }
    }
  }
  let resp = await dynamodb.getItem(params).promise()



  if(typeof resp.Item != "undefined"){

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(resp.Item.ChallengeStatus.M)
    }
  }else{
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(resp)
    }
  }



}

async function getChallenges (teamName) {
  //CHALLENGE 0
  var lengthOfLongestSubstring = function ([string]) {
    var max = 0,
      current_string = '',
      i,
      char,
      pos

    for (i = 0; i < string.length; i += 1) {
      char = string.charAt(i)
      pos = current_string.indexOf(char)
      if (pos !== -1) {
        current_string = current_string.substr(pos + 1)
      }
      current_string += char
      max = Math.max(max, current_string.length)
    }
    return max
  }
  //CHALLENGE 1
  var strStr = function ([haystack, needle]) {
    return haystack.indexOf(needle)
  }
  //CHALLENGE 2
  var minJumps = function ([steps]) {
    const minJumps = new Array(steps.length).fill(Infinity)
    minJumps[0] = 0
    for (let i = 0; i < steps.length; i++) {
      for (let j = 1; j <= steps[i]; j++) {
        if (i + j < steps.length) {
          minJumps[i + j] = Math.min(minJumps[i + j], minJumps[i] + 1)
        }
      }
    }

    return minJumps[steps.length - 1]
  }
  //CHALLENGE 3
  var countPalindromes = function ([s]) {
    let n = s.length
    let count = 0
    for (let i = 0; i < n; i++) {
      let palindromeOdd = getPalindromeLength(s, i, i)
      let palindromeEven = getPalindromeLength(s, i, i + 1)
      count += palindromeOdd + palindromeEven
    }
    return count
  }
  var getPalindromeLength = function (s, left, right) {
    let count = 0
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++
      left--
      right++
    }
    return count
  }
  //CHALLENGE 4
  var sumOfSquares = function ([numbers]) {
    let sum = 0
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] % 2 === 0) {
        sum += numbers[i] ** 2
      }
    }
    return sum
  }
  //CHALLENGE 5
  var replaceVowels = function ([str]) {
    let vowels = 'aeiouAEIOU'
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
      if (vowels.indexOf(str[i]) !== -1) {
        newStr += '*'
      } else {
        newStr += str[i]
      }
    }
    return newStr
  }
  //CHALLENGE 6
  var findMaximumSubarray = function ([nums]) {
    let maxSum = nums[0]
    let currentSum = 0
    for (let i = 0; i < nums.length; i++) {
      currentSum = Math.max(currentSum + nums[i], nums[i])
      maxSum = Math.max(maxSum, currentSum)
    }
    return maxSum
  }

  //CHALLENGE 7
  var findMinimumSwapsToSortArray = function ([arr]) {
    let swaps = 0
    for (let i = 0; i < arr.length; i++) {
      while (arr[i] !== i + 1) {
        let temp = arr[i]
        arr[i] = arr[temp - 1]
        arr[temp - 1] = temp
        swaps++
      }
    }
    return swaps
  }
  //CHALLENGE 8
  var findMinimumPathSum = function ([matrix]) {
    // Initialize an array to store the minimum path sum to each cell
    const dp = Array(matrix.length)
      .fill(null)
      .map(() => Array(matrix[0].length).fill(null))
    dp[0][0] = matrix[0][0]
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        if (i === 0 && j === 0) continue
        if (i === 0) {
          dp[i][j] = dp[i][j - 1] + matrix[i][j]
        } else if (j === 0) {
          dp[i][j] = dp[i - 1][j] + matrix[i][j]
        } else {
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + matrix[i][j]
        }
      }
    }
    return dp[matrix.length - 1][matrix[0].length - 1]
  }
  //CHALLENGE 9

  var longestIntegerSequene = function findLongestSequence ([arr]) {
    arr.sort((a, b) => a - b)
    let longest = 0
    let current = 1
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === arr[i - 1] + 1) {
        current++
      } else {
        current = 1
      }
      longest = Math.max(longest, current)
    }
    return longest
  }
  //CHALLENGE 10
  var countPrimes = function ([n]) {
    let arr = new Array(n)
    let ans = 0
    for (let i = 2; i < n; i++) {
      if (arr[i]) continue
      ans++
      for (let mult = i * i; mult < n; mult += i) arr[mult] = 1
    }
    return ans
  }
  //CHALLENGE 11

  var numIslands = function ([grid]) {
    let count = 0
    function depthSearch (x, y) {
      if (grid[x][y] === 1) {
        grid[x][y] = 0
      } else {
        return
      }
      if (x < grid.length - 1) {
        depthSearch(x + 1, y)
      }
      if (y < grid[x].length - 1) {
        depthSearch(x, y + 1)
      }
      if (x > 0 && x < grid.length) {
        depthSearch(x - 1, y)
      }
      if (y > 0 && y < grid[x].length) {
        depthSearch(x, y - 1)
      }
    }
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 1) {
          count++
          depthSearch(i, j)
        }
      }
    }
    return count
  }

  //CHALLENGE 12
  var findWords = function ([words]) {
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
      m: 2
    }
    const answ = []
    words.forEach(word => {
      if (word.length === 1) {
        answ.push(word)
      } else {
        const currRow = cache[word[0].toLowerCase()]
        for (let i = 1; i < word.length; i++) {
          if (cache[word[i].toLowerCase()] !== currRow) break

          if (i === word.length - 1) answ.push(word)
        }
      }
    })
    return answ.length
  }

  //CHALLENGE 13

  var reverseVowels = function([s]) {
      const arr = [...s];
      const VOWELS = 'aeiouAEIOU';

      for(let i = 0, j = arr.length - 1; i < j; i++, j--) {
          while (!VOWELS.includes(arr[i]) && i < j) {
              i++;
          }
  
          while (!VOWELS.includes(arr[j]) && i < j) {
              j--;
          }
  
          [arr[i], arr[j]] = [arr[j], arr[i]];
      }
  
      return arr.join('');
  };

    //CHALLENGE 14

  var firstNonRepeatedChar= function ([str]) {
    for (let i = 0; i < str.length; i++) {
      if (str.indexOf(str[i]) === str.lastIndexOf(str[i])) {
        return str[i];
      }
    }
    return null;
  }
  //CHALLENGE 15


  var largestOddNumber = function([num]) {

    // Go through the string backwards until an odd digit is found then return that substring
    for (let i = num.length - 1; i >= 0; i--) {
        switch (num[i]) {
            case "1":
            case "3":
            case "5":
            case "7":
            case "9":
                return parseInt(num.substring(0, i + 1));
        }
    }
    
    return -1;
};

  function generateRandomInputOdd() {
    let num = "";
    num += Math.floor(Math.random() * 9 +1);

    for (let i = 0; i < 25; i++) {
      num += Math.floor(Math.random() * 10);
    }
    
    return num;
  }
  function generateRandomString(length, characters) {
    let result ="";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  function generateRandomInputVow (length) {
    let input = ''
    for (let i = 0; i < length; i++) {
      input += String.fromCharCode(Math.floor(Math.random() * 26) + 97)
    }
    return input
  }
  function generateRandomInputTranslate (numWords) {
    let words = []
    const firstRow = "qwertyuiop";
    const secondRow = "asdfghjkl";
    const thirdRow = "zxcvbnm";
    const allChars = firstRow + secondRow + thirdRow;
    // Use a loop to generate the words
    for (let i = 0; i < numWords; i++) {
      // Determine the row that the word will be generated from
      let row = Math.floor(Math.random() * 3)
      let rowChars = ''
      if (row === 0) {
        rowChars = firstRow
      } else if (row === 1) {
        rowChars = secondRow
      } else {
        rowChars = thirdRow
      }

      // Generate a random word of random length between 3 and 8
      let word = ''
      let wordLen = 3 + Math.floor(Math.random() * 6)
      for (let j = 0; j < wordLen; j++) {
        // Use a random number between 0 and 1 to determine if we're going to select
        // a character from a different row
        if (Math.random() < 0.2) {
          // 20% chance of selecting a character from a different row
          let otherRowChars = allChars.replace(rowChars, '')
          word += otherRowChars.charAt(
            Math.floor(Math.random() * otherRowChars.length)
          )
        } else {
          word += rowChars.charAt(Math.floor(Math.random() * rowChars.length))
        }
      }

      // Add the generated word to the array
      words.push(word)
    }
    return words
  }
  function generateRandomInputVowels (stringLen ) {
    const vowels = "aeiouAEIOU";
    var s = "";
    
    // Use a loop to generate the string
    for (let i = 0; i < stringLen; i++) {
      // Use a random number between 0 and 1 to determine if the current character
      // is a vowel or not
      if (Math.random() < 0.2) {
        // 20% chance of the current character being a vowel
        s += vowels.charAt(Math.floor(Math.random() * vowels.length));
      } else {
        // 80% chance of the current character being a consonant
        s += String.fromCharCode(97 + Math.floor(Math.random() * 26));
      }
    }
    return s;
  }
  //ADD challenge functions below.
  let challengeFunctions = [
    ([inp]) => lengthOfLongestSubstring([inp]),
    ([inp1, inp2]) => strStr([inp1, inp2]),
    ([inp]) => minJumps([inp]),
    ([inp]) => countPalindromes([inp]),
    ([inp]) => sumOfSquares([inp]),
    ([inp]) => replaceVowels([inp]),
    ([inp]) => findMaximumSubarray([inp]),
    ([inp]) => findMinimumSwapsToSortArray([inp]),
    ([inp]) => findMinimumPathSum([inp]),
    ([inp]) => longestIntegerSequene([inp]),
    ([inp]) => countPrimes([inp]),
    ([inp]) => numIslands([inp]),
    ([inp]) => findWords([inp]),
    ([inp]) => reverseVowels([inp]),
    ([inp]) => firstNonRepeatedChar([inp]),
    ([inp]) => largestOddNumber([inp]),

    


    
    

  ]

  //ADD challenge inputs below.
  let generateRandomInput = [
    () => [generateString(100)],
    () => {
      let randStr = generateString(25)
      let substr = randStr.substr(
        Math.floor(Math.random() * (randStr.length - 4)),
        4
      )
      return [randStr, substr]
    },
    () => [
      Array.from({ length: 500 }, () => Math.floor(Math.random() * 6) + 1)
    ],
    () => [generateString(100)],
    () => [
      Array.from({ length: 500 }, () => Math.floor(Math.random() * 100) + 1)
    ],
    () => [generateRandomInputVow(100)],
    () => [
      Array.from({ length: 500 }, () => Math.floor(Math.random() * 10) - 5)
    ],
    () => {
      const numbers = []
      for (let i = 1; i <= 110; i++) {
        numbers.push(i)
      }

      // Randomize the list
      numbers.sort(() => Math.random() - 0.5)
      return [numbers]
    },

    () => {
      const matrix = []
      for (let i = 0; i < 10; i++) {
        const row = []
        for (let j = 0; j < 10; j++) {
          row.push(Math.floor(Math.random() * 10) + 1)
        }
        matrix.push(row)
      }
      return [matrix]
    },

    () => [Array.from({ length: 500 }, () => Math.floor(Math.random() * 1000))],
    () => [Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000],

    () => {
      let arr = Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => Math.round(Math.random()))
      )
      return [arr]
    },
    () => [generateRandomInputTranslate(100)],
    () => [generateRandomInputVowels(50)],
    () => [generateRandomString(Math.floor(Math.random()*15)+40, "abcdefghijklmnopqrstuvwxyz")],
    () => [generateRandomInputOdd()]

    
  ]

  let teamInput = []
  for (let i = 0; i < challengeFunctions.length; i++) {
    let tempInp = generateRandomInput[i]()
    teamInput.push(tempInp)
    let str = ''
    for (const itm in tempInp) {
      str += JSON.stringify(tempInp[itm]) + '\n'
    }
    let ind = i+1
    await s3
      .putObject({
        Bucket: 'codepage-hackathon-hackathon-inputfilesbucket-34eho671ijhs',
        Key: teamName + '_ch' + ind + '.txt',
        Body: str
      })
      .promise()
  }

  let expectedOutput = []
  for (let i = 0; i < challengeFunctions.length; i++) {
    expectedOutput.push(challengeFunctions[i](teamInput[i]))
  }

  const challengeStatusMap = {}
  for (let i = 0; i < challengeFunctions.length; i++) {
    challengeStatusMap[i] = false
  }
  const challengeOutputMap = {}
  for (let i = 0; i < challengeFunctions.length; i++) {
    challengeOutputMap[i] = expectedOutput[i]
  }
  return [challengeStatusMap, challengeOutputMap]
}

module.exports.postTeam = async (event, context) => {
  let data = JSON.parse(event['body'])
  let teamName = data['teamName']

  const challengeInfo = await getChallenges(teamName)

  var params = {
    TableName: 'HackathonTeams',
    Item: {
      PK: teamName,
      ChallengeStatus: challengeInfo[0],
      ChallengeExpectedOutputs: challengeInfo[1]
    }
  }
  let resp = await docClient.put(params).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(resp)
  }
}
module.exports.updateTeam = async (event, context) => {
  let data = JSON.parse(event['body'])

  let teamName = data['teamName']

  var params = {
    TableName: 'HackathonTeams',
    Key: {
      PK: {
        S: teamName
      }
    }
  }
  let resp = await dynamodb.getItem(params).promise()

  let challengeId = data['challengeId']
  let challengeStatus = data['challengeStatus']
  const challengeStatusMap = {}

  for (const [key, value] of Object.entries(resp.Item.ChallengeStatus.M)) {
    if (key == challengeId) {
      challengeStatusMap[key] = challengeStatus
    } else {
      challengeStatusMap[key] = value.BOOL
    }
  }


  let updExp = 'set ChallengeStatus =:updateValue'
  var params = {
    TableName: 'HackathonTeams',
    Key: {
      PK: teamName
    },
    UpdateExpression: updExp,
    ExpressionAttributeValues: {
      ':updateValue': challengeStatusMap
    }
  }
  try {
    await docClient.update(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Sucessfully uploaded.',
          input: event
        },
        null,
        2
      ),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (err) {
    console.log(err)
    return err
  }
}
