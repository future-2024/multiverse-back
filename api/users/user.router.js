const router = require("express").Router()
const {
    login,
    getUsers,
    Forgot,
    ResetPassword,
    getUserDetails,
    Checkemail,
    Contactus,
    googleLogin,
    Subscribe,
    Checksubscribe,
    Checkpincode,
    getNotifications,
} = require("./user.controller")
router.post("/login", login)
router.post("/google-login", googleLogin)
router.post("/forgot", Forgot)
router.post("/checkemail", Checkemail)
router.post("/checksubscribe", Checksubscribe)
router.post("/checkpincode", Checkpincode)
router.post("/contactus", Contactus)
router.post("/reset", ResetPassword)
router.post("/subscribe", Subscribe)
const { checkToken } = require("../../auth/token_validation")

router.post("/", checkToken, getUsers)
router.post("/notifications", checkToken, getNotifications)
router.post("/:id", checkToken, getUserDetails)

module.exports = router
