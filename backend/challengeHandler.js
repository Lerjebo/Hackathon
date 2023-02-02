'use strict'
const AWS = require('aws-sdk')
// Set region
// Set the AWS Region.
const s3 = new AWS.S3()

AWS.config.update({ region: 'eu-west-1' })
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' })
var dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })
class Challenge {
  constructor (Description, functionSolution, functionRandomInp) {
    this.Description = Description
    this.functionSolution = functionSolution
    this.functionRandomInp = functionRandomInp
  }
  get getDescription () {
    return this.Description
  }
  get getFunctionSolution () {
    return this.functionSolution
  }
  get getFunctionRandomInp () {
    return this.functionRandomInp
  }
}
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
var countPalindromes = function ([S]) {
  let len = S.length,
    ans = 0
  for (let i = 0; i < len; i++) {
    let j = i - 1,
      k = i
    while (k < len - 1 && S[k] === S[k + 1]) k++
    ;(ans += ((k - j) * (k - j + 1)) / 2), (i = k++)
    while (~j && k < len && S[k] === S[j]) j--, k++, ans++
  }
  return ans
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
  let n = arr.length
  let ans = 0,
    count = 0
  arr.sort(function (a, b) {
    return a - b
  })
  var v = []
  v.push(arr[0])
  for (let i = 1; i < n; i++) {
    if (arr[i] != arr[i - 1]) v.push(arr[i])
  }
  for (let i = 0; i < v.length; i++) {
    if (i > 0 && v[i] == v[i - 1] + 1) count++
    else count = 1

    ans = Math.max(ans, count)
  }
  return ans
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

var reverseVowels = function ([s]) {
  const arr = [...s]
  const VOWELS = 'aeiouAEIOU'

  for (let i = 0, j = arr.length - 1; i < j; i++, j--) {
    while (!VOWELS.includes(arr[i]) && i < j) {
      i++
    }

    while (!VOWELS.includes(arr[j]) && i < j) {
      j--
    }

    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr.join('')
}

//CHALLENGE 14

var firstNonRepeatedChar = function ([str]) {
  for (let i = 0; i < str.length; i++) {
    if (str.indexOf(str[i]) === str.lastIndexOf(str[i])) {
      return str[i]
    }
  }
  return null
}
//CHALLENGE 15

var largestOddNumber = function ([num]) {
  // Go through the string backwards until an odd digit is found then return that substring
  for (let i = num.length - 1; i >= 0; i--) {
    switch (num[i]) {
      case '1':
      case '3':
      case '5':
      case '7':
      case '9':
        return parseInt(num.substring(0, i + 1))
    }
  }

  return -1
}
function generateRandomInputOdd () {
  let num = ''
  num += Math.floor(Math.random() * 9 + 1)

  for (let i = 0; i < 25; i++) {
    num += Math.floor(Math.random() * 10)
  }

  return num
}
function generateRandomString (length, characters) {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
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
  const firstRow = 'qwertyuiop'
  const secondRow = 'asdfghjkl'
  const thirdRow = 'zxcvbnm'
  const allChars = firstRow + secondRow + thirdRow
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
function generateRandomInputVowels (stringLen) {
  const vowels = 'aeiouAEIOU'
  var s = ''

  // Use a loop to generate the string
  for (let i = 0; i < stringLen; i++) {
    // Use a random number between 0 and 1 to determine if the current character
    // is a vowel or not
    if (Math.random() < 0.2) {
      // 20% chance of the current character being a vowel
      s += vowels.charAt(Math.floor(Math.random() * vowels.length))
    } else {
      // 80% chance of the current character being a consonant
      s += String.fromCharCode(97 + Math.floor(Math.random() * 26))
    }
  }
  return s
}

const characters2 = 'abcdefghijklmnopqrstuvwxyz'

function generateString2 (length) {
  let result = ''
  const charactersLength = characters2.length
  for (let i = 0; i < length; i++) {
    result += characters2.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

const challenges = [
  'Given a string s, find the length of the longest substring without repeating characters.',
  'Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.',
  'You are given a list of integers, where each element represents the maximum number of steps that can be jumped going forward from that element. Write a function to return the minimum number of jumps you must take in order to get from the start to the end of the list. For example, given [6, 2, 4, 0, 5, 1, 1, 4, 2, 9], you should return 2, as the optimal solution involves jumping from index 0 to index 4, and then from index 4 to index 9.',
  'Write a function that takes in a string s and returns the number of palindromes that can be formed by substrings of s.',
  'Write a function that takes in a list of integers and returns the sum of the squares of all the even numbers in the list. For example, given the input [1, 2, 3, 4, 5], the function should return 20, because the even numbers in the list are 2 and 4, and the sum of their squares is 4 + 16 = 20.',
  "Write a function that takes in a string and returns a new string where all the vowels (the letters 'a', 'e', 'i', 'o', and 'u') in the input string are replaced with asterisks ('*'). The function should preserve the case of the original string. For example, given the input 'Hello World', the function should return 'H*ll* W*rld'.",
  'Write a function that takes in an array of integers nums and returns the maximum sum of any contiguous subarray. For example, given the input [-2, 1, -3, 4, -1, 2, 1, -5, 4], the function should return 6, since the maximum sum is achieved by the subarray [4, -1, 2, 1].',
  "Write a function that takes in an array of integers arr and returns the minimum number of swaps required to sort the array in ascending order. For example, given the input [7, 1, 3, 2, 4, 5, 6], the function should return 5, since it takes 5 swaps to sort the array: Swap 7 and 1 to get [1, 7, 3, 2, 4, 5, 6] Swap 7 and 3 to get [1, 3, 7, 2, 4, 5, 6] Swap 7 and 2 to get [1, 3, 2, 7, 4, 5, 6] Swap 7 and 4 to get [1, 3, 2, 4, 7, 5, 6] Swap 7 and 5 to get [1, 3, 2, 4, 5, 7, 6] For example, given the input [-2, 1, -3, 4, -1, 2, 1, -5, 4], the function should return 6, since the maximum sum is achieved by the subarray [4, -1, 2, 1]. For example, given the input 'Hello World', the function should return 'H*ll* W*rld'.",
  'Write a function that takes in a matrix of integers matrix and returns the minimum sum of a path from the top left corner to the bottom right corner. You can only move right or down. For example, given the input: [1, 3, 1], [1, 5, 1], [4, 2, 1] The function should return 7, since the minimum sum is achieved by the path [1, 3, 1, 1, 1]',
  'Write a function that takes in an array of integers and returns the length of the longest sequence of consecutive integers in the array.',
  'Given an integer, return the number of prime numbers that are strictly less.',
  'Given an 10 x 10 2D binary grid grid which represents a map of ones (land) and zeroes (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water. Example: Input: grid = [[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]] Output: 3',
  "Given an array of strings words, return the number of words that can be typed using letters of the alphabet on only one row of a keyboard like the description below. In the American keyboard: the first row consists of the characters 'qwertyuiop',the second row consists of the characters 'asdfghjkl', andthe third row consists of the characters 'zxcvbnm'. Example 1: Input: words = ['Hello','Alaska','Dad','Peace'] Output: 2",
  "Given a string s, reverse only all the vowels in the string and return it.The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both lower and upper cases, more than once.Example: Input: s = 'hello' Output: 'holle'",
  'Write a function that takes in a string and returns the first non-repeated character in the string. If no unique character is found, return null.',
  "You are given a string num, representing a large integer. Return the largest-valued odd integer that is a non-empty substring of num, or -1 if no odd integer exists. A substring is a contiguous sequence of characters within a string.Example 1:Input: num = '52' Output: '5' Explanation: The only non-empty substrings are '5', '2', and '52'. '5' is the only odd number. Example 2: Input: num = '4206'Output: '' Explanation: There are no odd numbers in '4206'. \n Example 3: Input: num = '35427' Output: '35427' Explanation: '35427' is already an odd number."
]

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
let challenges_data = []

challenges_data.push(
  new Challenge(
    challenges[0],
    ([inp]) => lengthOfLongestSubstring([inp]),
    () => [generateString(100)]
  )
)
challenges_data.push(
  new Challenge(
    challenges[1],
    ([inp1, inp2]) => strStr([inp1, inp2]),
    () => {
      let randStr = generateString(25)
      let substr = randStr.substr(
        Math.floor(Math.random() * (randStr.length - 4)),
        4
      )
      return [randStr, substr]
    }
  )
)
challenges_data.push(
  new Challenge(
    challenges[2],
    ([inp]) => minJumps([inp]),
    () => [Array.from({ length: 500 }, () => Math.floor(Math.random() * 6) + 1)]
  )
)
challenges_data.push(
  new Challenge(
    challenges[3],
    ([inp]) => countPalindromes([inp]),
    () => [generateString2(100)]
  )
)
challenges_data.push(
  new Challenge(
    challenges[4],
    ([inp]) => sumOfSquares([inp]),
    () => [
      Array.from({ length: 500 }, () => Math.floor(Math.random() * 100) + 1)
    ]
  )
)
challenges_data.push(
  new Challenge(
    challenges[5],
    ([inp]) => replaceVowels([inp]),
    () => [generateRandomInputVow(100)]
  )
)
challenges_data.push(
  new Challenge(
    challenges[6],
    ([inp]) => findMaximumSubarray([inp]),
    () => [
      Array.from({ length: 500 }, () => Math.floor(Math.random() * 10) - 5)
    ]
  )
)
challenges_data.push(
  new Challenge(
    challenges[7],
    ([inp]) => findMinimumSwapsToSortArray([inp]),
    () => {
      const numbers = []
      for (let i = 1; i <= 110; i++) {
        numbers.push(i)
      }

      // Randomize the list
      numbers.sort(() => Math.random() - 0.5)
      return [numbers]
    }
  )
)

challenges_data.push(
  new Challenge(
    challenges[8],
    ([inp]) => findMinimumPathSum([inp]),
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
    }
  )
)

challenges_data.push(
  new Challenge(
    challenges[9],
    ([inp]) => longestIntegerSequene([inp]),
    () => [Array.from({ length: 500 }, () => Math.floor(Math.random() * 1000))]
  )
)

challenges_data.push(
  new Challenge(
    challenges[10],
    ([inp]) => countPrimes([inp]),
    () => [Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000]
  )
)

challenges_data.push(
  new Challenge(
    challenges[11],
    ([inp]) => numIslands([inp]),
    () => {
      let arr = Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => Math.round(Math.random()))
      )
      return [arr]
    }
  )
)
challenges_data.push(
  new Challenge(
    challenges[12],
    ([inp]) => findWords([inp]),
    () => [generateRandomInputTranslate(100)]
  )
)
challenges_data.push(
  new Challenge(
    challenges[13],
    ([inp]) => reverseVowels([inp]),
    () => [generateRandomInputVowels(50)]
  )
)

challenges_data.push(
  new Challenge(
    challenges[14],
    ([inp]) => firstNonRepeatedChar([inp]),
    () => [
      generateRandomString(
        Math.floor(Math.random() * 15) + 40,
        'abcdefghijklmnopqrstuvwxyz'
      )
    ]
  )
)
challenges_data.push(
  new Challenge(
    challenges[15],
    ([inp]) => largestOddNumber([inp]),
    () => [generateRandomInputOdd()]
  )
)

async function getChallenges (teamName) {
  let teamInput = []
  for (let i = 0; i < challenges_data.length; i++) {
    let tempInp = challenges_data[i].getFunctionRandomInp()
    teamInput.push(tempInp)
    let str = ''
    for (const itm in tempInp) {
      str += JSON.stringify(tempInp[itm]) + '\n'
    }
    let ind = i + 1
    await s3
      .putObject({
        Bucket: 'codepage-hackathon-hackathon-inputfilesbucket-34eho671ijhs',
        Key: teamName + '_ch' + ind + '.txt',
        Body: str
      })
      .promise()
  }

  let expectedOutput = []
  for (let i = 0; i < challenges_data.length; i++) {
    expectedOutput.push(challenges_data[i].getFunctionSolution(teamInput[i]))
  }

  const challengeStatusMap = {}
  for (let i = 0; i < challenges_data.length; i++) {
    challengeStatusMap[i] = false
  }
  const challengeOutputMap = {}
  for (let i = 0; i < challenges_data.length; i++) {
    challengeOutputMap[i] = expectedOutput[i]
  }
  return [challengeStatusMap, challengeOutputMap]
}
module.exports.postTeam = async (event, context) => {
  let data = JSON.parse(event['body'])
  let teamName = data['teamName']
  var today = new Date()
  let hours = parseInt(today.getHours()) + 1
  var time = hours + ':' + today.getMinutes() + ':' + today.getSeconds()

  const challengeInfo = await getChallenges(teamName)

  var params = {
    TableName: 'HackathonTeams',
    Item: {
      PK: teamName,
      ChallengeStatus: challengeInfo[0],
      ChallengeExpectedOutputs: challengeInfo[1],
      ChallengePoints: 0,
      ChallengeUpdateTime: time
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
module.exports.postAllChallenges = async (event, context) => {
  /*let rand_inp = challenges_data[0].getFunctionRandomInp()
  console.error(rand_inp)

  let sol = challenges_data[0].getFunctionSolution(rand_inp) //([rand_inp])
  console.error(sol)
*/
  var arrayLength = challenges_data.length
  for (var i = 0; i < arrayLength; i++) {
    let num = i
    var params = {
      TableName: 'HackathonChallenges',
      Item: {
        PK: num.toString(),
        Description: challenges_data[i].getDescription
      }
    }
    await docClient.put(params).promise()
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: 'Success'
  }
}
