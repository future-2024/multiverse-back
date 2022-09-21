const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const pool = require("../../config/database");
const { emailSendto } = require("../email/email.controller");

const {
  subscribe,
  forecast,
  mtd,
  ingredients,
  createeo,
  eolist,
  updateeo,
  categorylist,
  updateeostore,
  geteoorder,
  createwastage,
  wastagelist,
  updatews,
  createticket,
  issuescategory,
  issueslist,
  updateissue,
  importcomplaints,
  complaintlist,
  complaintdetails,
  updatecomplaint,
  updaterca,
} = require("./eowl.service");

module.exports = {
  Subscribe: (req, res) => {
    const body = req.body;

    subscribe(body, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Subscription done",
      });
    });
  },
  Forecast: (req, res) => {
    const body = req.body;

    forecast(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  Mtd: (req, res) => {
    const body = req.body;

    mtd(body, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  Ingredients: (req, res) => {
    const body = req.body;

    ingredients(body, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  IssuesCategory: (req, res) => {
    const body = req.body;

    issuescategory(body, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  Createeo: (req, res) => {
    const body = req.body;
    //console.log(body)
    createeo(body, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "EO Done",
      });
    });
  },
  Createticket: (req, res) => {
    const body = req.body;
    //console.log(body)
    createticket(body, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Ticket Created",
      });
    });
  },
  Createwastage: (req, res) => {
    const body = req.body;
    //console.log(body)
    createwastage(body, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Wastage Done",
      });
    });
  },
  importComplaints: (req, res) => {
    const body = req.body;

    importcomplaints(body, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Records Imported",
      });
    });
  },
  EO_list: (req, res) => {
    eolist(req, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  Complaintlist: (req, res) => {
    complaintlist(req, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  Complaintdetails: (req, res) => {
    complaintdetails(req, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  Wastage_list: (req, res) => {
    const body = req.body;

    wastagelist(body, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  Issues_list: (req, res) => {
    const body = req.body;

    issueslist(body, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  Categorylist: (req, res) => {
    const body = req.body;

    categorylist(body, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  Updateeo: (req, res) => {
    updateeo(req, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Order Processed",
      });
    });
  },

  Updatecomplaint: (req, res) => {
    updatecomplaint(req, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Complaint Updated",
      });
    });
  },

  Updaterca: (req, res) => {
    updaterca(req, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Rca Updated",
      });
    });
  },
  Updatews: (req, res) => {
    updatews(req, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Order Processed",
      });
    });
  },

  Updateissue: (req, res) => {
    updateissue(req, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Issue updated",
      });
    });
  },
  Saleshook: (req, res) => {
    //console.log("hello");
    const body = req.body;

    return res.status(200).json({
      success: 1,
      data: body,
    });
  },
  Updateeostore: (req, res) => {
    updateeostore(req, (err, results) => {
      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "Order Updated",
      });
    });
  },
  Geteoorder: (req, res) => {
    //console.log(req.query)
    geteoorder(req.query, (err, results) => {
      //console.log("results",results)
      // console.log("res",res.status)

      if (err) {
        //console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
};
