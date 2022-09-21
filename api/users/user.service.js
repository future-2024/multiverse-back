const pool = require("../../config/database")
var randtoken = require("rand-token")
const express = require("express")
const { hash } = require("bcrypt")
const {
    emailSend,
    emailSendto,
    emailSendtospecific,
} = require("../email/email.controller")
const app = express()

module.exports = {
    getUserByUserEmail: (email, callBack) => {
        pool.query(
            `select * from users where email = ?`,
            [email],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }

                return callBack(null, results[0])
            }
        )
    },
    getSubscribeByEmail: (email, callBack) => {
        pool.query(
            `select * from subscribe where email = ?`,
            [email],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }

                return callBack(null, results[0])
            }
        )
    },
    getPincode: (pincode, callBack) => {
        pool.query(
            `select * from pincodes where pin_code = ?`,
            [pincode],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }

                return callBack(null, results[0])
            }
        )
    },
    getuserdetails: (id, callBack) => {
        pool.query(
            `select firstName,email,lastName,address,mobile,level from users where id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    subscribe: (data, callBack) => {
        pool.query(
            `insert into subscribe(email) 
                values(?)`,
            [data.email],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    getUsers: (callBack) => {
        pool.query(
            `select * from users where level='consumer'`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    getnotifications: (data,callBack) => {
          body=data.body

          console.log(body)
        
        if(body.store_name=="" || body.store_name==undefined )
  {
query=`select * from notifications where readstatus=0  order by id desc`

  }
  else{
    query=`select * from notifications where  readstatus='0' and store_name=? order by id desc`
  }

  
        pool.query(
            query,
            [body.store_name],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    contactus: (body, callBack) => {
        let userDetails = []

        let html =
            "<p>Hi admin,</p><p>Here is the query from user on flax.fit</p><p><br/>Name:[name]<br />Email:[email]<br />Phone:[phone]<br />City:[pincode]<br />Pin Code:[city]<br />Query: [message]</p>"

        html = html.replace("[email]", body.email)
        html = html.replace("[name]", body.name)
        html = html.replace("[city]", body.city)
        html = html.replace("[phone]", body.phone)
        html = html.replace("[pincode]", body.pincode)
        html = html.replace("[message]", body.message)
        userDetails.subject = "Query on flax.fit"
        userDetails.text = "Query on flax.fit"
        userDetails.to = "barora@flaxfoods.in"
        userDetails.cc = "nutrition@flaxfoods.in,jatindermashall@gmail.com"
        userDetails.html = html
        emailSendtospecific(userDetails, callBack)
    },

    forgot: ({ body, req }, callBack) => {
        var token = randtoken.generate(16)

        pool.query(
            `update users set token=? where email = ? or mobile=? `,
            [token, body.email, body.email],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }
                let html =
                    "<p>Hi [name],</p><p>There was a request to change your password!</p><p>If you did not make this request then please ignore this email.</p><p>Otherwise, please click this link to change your password: <a href='[link]'>Click Here</a></p>"
                html = html.replace("[name]", body.email)
                html = html.replace(
                    "[link]",
                    `https://flax.fit/recover?token=` + token
                )
                emailSend(
                    {
                        email: body.email,
                        html: html,
                    },
                    callBack
                )
            }
        )
    },

    reset: ({ body, req }, callBack) => {
        //console.log(body);
        pool.query(
            `select * from users where token = ?`,
            [body.token],
            async (error, userdetails, fields) => {
               
                if (error) {
                    //console.log(error);
                    //console.log(userdetails);
                    callBack(error)
                } else {
                    if (userdetails.length == 0) {
                        callBack("invalid token")
                    } else {
                        let hashPass = await hash(body.password, 10)
                        pool.query(
                            `update users set password=? where token = ? `,
                            [hashPass, body.token],
                            (error, results, fields) => {
                                if (error) {
                                    callBack(error)
                                } else {
                                    pool.query(
                                        `update users set token=? where token = ? `,
                                        [null, body.token],
                                        (error, results, fields) => {
                                            return callBack(null, "success")
                                        }
                                    )
                                }
                            }
                        )
                    }
                }
            }
        )
    },
}
