const express = require("express");
const moment = require("moment");
const router = express.Router();
const Customer = require("../models/customer");
const Transaction = require("../models/transaction");
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

    if (!title || !amount || !date || !transactionType) {
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

/*
export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.body;

    console.log(userId, type, frequency, startDate, endDate);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a query object with the user and type conditions
    const query = {
      user: userId,
    };

    if (type !== 'all') {
      query.transactionType = type;
    }

    // Add date conditions based on 'frequency' and 'custom' range
    if (frequency !== 'custom') {
      query.date = {
        $gt: moment().subtract(Number(frequency), "days").toDate()
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).toDate(),
        $lte: moment(endDate).toDate(),
      };
    }

    // console.log(query);

    const transactions = await Transaction.find(query);

    // console.log(transactions);

    return res.status(200).json({
      success: true,
      transactions: transactions,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};


export const deleteTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.body.userId;

    // console.log(transactionId, userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const transactionElement = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    const transactionArr = user.transactions.filter(
      (transaction) => transaction._id === transactionId
    );

    user.transactions = transactionArr;

    user.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Transaction successfully deleted`,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const { title, amount, description, date, category, transactionType } =
      req.body;

    console.log(title, amount, description, date, category, transactionType);

    const transactionElement = await Transaction.findById(transactionId);

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    if (title) {
      transactionElement.title = title;
    }

    if (description) {
      transactionElement.description = description;
    }

    if (amount) {
      transactionElement.amount = amount;
    }

    if (category) {
      transactionElement.category = category;
    }
    if (transactionType) {
      transactionElement.transactionType = transactionType;
    }

    if (date) {
      transactionElement.date = date;
    }

    await transactionElement.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Transaction Updated Successfully`,
      transaction: transactionElement,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};
*/
module.exports = router;
