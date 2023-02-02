'use strict'
const AWS = require('aws-sdk')
AWS.config.update({ region: 'eu-west-1' })
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' })
var dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

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
  let correctAnswer = 'False'

  if (typeof resp.Item != 'undefined') {
    if (
      typeof resp.Item.ChallengeExpectedOutputs.M[challengeId].N != 'undefined'
    ) {
      correctAnswer =
        resp.Item.ChallengeExpectedOutputs.M[challengeId].N ==
        parseFloat(answer)
          ? 'True'
          : correctAnswer
    } else if (
      typeof resp.Item.ChallengeExpectedOutputs.M[challengeId].S != 'undefined'
    ) {
      correctAnswer =
        resp.Item.ChallengeExpectedOutputs.M[challengeId].S == answer
          ? 'True'
          : correctAnswer
    }

    if (
      correctAnswer == 'True' &&
      resp.Item.ChallengeStatus.M[challengeId].BOOL == false
    ) {
      let tempScore = parseInt(resp.Item.ChallengePoints.N) + 1

      let updExp = 'set ChallengePoints =:updateValue'
      var params = {
        TableName: 'HackathonTeams',
        Key: {
          PK: teamId
        },
        UpdateExpression: updExp,
        ExpressionAttributeValues: {
          ':updateValue': tempScore
        }
      }
      try {
        await docClient.update(params).promise()
      } catch (err) {
        console.error(err)
      }

      var today = new Date()
      let hours = parseInt(today.getHours()) + 1
      var time = hours + ':' + today.getMinutes() + ':' + today.getSeconds()
      let updExp2 = 'set ChallengeUpdateTime =:updateValue'
      var params = {
        TableName: 'HackathonTeams',
        Key: {
          PK: teamId
        },
        UpdateExpression: updExp2,
        ExpressionAttributeValues: {
          ':updateValue': time
        }
      }
      try {
        await docClient.update(params).promise()
      } catch (err) {
        console.error(err)
      }
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

  if (typeof resp.Item != 'undefined') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(resp.Item.ChallengeStatus.M)
    }
  } else {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(resp)
    }
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
