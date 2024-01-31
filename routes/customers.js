const express = require('express');
const Model = require('../models/customer');
const router = express.Router();
const auth = require('../middlewares/authJwt')


const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

router.get('/getall', async (req, res) => {
    const { page, size, name } = req.query;
    var condition = name
      ? { name: { $regex: new RegExp(name), $options: "i" } }
      : {};
  
    const { limit, offset } = getPagination(page, size);
  
    Model.paginate(condition, { offset, limit })
      .then((data) => {
        res.send({
          totalItems: data.totalDocs,
          customers: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
      });

})

//Post Method
router.post('/post', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        no_id: req.body.no_id,
        no_tel: req.body.no_tel,
        addres: req.body.addres,
        gender: req.body.gender
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
/*
router.get('/getall',auth.protect, async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
*/



//Get by ID Method
router.get('/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/getnomer/', async (req, res) => {
    try {
        var nomer = req.body.nomer;
        var data = await Model.findOne({no_id: nomer})
        return  res.status(200).send({ success: true,msg: "Customer Details", user:data});
       } catch (error) {
            res.status(400).send({success:false, msg: error.message})
       }
})

/*
router.post('/getransactions/', async (req, res) => {
    try {
        const no_id = req.body.nomer
        const data = await Model.aggregate([
            {
                $match: {
                   no_id: no_id
                }
             },
            
            {
                $lookup: {
                    from: 'transactions',
                    localField: "no_id",
                    foreignField: "no_id",
                    as: 'transactions',
                },
            },
            
            
        ]);
        //console.log(`${no_id}`)
        return  res.status(200).send({ success: true,msg: "Customer Details", user:data});
    } catch (error) {
        res.status(400).send({success:false, msg: error.message})
    }
})
*/


router.get('/search/', async(req, res) => {
   try {
    var s = req.body.s;
    var data = await Model.find({name: { $regex: ".*"+s+".*"}})

    if(data.length > 0 ) {
        res.status(200).send({ success: true, msg: "Customer Details", data:data})
    }
    else {
        res.status(200).send({success:true, msg: "Customer Not found!"})
    }
   } catch (error) {
        res.status(400).send({success:false, msg: error.message})
   }
})



//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;