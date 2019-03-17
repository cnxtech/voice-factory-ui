require('dotenv').config()
const AWS = require('aws-sdk')

const headers = {
  "Access-Control-Allow-Origin" : "*",
  "Access-Control-Allow-Headers": "Content-Type"
}

let statusCode = 200
const key = process.env.KEY_AWS
const secret = process.env.SECRET_AWS

AWS.config.region = 'us-east-1'
AWS.config.credentials = new AWS.Credentials(key, secret)
const polly = new AWS.Polly({apiVersion: '2016-06-10'})

exports.handler = function(event, context, callback) {

    let speechParams = {
      OutputFormat: "mp3",
      SampleRate: "16000",
      TextType: "ssml",
      Text: "hello it is great to meet you",
      VoiceId: "Matthew"
    }

    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body)
      speechParams.Text = payload.text
      const signer = new AWS.Polly.Presigner(speechParams, polly)
      signer.getSynthesizeSpeechUrl(speechParams, (error, url) => {
        console.log(error, url)
        if (error) {
          statusCode = 400
          callback(null, {
            statusCode,
            headers,
            body: JSON.stringify({ error })
          })
        } else {
          statusCode = 200
          callback(null, {
            statusCode,
            headers,
            body: JSON.stringify({ url })
          })
        }
      })
    } else if (event.httpMethod !== 'POST'){
      statusCode = 400
      callback(null, {
        statusCode,
        headers,
        body: JSON.stringify({ error: 'Http Request other than Post not allowed' })
      })
    }
}
