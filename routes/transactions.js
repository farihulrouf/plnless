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
      last_meteran
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
      last_meteran: last_meteran
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
    const transaction = await Transaction.find({ no_id: `${id}` })
      .sort({ created_at: "desc" })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the Posts collection
    const count = await Transaction.countDocuments({ no_id: `${id}` });

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

router.get("/getransactions", async (req, res) => {
  try {
    const { nomer } = req.query;
    //console.log("data", nomer);
    const data = await Transaction.aggregate([
      { $match: { no_id: parseInt(nomer) } },
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

    //`${no}`
    return res
      .status(200)
      .send({ success: true, msg: "Transaction", transaction: data });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

router.get("/all", async (req, res) => {
  const { from, to } = req.query;

  try {
    //console.log("data sekarang", new Date());
    const data = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $gte: [{ $month: "$created_at" }, parseInt(from)] },
              { $lte: [{ $month: "$created_at" }, parseInt(to)] },
            ],
          },
        },
      },
      
      {
        $group: {
          _id: { 
         
            status: "$status",
          
          },
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

router.get("/getone", async (req, res) => {
  let { no } = req.query;
 // console.log('data',no)
  try {
    //Location.findById(req.params.id).then(data => console.log(data))
    const data = await Transaction.findById(no);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getall", async (req, res) => {
  let { page, limit, s } = req.query;

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
        $match: condition,
      },
      { $sort: { created_at: -1 } },
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

router.put("/update", async (req, res) => {
  try {
    const { id } = req.query;
    const updatedData = req.body;
    updatedData.updated_at = new Date();
    const options = { new: true };

    const result = await Transaction.findByIdAndUpdate(
      id,
      updatedData,
      options
    );

    return res
      .status(200)
      .send({ success: true, msg: "Transaction Details", transaction: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/getlast", async (req, res) => {
  try {
    const { nomer } = req.query;
    //console.log("data", nomer);
    //
    const data = await Transaction.aggregate([
      { $match: { no_id: parseInt(nomer) } },
      { $sort: { date: -1 } },
      { $limit: 1 }
    ]);
    //console.log(`${no_id}`)

    //`${no}`
    return res
      .status(200)
      .send({ success: true, msg: "Transaction", transaction: data });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});



router.get("/idcustomer", async (req, res) => {
  try {
    const { no } = req.query;
  //db.bios.find().limit( 5 ).sort( { name: 1 } )

   //console.log("data", no);
    const data = await 
    Transaction.findOne({no_id:no}).sort({date: -1}).limit(1)
    {/*
    const data = await Transaction.aggregate([
      { $match: { customer: no } },
      { $sort: { date: -1 } },
      { $limit: 1 }
    ]);
    */}
    
    return res
      .status(200)
      .send({ success: true, msg: "Transaction", transaction: data });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});



module.exports = router;
