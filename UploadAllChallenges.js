const axios = require('axios');
let addr =
  'https://6b9dfg8pp3.execute-api.eu-west-1.amazonaws.com/Hackathon/postChallenges'
let updateData = {}
axios
  .post(addr, updateData)
  .then(res => {
 
    console.log("done")
  })
  .catch(reason => console.log(reason))
