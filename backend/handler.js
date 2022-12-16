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

  console.log(inputId)

  let resp = await s3.getSignedUrl('getObject', {
    Bucket: 'codepage-hackathon-hackathon-inputfilesbucket-34eho671ijhs',
    Key: inputId + '.txt',
    Expires: 1000
  })
  console.log(resp)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: resp
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
  console.log('Val')
  console.log(values)

  console.log(tempS)
  var params = {
    TableName: 'HackathonTeams',
    Key: {
      PK: {
        S: teamId
      }
    }
  }
  let resp = await dynamodb.getItem(params).promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(resp)
  }
}

async function getChallenges(teamName){

  
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
  var minJumps = function([steps]) {
    const minJumps = new Array(steps.length).fill(Infinity);
    minJumps[0] = 0;
    for (let i = 0; i < steps.length; i++) {
      for (let j = 1; j <= steps[i]; j++) {
        if (i + j < steps.length) {
          minJumps[i + j] = Math.min(minJumps[i + j], minJumps[i] + 1);
        }
      }
    }
  
    return minJumps[steps.length - 1];
  }
  //CHALLENGE 3
  var countPalindromes = function ([s]) {
    let n = s.length;
    let count = 0;
    for (let i = 0; i < n; i++) {
      let palindromeOdd = getPalindromeLength(s, i, i);
      let palindromeEven = getPalindromeLength(s, i, i + 1);
      count += palindromeOdd + palindromeEven;
    }
    return count;
  }
  var getPalindromeLength= function (s, left, right) {
    let count = 0;
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++;
      left--;
      right++;
    }
    return count;
  }
  //CHALLENGE 4
  var sumOfSquares= function([numbers]) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] % 2 === 0) {
        sum += numbers[i] ** 2;
      }
    }
    return sum;
  }
  //CHALLENGE 4
  var replaceVowels = function([str]) {
    let vowels = 'aeiouAEIOU';
    let newStr = '';
    for (let i = 0; i < str.length; i++) {
      if (vowels.indexOf(str[i]) !== -1) {
        newStr += '*';
      } else {
        newStr += str[i];
      }
    }
    return newStr;
  }


  function generateRandomInputVow(length) {
    let input = '';
    for (let i = 0; i < length; i++) {
      input += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    return input;
  }


  //ADD challenge functions below.
  let challengeFunctions = [
    ([inp]) => lengthOfLongestSubstring([inp]),
    ([inp1, inp2]) => strStr([inp1, inp2]),
    ([inp]) => minJumps([inp]),
    ([inp]) => countPalindromes([inp]),
    ([inp]) => sumOfSquares([inp]),
    ([inp]) => replaceVowels([inp])
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
    () => [Array.from({length: 500}, () => Math.floor(Math.random() * 6)+1)],
    () => [generateString(100)],
    () => [Array.from({length: 500}, () => Math.floor(Math.random() * 100)+1)],
    () => [generateRandomInputVow(100)]
  ]

  let teamInput = []
  for (let i = 0; i < challengeFunctions.length; i++) {
    let tempInp = generateRandomInput[i]()
    teamInput.push(tempInp)
    await s3
      .putObject({
        Bucket: 'codepage-hackathon-hackathon-inputfilesbucket-34eho671ijhs',
        Key: teamName + 'ch' + i + '.txt',
        Body: tempInp.toString()
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

  const challengeInfo = await getChallenges(teamName);

  var params = {
    TableName: 'HackathonTeams',
    Item: {
      PK: teamName,
      ChallengeStatus: challengeInfo[0],
      ChallengeExpectedOutputs: challengeInfo[1],
    }
  }
  let resp = await docClient.put(params).promise()
  console.log('RESP')
  console.log(resp)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(resp)
  }
}
module.exports.updateTeam = async (event, context) => {
  console.info(event)
  let data = JSON.parse(event['body'])
  console.info(data)

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
  console.log(resp)

  let challengeId = data['challengeId']
  let challengeStatus = data['challengeStatus']
  const challengeStatusMap = {}

  for (const [key, value] of Object.entries(resp.Item.ChallengeStatus.M)) {
    console.log(value)
    if (key == challengeId) {
      challengeStatusMap[key] = challengeStatus
    } else {
      challengeStatusMap[key] = value.BOOL
    }
  }

  console.info(challengeStatusMap)

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
  console.log('HERE')
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
