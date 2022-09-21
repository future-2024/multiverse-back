const pool = require("../../config/database");
var randtoken = require("rand-token");
const { uploadpdf } = require("../file/file.controller");
const express = require("express");
const axios = require("axios");

const app = express();

module.exports = {
  subscribe: (data, callBack) => {
    pool.query(
      `insert into subscribe(email) 
                values(?)`,
      [data.email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  forecast: async (body, callBack) => {
    pool.query(
      `select title,Ingredient,Qty,Unit  from recipes where Ingredient!=""`,
      [],
      (error, recipes, fields) => {
        const EOWL_URL = `${process.env.EAGLEOWL_API_URL}/api/v1`;
        const TOKEN_EAGLEWOL = `${process.env.EAGLEOWL_API_TOKEN}`;
        //console.log(TOKEN_EAGLEWOL)
        let storeid = body.storeid;
        //console.log("storeid",storeid)
        let axiosConfig = {
          headers: {
            Authorization: `Bearer ${TOKEN_EAGLEWOL}`,
            Accept: "application/json",
          },
        };

        const previousday = new Date(Date.now() - 86400000 * 7);
        let yyyy2 = previousday.getFullYear();
        let mm2 = previousday.getMonth() + 1; // Months start at 0!
        let dd2 = previousday.getDate();

        if (dd2 < 10) dd2 = dd2;
        if (mm2 < 10) mm2 = mm2;
        const from_date1 = String(yyyy2 + "-" + mm2 + "-" + dd2);
        const to_date1 = String(yyyy2 + "-" + mm2 + "-" + dd2);

        const previous2day = new Date(Date.now() - 86400000 * 14);
        yyyy2 = previous2day.getFullYear();
        mm2 = previous2day.getMonth() + 1; // Months start at 0!
        dd2 = previous2day.getDate();

        if (dd2 < 10) dd2 = dd2;
        if (mm2 < 10) mm2 = mm2;
        const from_date2 = String(yyyy2 + "-" + mm2 + "-" + dd2);
        const to_date2 = String(yyyy2 + "-" + mm2 + "-" + dd2);

        const previous3day = new Date(Date.now() - 86400000 * 21);
        yyyy2 = previous3day.getFullYear();
        mm2 = previous3day.getMonth() + 1; // Months start at 0!
        dd2 = previous3day.getDate();

        if (dd2 < 10) dd2 = dd2;
        if (mm2 < 10) mm2 = mm2;
        const from_date3 = String(yyyy2 + "-" + mm2 + "-" + dd2);
        const to_date3 = String(yyyy2 + "-" + mm2 + "-" + dd2);

        var url1 = axios
          .get(
            `${EOWL_URL}/outlet/${storeid}/sales/items?from_date=${from_date1}&to_date=${to_date1}`,
            axiosConfig
          )
          .then(function (response) {
            return response.data;
          });
        var url2 = axios
          .get(
            `${EOWL_URL}/outlet/${storeid}/sales/items?from_date=${from_date2}&to_date=${to_date2}`,
            axiosConfig
          )
          .then(function (response) {
            return response.data;
          });
        var url3 = axios
          .get(
            `${EOWL_URL}/outlet/${storeid}/sales/items?from_date=${from_date3}&to_date=${to_date3}`,
            axiosConfig
          )
          .then(function (response) {
            return response.data;
          });
        let material = [];
        let totalmaterial = [];
        let dishessale = [];

        Promise.all([url1, url2, url3])
          .then(function (values) {
            let data1 = values[0].data;
            let data2 = values[1].data;
            let data3 = values[2].data;
            //console.log(data1)
            material = data1.map((item) => {
              return { name: item.name, units: item.units };
            });
            data2.map((item) => {
              //console.log("item name",item.name,",item units",item.units)
              let foundIndex = material.findIndex((x) => x.name == item.name);

              if (foundIndex == -1) {
                material.push({ name: item.name, units: item.units });
              } else {
                //console.log("found index",foundIndex,",item name",item.name,",item units",item.units)
                //if(item.units!=undefined) item.units=0
                let newunits = material[foundIndex].units + item.units;
                //console.log("new units",newunits)
                material[foundIndex] = { name: item.name, units: newunits };
              }
            });

            data3.map((item) => {
              let foundIndex = material.findIndex((x) => x.name == item.name);
              //console.log("data3")

              if (foundIndex == -1) {
                material.push({ name: item.name, units: item.units });
              } else {
                //console.log("found index",foundIndex,",item name",item.name,",item units",item.units)
                let newunits = material[foundIndex].units + item.units;
                material[foundIndex] = { name: item.name, units: newunits };
              }
            });

            material.map((item) => {
              let ingredients = recipes.filter((s) => {
                if (s.title == item.name) {
                  let foundIndex = totalmaterial.findIndex(
                    (x) => x.name == s.Ingredient
                  );
                  if (foundIndex == -1) {
                    let Qty = parseInt((s.Qty * item.units) / 3);
                    totalmaterial.push({
                      name: s.Ingredient,
                      Qty: Qty,
                      unit: s.Unit,
                    });
                  } else {
                    let newqty = parseInt(
                      totalmaterial[foundIndex].Qty + (s.Qty * item.units) / 3
                    );
                    totalmaterial[foundIndex] = {
                      name: s.Ingredient,
                      Qty: newqty,
                      unit: s.Unit,
                    };
                  }
                }
              });

              //console.log("ingredients",totalmaterial)
            });

            callBack(null, totalmaterial);
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    );
  },
  mtd: (body, callBack) => {
    const EOWL_URL = `${process.env.EAGLEOWL_API_URL}/api/v1`;
    const TOKEN_EAGLEWOL = `${process.env.EAGLEOWL_API_TOKEN}`;
    //console.log(TOKEN_EAGLEWOL)

    // console.log("body",body)
    let storeid = body.storeid;
    let storename = body.storename;
    //console.log("storeid",storename)
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${TOKEN_EAGLEWOL}`,
        Accept: "application/json",
      },
    };

    const previousday = new Date(Date.now());
    let yyyy2 = previousday.getFullYear();
    let mm2 = previousday.getMonth() + 1; // Months start at 0!

    if (mm2 < 10) mm2 = mm2;
    const monthstartdate = String(yyyy2 + "-" + mm2 + "-" + "01");

    const previous2day = new Date(Date.now() - 86400000 * 1);
    yyyy2 = previous2day.getFullYear();
    mm2 = previous2day.getMonth() + 1; // Months start at 0!
    let dd2 = previous2day.getDate();

    if (dd2 < 10) dd2 = dd2;
    if (mm2 < 10) mm2 = mm2;
    const todaysdate = String(yyyy2 + "-" + mm2 + "-" + dd2);

    var url1 = axios
      .get(
        `${EOWL_URL}/outlet/${storeid}/sales/items?from_date=${monthstartdate}&to_date=${todaysdate}`,
        axiosConfig
      )
      .then(function (response) {
        return response.data;
      });
    var url2 = axios
      .get(
        `${EOWL_URL}/outlet/${storeid}/variance?from_date=${monthstartdate}&to_date=${todaysdate}&type=sku`,
        axiosConfig
      )
      .then(function (response) {
        return response.data;
      });
    var url3 = axios
      .get(
        `${EOWL_URL}/outlet/479/issue?from_date=${monthstartdate}&to_date=${todaysdate}&type=sku`,
        axiosConfig
      )
      .then(function (response) {
        return response.data;
      });

    Promise.all([url1, url2, url3])
      .then(function (values) {
        //console.log(values.flat())
        //callBack(null, values)
        //return ""
        let monthdata = [];
        let returndata = values;
        if (returndata.length > 0) {
          monthdata.sale = returndata[0]?.data.reduce(
            (pre, curr) => pre + curr.total_sales,
            0
          );

          monthdata.sale = parseFloat(monthdata.sale.toFixed(2));
          monthdata.wastage = returndata[1]?.data.reduce((pre, curr) => {
            return pre + curr.wastage;
          }, 0);
          monthdata.wastage = parseFloat(monthdata.wastage.toFixed(2));

          monthdata.closing_stock = returndata[1]?.data.reduce(
            (pre, curr) => pre + curr.closing_stock,
            0
          );
          monthdata.closing_stock = parseFloat(
            monthdata.closing_stock.toFixed(2)
          );
          monthdata.issue = returndata[2]?.data.reduce((pre, curr) => {
            //console.log("storename-", storename, curr["To"])
            if (storename == curr["To"]) {
              return pre + curr["Total Price"];
            } else {
              return pre;
            }
          }, 0);
          monthdata.issue = parseFloat(monthdata.issue.toFixed(2));

          console.log("monthdata", monthdata);

          callBack(null, monthdata);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  },
  ingredients: (data, callBack) => {
    pool.query(
      `select costpergram,oquantity,id,title as value, title as label,unit,cost from ingredients where category like CONCAT('%', ?,  '%')`,
      [data.category],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  issuescategory: (data, callBack) => {
    pool.query(
      `select * from issues_category `,
      [data.category],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  categorylist: (data, callBack) => {
    pool.query(
      `select title as value, title as label from ingredients_categories `,
      [data.category],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  createeo: (data, callBack) => {
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();

    let hours = date_ob.getHours();

    let minutes = date_ob.getMinutes();

    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    let date1 =
      date +
      "-" +
      month +
      "-" +
      year +
      " " +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    // prints time in HH:MM format

    pool.query(
      `insert into emergency_order(item,quantity,units,sale,store_name,comments,raised_by,request_date,status,cartitems,totalcost,ponumber) 
          values(?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.ingredients_info,
        data.quantity,
        data.units,
        data.sale,
        data.store_name,
        data.comments,
        data.raisedby,
        date1,
        "PENDING",
        data.cartitems,
        data.tcost,
        data.ponumber,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  createwastage: (data, callBack) => {
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();

    let hours = date_ob.getHours();

    let minutes = date_ob.getMinutes();

    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    let date1 =
      date +
      "-" +
      month +
      "-" +
      year +
      " " +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    // prints time in HH:MM format
    //console.log(date1)

    pool.query(
      `insert into wastage(foh,boh,store_name,comments,raised_by,request_date,cartitems,totalcost) 
          values(?,?,?,?,?,?,?,?)`,
      [
        data.foh,
        data.boh,
        data.store_name,
        data.comments,
        data.raisedby,
        date1,
        data.cartitems,
        data.tcost,
      ],
      (error, results, fields) => {
        console.log(error);
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  createticket: (data, callBack) => {
    //console.log("ticket submit data",data)
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();

    let hours = date_ob.getHours();

    let minutes = date_ob.getMinutes();

    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    let date1 =
      date +
      "-" +
      month +
      "-" +
      year +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    // prints time in HH:MM format
    //console.log(date1)

    pool.query(
      `insert into issues(store_name,title,details,category,outlet_manager,other_comment,issue_image,priority,status,creation_date) 
          values(?,?,?,?,?,?,?,?,?,?)`,
      [
        data.store_name,
        data.title,
        data.details,
        data.category,
        data.outlet_manager,
        data.other_comments,
        data.issue_image,
        data.priority,
        "PENDING",
        date1,
      ],
      (error, results, fields) => {
        console.log(error);
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  importcomplaints: (data, callBack) => {
    let complaintsarray = JSON.parse(data.complaints);
    //console.log("mycomplaints",complaintsarray)
    let complaints = [];

    complaints = complaintsarray.map((item, itemkey) => {
      let dateis = item[4].split("T");
      item[4] = dateis[0];
      item[8] = "";
      item[9] = "";
      item[10] = "";
      item[11] = "";
      item[12] = "";

      if (item[13]) {
        delete item[13];
      }
      if (item[14]) {
        delete item[14];
      }
      if (item[15]) {
        delete item[15];
      }

      return item;

      //console.log("myitem",item)
    });

    complaints = complaints.slice(1);

    //console.log(complaints);
    //return ""

    pool.query(
      `insert into complaints(orderid,portal,outlet_name,restaurant_id,cdate,impacted_items,customer_comments,category,foh,boh,timing,remarks,action_plan) 
      values ?`,
      [complaints],
      (error, results, fields) => {
        console.log(error);
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );

    return "";
  },
  eolist: (req, callBack) => {
    let data = req.body;
    let user = req.decoded.result;

    let query = "";
    if (data.store_name == "" || data.store_name == undefined) {
      query = `select * from emergency_order where  status!='REJECTED' and status!='PENDING' order by id desc`;
    } else {
      query = `select * from emergency_order where store_name=?  order by id desc`;
    }

    if (user.level == "areamanager") {
      query = `select * from emergency_order  order by id desc`;
    }
    pool.query(query, [data.store_name], (error, results, fields) => {
      //console.log(results)
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },

  complaintlist: (req, callBack) => {
    let data = req.body;
    let user = req.decoded.result;

    let fieldarray = [];

    let query = "";
    if (data.outlet == "" || data.outlet == undefined) {
      if (data.criticals.length == 3) {
        query = `select * from complaints  where (cdate  BETWEEN (?) and (?)) and CONCAT('%', ?,  '%')) and status  LIKE CONCAT('%', ?,  '%') and portal  LIKE CONCAT('%', ?,  '%') and outlet_name LIKE CONCAT('%', ?,  '%') and category  LIKE CONCAT('%', ?,  '%') and category  IN (?) order by id desc`;
        fieldarray = [
          data.date1,
          data.date2,
          data.status,
          data.portal,
          data.outlet,
          data.category,
          data.criticals,
        ];
      } else {
        query = `select * from complaints  where (cdate  BETWEEN (?) and (?)) and status  LIKE CONCAT('%', ?,  '%') and portal  LIKE CONCAT('%', ?,  '%') and outlet_name LIKE CONCAT('%', ?,  '%') and category  LIKE CONCAT('%', ?,  '%')  order by id desc`;
        fieldarray = [
          data.date1,
          data.date2,
          data.status,
          data.portal,
          data.outlet,
          data.category,
        ];
      }
    } else {
      if (data.criticals.length == 3) {
        query = `select * from complaints  where  (cdate  BETWEEN (?) and (?)) and status  LIKE CONCAT('%', ?,  '%') and portal  LIKE CONCAT('%', ?,  '%') and outlet_name LIKE CONCAT('%', ?,  '%') and category  LIKE CONCAT('%', ?,  '%') and category  IN (?) order by id desc`;
        fieldarray = [
          data.date1,
          data.date2,
          data.status,
          data.portal,
          data.outlet,
          data.category,
          data.criticals,
        ];
      } else {
        query = `select * from complaints  where (cdate  BETWEEN (?) and (?)) and status  LIKE CONCAT('%', ?,  '%') and portal  LIKE CONCAT('%', ?,  '%') and outlet_name LIKE CONCAT('%', ?,  '%') and category  LIKE CONCAT('%', ?,  '%')  order by id desc`;
        fieldarray = [
          data.date1,
          data.date2,
          data.status,
          data.portal,
          data.outlet,
          data.category,
        ];
      }
    }

    if (user.level == "areamanager") {
      query = `select * from complaints  where (cdate  BETWEEN (?) and (?)) and  status  LIKE CONCAT('%', ?,  '%') and portal  LIKE CONCAT('%', ?,  '%') and outlet_name LIKE CONCAT('%', ?,  '%') and category  LIKE CONCAT('%', ?,  '%') and category  IN (?) order by id desc`;
      fieldarray = [
        data.date1,
        data.date2,
        data.status,
        data.portal,
        data.outlet,
        data.category,
        data.criticals,
      ];
    }

    if (user.level == "admin") {
      if (data.criticals.length == 3) {
        query = `select * from complaints  where (cdate  BETWEEN (?) and (?)) and  status  LIKE CONCAT('%', ?,  '%') and portal  LIKE CONCAT('%', ?,  '%') and outlet_name LIKE CONCAT('%', ?,  '%') and category  LIKE CONCAT('%', ?,  '%') and category  IN (?) order by id desc`;
        fieldarray = [
          data.date1,
          data.date2,
          data.status,
          data.portal,
          data.outlet,
          data.category,
          data.criticals,
        ];
      } else {
        query = `select * from complaints  where (cdate  BETWEEN (?) and (?)) and  status  LIKE CONCAT('%', ?,  '%') and portal  LIKE CONCAT('%', ?,  '%') and outlet_name LIKE CONCAT('%', ?,  '%') and category  LIKE CONCAT('%', ?,  '%')  order by id desc`;
        fieldarray = [
          data.date1,
          data.date2,
          data.status,
          data.portal,
          data.outlet,
          data.category,
        ];
      }
    }

    pool.query(query, fieldarray, (error, results, fields) => {
      //console.log(results)
      if (error) {
        callBack(error);
      }

      return callBack(null, results);
    });
  },
  wastagelist: (data, callBack) => {
    let query = "";
    if (data.store_name == "" || data.store_name == undefined) {
      query = `select * from wastage   order by id desc`;
    } else {
      query = `select * from wastage where store_name=?  order by id desc`;
    }

    //console.log("query",query)
    pool.query(query, [data.store_name], (error, results, fields) => {
      //console.log(results)
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },

  issueslist: (data, callBack) => {
    let query = "";
    if (data.store_name == "" || data.store_name == undefined) {
      query = `select * from issues   order by id desc`;
    } else {
      query = `select * from issues where store_name=?  order by id desc`;
    }

    //console.log("query",query)
    pool.query(query, [data.store_name], (error, results, fields) => {
      //console.log(results)
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },
  updateeo: (data, callBack) => {
    const body = data.body;
    const user = data.decoded.result;

    pool.query(
      `update emergency_order set status=?,rejected_comments=?,totalcost=?,deliverycost=? where id=?`,
      [
        body.status,
        body.rejected_comments,
        body.tcost,
        body.deliverycost,
        body.id,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        const today = new Date(Date.now());
        let yyyy2 = today.getFullYear();
        let mm2 = today.getMonth() + 1; // Months start at 0!
        let dd2 = today.getDate();

        if (dd2 < 10) dd2 = dd2;
        if (mm2 < 10) mm2 = mm2;
        const today_date = String(yyyy2 + "-" + mm2 + "-" + dd2);
        body.status = body.status.replace(/["']/g, "");
        pool.query(
          `insert into notifications(message,readstatus,datentime,store_name,url) values("Your order is ?",'0',?,?,?)`,
          [body.status, today_date, body.store_name, "/eo-list"],
          (error2, results2, fields2) => {
            //console.log(results2)
          }
        );
        return callBack(null, results);
      }
    );
  },

  updatecomplaint: (data, callBack) => {
    const body = data.body;
    const user = data.decoded.result;

    let query = "";
    let valuearay = [];

    (query = `update complaints set foh=?,boh=?,timing=?,remarks=?,status=? where id=?`),
      (valuearay = [
        body.foh,
        body.boh,
        body.datetime1,
        body.remarks,
        body.status,
        body.id,
      ]);
    if (user.level == "admin") {
      (query = `update complaints set action_plan=?,status=? where id=?`),
        (valuearay = [body.actionplan, "CLOSED", body.id]);
    }
    console.log(query);
    console.log(valuearay);
    pool.query(query, valuearay, (error, results, fields) => {
      if (error) {
        callBack(error);
      }

      return callBack(null, results);
    });
  },
  updaterca: (data, callBack) => {
    const body = data.body;
    const rca_data = JSON.stringify(body);
    const user = data.decoded.result;
    const singleUploadpdf = uploadpdf.single("pdf");

    var html_to_pdf = require("html-pdf-node");

    let options = { format: "A4" };
    // Example of options with args //
    // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

    let file = { content: "<h1>Welcome to html-pdf-node</h1>" };

    html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
      console.log("PDF Buffer:-", pdfBuffer);
      data.file = pdfBuffer;

      singleUploadpdf(data, res, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          return res.status(200).json({
            success: 1,
            data: {
              files: {
                location: req.file.location,
              },
            },
          });
        }
      });
    });
    let query = "";
    let valuearay = [];
    if (user.level == "admin") {
      (query = `update complaints set rca_data=? where id=?`),
        (valuearay = [rca_data, body.id]);
    }
    console.log(query);
    pool.query(query, valuearay, (error, results, fields) => {
      if (error) {
        callBack(error);
      }

      return callBack(null, results);
    });
  },
  updatews: (data, callBack) => {
    const body = data.body;
    const user = data.decoded.result;

    console.log(user);

    pool.query(
      `update wastage set status=? where id=?`,
      [body.status, body.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }

        return callBack(null, results);
      }
    );
  },
  updateissue: (data, callBack) => {
    const body = data.body;
    const user = data.decoded.result;

    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();

    let hours = date_ob.getHours();

    let minutes = date_ob.getMinutes();

    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    let date1 =
      date +
      "-" +
      month +
      "-" +
      year +
      " " +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    if (user.level == "areamanager" || user.level == "admin") {
      let query = "";
      let updatearray = [];
      if (user.level == "areamanager") {
        query =
          "update issues set status=?,solution=?,solution_date=?,solution_image=? where id=?";
        updatearray = [
          body.status,
          body.solution,
          date1,
          body.imagesolution,
          body.id,
        ];
      } else {
        query = "update issues set status=? where id=?";
        updatearray = [body.status, body.id];
      }

      pool.query(query, updatearray, (error, results) => {
        if (error) {
          callBack(error);
        }

        return callBack(null, results);
      });
    }
  },
  updateeostore: (data, callBack) => {
    const body = data.body;
    const user = data.decoded.result;

    pool.query(
      `update emergency_order set cartitems=?,sale=?, comments=?,status=? where id=?`,
      [body.cartitems, body.sale, body.comments, body.status, body.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        const today = new Date(Date.now());
        let yyyy2 = today.getFullYear();
        let mm2 = today.getMonth() + 1; // Months start at 0!
        let dd2 = today.getDate();

        if (dd2 < 10) dd2 = dd2;
        if (mm2 < 10) mm2 = mm2;
        const today_date = String(yyyy2 + "-" + mm2 + "-" + dd2);

        pool.query(
          `insert into notifications(message,readstatus,datentime,store_name,url) values("Your order is updated",'0',?,?,?)`,
          [today_date, body.store_name, "/eo-list"],
          (error2, results2, fields2) => {
            //console.log(results2)
          }
        );
        return callBack(null, results);
      }
    );
  },
  complaintdetails: (data, callBack) => {
    let query = "";

    let user = data.decoded.result;
    if (user.level == "admin") {
      query = `select * from complaints where id=? `;

      pool.query(query, [data.params.id], (error, results, fields) => {
        //console.log(results)
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      });
    }
  },
  geteoorder: (data, callBack) => {
    let query = "";

    query = `select * from emergency_order where id=? `;

    pool.query(query, [data.id], (error, results, fields) => {
      //console.log(results)
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },
};
