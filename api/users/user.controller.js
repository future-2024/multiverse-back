const { hashSync, genSaltSync, compareSync } = require("bcrypt")
const { sign } = require("jsonwebtoken")
const pool = require("../../config/database")

const {
    getUserByUserEmail,
    getUsers,
    forgot,
    reset,
    contactus,
    getuserdetails,
    subscribe,
    getSubscribeByEmail,
    getPincode,
    getnotifications,
} = require("./user.service")

module.exports = {
    login: (req, res) => {
        const body = req.body

        getUserByUserEmail(body.email, (err, results) => {
            if (err) {
                console.log(err)
            }
            if (!results) {
                return res.json({
                    success: 0,
                    data: "Invalid email or password",
                })
            }

            const result = compareSync(body.password, results.password)
            if (result) {
                results.password = undefined
                const jsontoken = sign(
                    { result: results },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: "12h",
                    }
                )
                return res.json({
                    success: 1,
                    message: "login successfully",
                    token: jsontoken,
                    user: results,
                })
            } else {
                return res.json({
                    success: 0,
                    data: "Invalid email or password",
                })
            }
        })
    },
    Subscribe: (req, res) => {
        const body = req.body

        subscribe(body, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror",
                })
            }
            return res.status(200).json({
                success: 1,
                data: "Subscription done",
            })
        })
    },
    Checkemail: (req, res) => {
        const body = req.body

        getUserByUserEmail(body.email, (err, results) => {
            if (err) {
                console.log(err)
            }
            if (results) {
                return res.json({
                    success: 1,
                    data: "Email exist",
                })
            } else {
                return res.json({
                    success: 0,
                    data: "Email available",
                })
            }
        })
    },
    Checkpincode: (req, res) => {
        const body = req.body

        getPincode(body.pincode, (err, results) => {
            if (err) {
                console.log(err)
            }
            if (results) {
                return res.json({
                    success: 1,
                    data: results,
                })
            } else {
                return res.json({
                    success: 0,
                    data: "Pincode not available",
                })
            }
        })
    },

    Checksubscribe: (req, res) => {
        const body = req.body

        getSubscribeByEmail(body.email, (err, results) => {
            if (err) {
                console.log(err)
            }
            if (results) {
                return res.json({
                    success: 1,
                    data: "Email exist",
                })
            } else {
                return res.json({
                    success: 0,
                    data: "Email available",
                })
            }
        })
    },
    Contactus: (req, res) => {
        const body = req.body

        contactus(body, (err, results) => {
            if (err) {
                console.log(err)
            }
            if (results) {
                return res.json({
                    success: 1,
                    data: "Email sent",
                })
            } else {
                return
            }
        })
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                console.log(err)
                return
            }
            return res.json({
                success: 1,
                data: results,
            })
        })
    },
    getUserDetails: (req, res) => {
        const id = req.params.id
        const user = req.decoded.result

        getuserdetails(id, (err, results) => {
            if (err) {
                console.log(err)
                return
            }
            return res.json({
                success: 1,
                data: results,
            })
        })
    },
    Forgot: (req, res) => {
        const body = req.body

        forgot({ body, req }, (err, results) => {
            if (err) {
                console.log(err)
                return res.send({
                    success: 0,
                    message: err,
                })
            } else {
                return res.json({
                    success: 1,
                    message: "updated successfully",
                })
            }
        })
    },
    ResetPassword: (req, res) => {
        const body = req.body

        reset({ body, req }, (err, results) => {
            if (err) {
                console.log(err)
                return res.send({
                    success: 0,
                    message: err,
                })
            } else {
                return res.json({
                    success: 1,
                    message: "updated successfully",
                })
            }
        })
    },
        googleLogin: (req, res) => {
        const { email, given_name, family_name } = req.body

        getUserByUserEmail(email, (err1, result1) => {
            if (err1) {
                return res.json({
                    success: false,
                    data: "user not Found",
                })
            } else {
                //console.log("asdsd", result1);
                if (result1) {
                    const jsontoken = sign(
                        { result: result1 },
                        process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: "12h",
                        }
                    )
                    return res.json({
                        success: 1,
                        user: result1,
                        message: "login successfully",
                        token: jsontoken,
                    })
                } else {
                    console.log(err1)
                    return res.json({
                        success: 0,
                        data: "user not logged in by google",
                    })
                }
            }
        })
    },
    
    getNotifications: (req, res) => {
        getnotifications(req,(err, results) => {
            if (err) {
                console.log(err)
                return
            }
            return res.json({
                success: 1,
                data: results,
            })
        })
    }
}
