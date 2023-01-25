import React from 'react'
import './App.css'
import axios from 'axios'
import { useContext, useState, useEffect } from 'react'
function App () {
  const [teamInformation, setTeamInformation] = useState({
    PK: '',
    ChallengeInputs: new Map(),
    ChallengeStatus: new Map()
  })
  
  const [loadingAnswer, setLoadingAnswer] = useState(false)

  const [challengeInfo, setChallengeInfo] = useState(() => new Map())
  const [challengeInfoKeys, setChallengeInfoKeys] = useState<String[]>([])
  const [currentTeam, setCurrentTeam] = useState('')
  const [queueLock, setQueueLock] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [inputs, setInputs] = useState({ teamName: '', answer: '' })

  const [loggedIn, setloggedIn] = useState(false)

  const API_BASE_URL = 'https://6b9dfg8pp3.execute-api.eu-west-1.amazonaws.com'
  const getChallengesFromDatabase = () => {
    let addr = API_BASE_URL + '/Hackathon/getChallenge/getChallenges'

    return axios
      .get(addr)
      .then(res => [res.data, res.status])
      .catch(reason => [reason, reason])
  }

  const getTeamInputFromDatabase = (inputId: any) => {
    let addr = API_BASE_URL + '/Hackathon/getInput/inputId' + `/${inputId}`
    setQueueLock(true)
    return axios
      .get(addr)
      .then(res => [res.data, res.status])
      .catch(reason => [reason, reason])
  }
  const getTeamFromDatabase = (teamId: any) => {
    let addr = API_BASE_URL + '/Hackathon/getTeam/teamId' + `/${teamId}`
    setQueueLock(true)
    return axios
      .get(addr)
      .then(res => [res.data, res.status])
      .catch(reason => [reason, reason])
  }
  const updateTeamInDatabase = (
    teamName: any,
    challengeId: any,
    challengeStatus: any
  ) => {
    let addr = API_BASE_URL + '/Hackathon/updateTeam'
    setQueueLock(true)
    let updateData = {
      teamName: teamName,
      challengeId: challengeId,
      challengeStatus: challengeStatus
    }
    return axios
      .post(addr, updateData)
      .then(res => console.log(res))
      .catch(reason => console.log(reason))
  }

  useEffect(() => {}, [JSON.stringify(teamInformation)])

  useEffect(() => {
    if (Object.keys(challengeInfo).length == 0 && currentTeam != '') {
      getChallengesFromDatabase().then(data => {
        const [challengeData, status] = data

        Object.keys(challengeData['Items']).map(key => {
          let getkey = parseInt(challengeData['Items'][key].PK.S) + 1

          getTeamInputFromDatabase(currentTeam + '_' + 'ch' + getkey).then(
            data2 => {
              challengeInfo.set(challengeData['Items'][key].PK.S, [
                challengeData['Items'][key].Description.S,
                data2['0']
              ])

              if (
                !challengeInfoKeys.includes(challengeData['Items'][key].PK.S)
              ) {
                challengeInfoKeys.push(challengeData['Items'][key].PK.S)
              }
              if (
                challengeInfo.size == Object.keys(challengeData['Items']).length
              ) {
                setloggedIn(true)
              }
            }
          )
        })
      })
    }
  }, [JSON.stringify(currentTeam)])

  const onClickChallenge = (id: any) => {
    setCurrentChallenge(id)
    inputs['answer'] = ''
    setInputs(inputs)
  }
  const handleChange = (event: any) => {
    const name = event.target.name
    const value = event.target.value.replace(/[^a-zA-Z0-9-*]/g, '')
    setInputs(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event: any) => {
    setLoadingAnswer(true)
    event.preventDefault()
    let addr =
      API_BASE_URL +
      '/Hackathon/isCorrect/teamId/' +
      `${currentTeam}` +
      '/challengeId/' +
      `${currentChallenge}` +
      '/answer/' +
      +`${inputs.answer.toString()}`
    axios
      .get(addr)
      .then(res => {
        let resp = res.data
        let correctAns = resp == 'False' ? false : true
        if (correctAns) {
          let newInfo = teamInformation.ChallengeStatus.get(
            currentChallenge.toString()
          )
          newInfo.BOOL = true
          teamInformation.ChallengeStatus.set(
            currentChallenge.toString(),
            newInfo
          )
          setTeamInformation(teamInformation)
          setLoadingAnswer(false)

          updateTeamInDatabase(currentTeam, currentChallenge, true)
          const element = window.document.getElementById(
            'span' + currentChallenge
          )
          if (element) {
            element.style.visibility = 'visible'
            alert('Correct!')
          }
        } else {
          setLoadingAnswer(false)

          setInputs({ ...inputs, answer: '' })
          alert('Incorrect, try again!')
        }
      })
      .catch(reason => console.log(reason))
  }

  const getTeamFromDataBaseAndSave = () => {
    setCurrentTeam('LOAD')
    getTeamFromDatabase(inputs.teamName).then(data => {
      const [teamData, status] = data

      if (Object.keys(teamData).length > 0) {
        for (const [key, value] of Object.entries(teamData)) {
          teamInformation.ChallengeStatus.set(key, value)
        }
        setTeamInformation(teamInformation)
        setCurrentTeam(inputs.teamName)
      } else {
        let addr = API_BASE_URL + '/Hackathon/postTeam'
        setQueueLock(true)
        let updateData = {
          teamName: inputs.teamName,
          numberChallenges: 10
        }
        return axios
          .post(addr, updateData)
          .then(res => {
            setQueueLock(false)
            getTeamFromDataBaseAndSave()
          })
          .catch(reason => alert('Could not add team, try again!'))
      }
    })
  }
  if (currentTeam == '') {
    const handleSubmitTeamName = (event: any) => {
      event.preventDefault()
      getTeamFromDataBaseAndSave()
    }

    return (
      <div
        id='ChallengeContainer'
        className='loginContainer'
        style={{
          width: '100vw',
          display: 'flex',
          backgroundImage:
            'linear-gradient(to right bottom, #113875, rgb(255 0 0 / 58%))',
            height:"100vh"
        }}
      >
        <div
          className='paper'
          style={{
            width: 'fit-content',
            height: 'fit-content',
            borderRadius: '50px',
            margin: 'auto',
            display: 'flex',
            background: 'rgb(16 109 190 / 19%)',
            fontFamily: 'monospace'
          }}
        >
          <div className='pattern' style={{ width: '100%' }}>
            <div>
              <form
                style={{
                  margin: 'auto',
                  display: 'inline-grid',
                  marginTop: '10%',
                  marginBottom: '10%',
                  width: '100%'
                }}
                onSubmit={handleSubmitTeamName}
              >
                <label
                  style={{
                    margin: 'auto',
                    width: '60%',
                    borderRadius: '100px',
                    textAlign: 'center',
                    fontSize: 'xx-large',
                    fontFamily: 'monospace'
                  }}
                >
                  Teamname
                </label>
                <br />

                <input
                  required
                  style={{
                    margin: 'auto',

                    width: '60%',
                    borderRadius: '100px',
                    textAlign: 'center',
                    fontSize: 'xx-large'
                  }}
                  id='teamName'
                  pattern='^[a-zA-Z0-9]+$'
                  type='text'
                  name='teamName'
                  value={inputs.teamName || ''}
                  onChange={handleChange}
                />

                <br />

                <br />
                <input
                  className='inputOnHover'
                  style={{
                    margin: 'auto',

                    marginTop: '10px',
                    width: '60%',
                    borderRadius: '100px',
                    textAlign: 'center',
                    fontSize: 'xx-large',
                    background: 'rgb(139, 161, 125)',
                    marginBottom: '10px',
                    fontFamily: 'monospace'
                  }}
                  type='submit'
                  value={'Log in'}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (!loggedIn || currentTeam == 'LOAD') {
    return (
      <div
        className='Container'
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          backgroundImage:
            'linear-gradient(to right bottom, #113875, rgb(255 0 0 / 58%))'
        }}
      >
        <div className='lds-roller'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  } else {
    let keys: any[] = []
    let keys_one: any[] = []
    teamInformation.ChallengeStatus.forEach(function (value, key) {
      let newVal = parseInt(key) + 1
      keys.push(key)
      keys_one.push(newVal)
    })

    // Print the sorted array
    return (
      <>
        <div
          style={{
            backgroundImage:
              'linear-gradient(to right bottom, #113875, rgb(255 0 0 / 58%))',
              overflow:"auto",
              height:"100vh"
          }}
        >
          <div
            className='Container'
            style={{
              width: '100%',
              height: 'fit-content',
              display: 'flex',
              background: 'rgba(16, 109, 190, 0.19)',
            }}
          >
            <div
              className='contentPattern'
              style={{ margin: 'auto', width: '100%', display: 'flex' }}
            >
              <div
                style={{
                  marginLeft: '5%',
                  color: 'black',
                  background: '#8BA17D',
                  display: 'flex',
                  border: '2px solid black',
                  padding: '5px',
                  borderRadius: '50px'
                }}
              >
                <a style={{ margin: 'auto', fontFamily: 'monospace' }}>
                  {' '}
                  {'Team name: ' + currentTeam}{' '}
                </a>
              </div>
              <input
                onClick={() => window.location.reload()}
                className='inputOnHover'
                style={{
                  borderRadius: '100px',
                  textAlign: 'center',
                  margin: 'auto',
                  marginRight: '5%',

                  fontSize: 'xx-large',
                  background: 'rgb(139, 161, 125)',
                  fontFamily: 'monospace'
                }}
                type='submit'
                value={'Log out'}
              />{' '}
            </div>
          </div>

          <div id='Container' className='Container' style={{ height: 'fit-content',width:"100vw",margin:"auto", marginTop:"10vh",position:"relative"}}>
            <div
              className='paper'
              style={{
             
                height: 'fit-content',
                borderRadius: '50px',
                margin:"auto",
                /*top: '40%',
                transform: 'translateY(-40%)',*/
                background: 'rgb(16 109 190 / 19%)',
                padding: '10px',
                paddingLeft:"20px",
                width:"20vw",
                
              
              }}
            >
              <div className='pattern'>
                <div className='contentPattern'>
              
                  {keys.map(key => (
                    <>
                      <a
                        href='#'
                        className='ChallengeTextStyle'
                        onClick={() => onClickChallenge(key)}
                        style={{
                          textDecoration: 'None',
                          fontFamily: 'monospace'
                        }}
                      >
                        {' '}
                        {'Challenge: ' + keys_one[key]}
                      </a>

                      <span
                        id={'span' + key}
                        style={{
                          visibility:
                            teamInformation.ChallengeStatus.get(key).BOOL ==
                            true
                              ? 'visible'
                              : 'hidden',
                          color: 'green',
                          marginLeft: '10px'
                        }}
                      >
                        &#10003;
                      </span>
                      <br />
                    </>
                  ))}
                </div>
              </div>
            </div>{' '}
            <div
              className='paper'
              style={{
                borderRadius: '50px',
                background: 'rgb(16 109 190 / 19%)',
                height: 'fit-content',
              
                padding:"10px",
                width:"60vw",
                margin:"auto",
              }}
            >
  
              <div className='pattern'>
                <div
                  className='contentPattern'
                  style={{ position: 'relative', height: '100%' }}
                >
                  <div
                    style={{
                      marginLeft: '7%',
                      marginRight: '3%',
                      fontFamily: 'monospace'
                    }}
                  >
                    {'Challenge ' + keys_one[currentChallenge]}
                    <br />
                    <br />
                    {challengeInfo.get(currentChallenge.toString())[0]}

                    <br />
                    <br />
                    <a
                      target='_blank'
                      href={challengeInfo.get(currentChallenge.toString())[1]}
                    >
                      Download input file
                    </a>
                  </div>
                  {loadingAnswer ? (                  <div className='lds-roller'>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>):(null)}

                  <div
                    style={{
                      marginTop: '5vh',
                      bottom: '10%',
                      width: '100%'
                    }}
                  >
                    <form onSubmit={handleSubmit}>
                      <label
                        style={{
                          width: '60%',
                          borderRadius: '100px',
                          textAlign: 'center',
                          fontSize: 'xx-large',
                          fontFamily: 'monospace'
                        }}
                      >
                        Answer
                      </label>
                      <br />

                      <input
                        required
                        style={{
                          width: '60%',
                          borderRadius: '100px',
                          textAlign: 'center',
                          fontSize: 'xx-large',
                          fontFamily: 'monospace'
                        }}
                        type='text'
                        name='answer'
                        value={inputs.answer || ''}
                        onChange={handleChange}
                      />
                      <br />
                      <input
                        className='inputOnHover'
                        style={{
                          marginTop: '20px',
                          width: '60%',
                          borderRadius: '100px',
                          textAlign: 'center',
                          fontSize: 'xx-large',
                          background: '#8BA17D',
                          fontFamily: 'monospace'
                        }}
                        type='submit'
                        value={'Submit'}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default App
