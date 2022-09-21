const router = require("express").Router();
const {
  Subscribe,
  Forecast,
  Mtd,
  Ingredients,
  Createeo,
  EO_list,
  Updateeo,
  Updateeostore,
  Categorylist,
  Geteoorder,
  Createwastage,
  Wastage_list,
  Updatews,
  Createticket,
  IssuesCategory,
  Issues_list,
  Updateissue,
  Saleshook,
  importComplaints,
  Complaintlist,
  Complaintdetails,
  Updatecomplaint,
  Updaterca,
} = require("./eowl.controller");
router.post("/forecast", Forecast);
router.post("/mtd", Mtd);
router.post("/ingredients", Ingredients);
router.get("/issuescategory", IssuesCategory);
router.post("/createeo", Createeo);

router.post("/createwastage", Createwastage);
router.post("/wastagelist", Wastage_list);
router.post("/createticket", Createticket);
router.post("/issueslist", Issues_list);

router.post("/categorylist", Categorylist);
router.get("/geteoorder", Geteoorder);
router.post("/saleshook", Saleshook);

const { checkToken } = require("../../auth/token_validation");
router.post("/importcomplaints", checkToken, importComplaints);
router.post("/updateissue", checkToken, Updateissue);
router.post("/eolist", checkToken, EO_list);
router.post("/complaintlist", checkToken, Complaintlist);
router.post("/updateeo", checkToken, Updateeo);
router.get("/complaintdetails/:id", checkToken, Complaintdetails);
router.post("/updaterca", checkToken, Updaterca);
router.post("/updatecomplaint", checkToken, Updatecomplaint);
router.post("/updatews", checkToken, Updatews);
router.post("/updateeostore", checkToken, Updateeostore);

router.post("/subscribe", checkToken, Subscribe);

module.exports = router;
