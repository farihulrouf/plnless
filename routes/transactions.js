const express = require("express");
const moment = require("moment");
const router = express.Router();
const Customer = require("../models/customer");
const Transaction = require("../models/transaction");

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

router.post("/post", async (req, res) => {
  try {
    const {
      title,
      amount,
      date,
      customerId,
      transactionType,
      noinv,
      no_id,
      meteran,
    } = req.body;

    if (!title || !amount || !transactionType) {
      return res.status(408).json({
        success: false,
        messages: "Please Fill all fields",
      });
    }
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer not found",
      });
    }

    let newTransaction = await Transaction.create({
      title: title,
      amount: amount,
      date: date,
      customer: customerId,
      transactionType: transactionType,
      noinv: noinv,
      no_id: no_id,
      meteran: meteran,
    });
    //customer.transactions.push(newTransaction);

    //customer.save();

    return res.status(200).json({
      success: true,
      message: "Transaction Added Successfully",
      data: newTransaction,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
});

router.post("/getid", async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const id = req.body.no;
  //console.log('id customer', id)
  try {
    // execute query with page and limit values
    const transaction = await Transaction.find({ customer: `${id}` })
      .sort({ created_at: "desc" })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the Posts collection
    const count = await Transaction.countDocuments({ customer: `${id}` });

    // return response with posts, total pages, and current page
    res.json({
      data: transaction,
      totalPages: Math.ceil(count / limit),
      totalitems: count,
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/getransactions/", async (req, res) => {
  try {
    const no_id = req.body.nomer;
    const data = await Transaction.aggregate([
      {
        $match: {
          no_id: no_id,
        },
      },
      { $sort: { date: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "customers",
          localField: "no_id",
          foreignField: "no_id",
          as: "customers",
        },
      },
    ]);
    //console.log(`${no_id}`)
    return res
      .status(200)
      .send({ success: true, msg: "Transaction Details", transaction: data });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    //console.log("data sekarang", new Date());
    const data = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $gte: [{ $month: "$created_at" }, 1] },
              { $lte: [{ $month: "$created_at" }, 1] },
            ],
          },
        },
      },

      {
        $group: {
          _id: { $month: "$created_at" },
          total: {
            $sum: {
              $toInt: "$amount",
            },
          },
          count: { $sum: 1 },

          used: {
            $sum: {
              $toInt: "$meteran",
            },
          },
          avg_used: {
            $avg: "$meteran",
          },
          avg_total: {
            $avg: "$amount",
          },
        },
      },
    ]);
    return res
      .status(200)
      .send({ success: true, msg: "Transaction", transaction: data });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

router.get("/getall", async (req, res) => {
  let { page, limit, s } = req.query;
  //let s = req.body.s;

 //    var data = await Model.find({name: { $regex: ".*"+s+".*"}})
 //{position: ($regex: "senior"}}
 //    { $match: { Code: 'Value_01', Field2: { $regex: Value_match } } },  

 //{ $match : { name : "abi" } }
 //
  try {
    var condition = s
      ? { "customers.name": { $regex: new RegExp(s), $options: "i" } }
      : {};
    const result = await Transaction.aggregate([
     
      {
        $lookup: {
          from: "customers",
          localField: "no_id",
          foreignField: "no_id",
          as: "customers",
        },
      },
      {
        $match: condition
      },
  
      {
        $facet: {
          metaData: [
            {
              $count: "totalDocuments",
            },
            {
              $addFields: {
                pageNumber: page,
                totalPages: {
                  $ceil: { $divide: ["$totalDocuments", parseInt(limit)] },
                },
              },
            },
          ],
          data: [
            {
              $skip: (page - 1) * parseInt(limit),
            },
            {
              $limit: parseInt(limit),
            },
          ],
        },
      },
    ]);
    return res
      .status(200)
      .send({ success: true, msg: "Transaction Details", transaction: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

module.exports = router;
