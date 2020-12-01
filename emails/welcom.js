module.exports = function (email, name) {
  return {
    "Messages": [
      {
        "From": {
          "Email": "stepanovn2706@gmail.com",
          "Name": "Saint"
        },
        "To": [
          {
            "Email": `${email}`,
            "Name": `${name}`
          }
        ],
        "Subject": "Greetings from Saint shop.",
        "TextPart": "Account was registered",
        "HTMLPart": `<h3>Dear passenger 1, welcome to <a href='${process.env.BASE_URL}'>Saint shop</a>!</h3><br/> Your account ${email} was successfuly registered<br/><br/>May the delivery force be with you!`,
        "CustomID": "AppGettingStartedTest"
      }
    ]
  }
}
