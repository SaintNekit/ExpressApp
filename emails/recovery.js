module.exports = function (email, name, token) {
  return {
    "Messages": [
      {
        "From": {
          "Email": process.env.EMAIL,
          "Name": "Saint"
        },
        "To": [
          {
            "Email": `${email}`,
            "Name": `${name}`
          }
        ],
        "Subject": "Password recovery",
        "TextPart": "Password recovery",
        "HTMLPart": `
          <h3>This is password recovery email. If you request it - press the link to recover password or ignore message</h3>
          <br/>
          <a href="${process.env.BASE_URL}/auth/password/${token}">Link to recover password</a>
          <hr/>
          Best regards <a href='${process.env.BASE_URL}'>Saint shop</a>
          <br/>
          <br/>
          May the delivery force be with you!
        `,
        "CustomID": "AppGettingStartedTest"
      }
    ]
  }
}
