// // const fs = require("fs");

// // const nfts = JSON.parse(
// //   fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
// // );

// const NFT = require("./../models/nftModel");

// // exports.checkId = (req, res, next, value) => {
// //   console.log(`ID: ${value}`);
// //   // if (req.params.id * 1 > nfts.length) {
// //   //   return res.status(404).json({
// //   //     status: "fail",
// //   //     message: "Invalid ID",
// //   //   });
// //   // }
// //   next();
// // };

// // exports.checkBody = (req, res, next) => {
// //   if (!req.body.name || !req.body.price) {
// //     return res.status(400).json({
// //       status: "fail",
// //       message: "Missing name and price",
// //     });
// //   }
// //   next();
// // };

// exports.getAllNfts = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: "success",
//     requestTime: req.requestTime,
//     // results: nfts.length,
//     // data: {
//     //   nfts,
//     // },
//   });
// };
// //POST METHOD
// exports.createNFT = (req, res) => {
//   // const newId = nfts[nfts.length - 1].id + 1;
//   // const newNFTs = Object.assign({ id: newId }, req.body);
//   // nfts.push(newNFTs);
//   // fs.writeFile(
//   //   `${__dirname}/nft-data/data/nft-simple.json`,
//   //   JSON.stringify(nfts),
//   //   (err) => {
//   //     res.status(201).json({
//   //       status: "success",
//   //       nft: newNFTs,
//   //     });
//   //   }
//   // );
// };
// // GET SINGLE NFT
// exports.getSingleNFT = (req, res) => {
//   const id = req.params.id * 1;
//   // const nft = nfts.find((el) => el.id === id);

//   // if (!nft) {
//   //   return res.status(404).json({
//   //     status: "fail",
//   //     message: "Invalid ID",
//   //   });
//   // }

//   res.status(200).json({
//     status: "success",
//     // data: {
//     //   nft,
//     // },
//   });
// };
// //PATCH METHOD
// exports.updateNFT = (req, res) => {
//   // if (req.params.id * 1 > nfts.length) {
//   //   return res.status(404).json({
//   //     status: "fail",
//   //     message: "Invalid ID",
//   //   });
//   // }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "Updating nft",
//     },
//   });
// };
// //DELET METHOD
// exports.deleteNFT = (req, res) => {
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };

// /// PART 2 ------------------------------

// const NFT = require("./../models/nftModel");

// exports.aliasTopNFTs = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.sort = "-ratingsAverage,price";
//   req.query.fields = "name,price,ratingsAverage,difficulty";
//   next();
// };

// // class APIFeatures {
// //   constructor(query, queryString) {
// //     this.query = query;
// //     this.queryString = queryString;
// //   }

// //   filter(){

// //   }

// // }

// exports.getAllNfts = async (req, res) => {
//   try {
//     //BUILD QUERY
//     const queryObj = { ...req.query };
//     const excludedFields = ["page", "sort", "limit", "fields"];
//     excludedFields.forEach((el) => delete queryObj[el]);
//     // console.log(req.query, queryObj);

//     //ADVANCE FILTERING QUERY
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     // console.log(JSON.parse(queryStr));

//     let query = NFT.find(JSON.parse(queryStr));
//     // {difficulty: "easy", duration: {$gte: 5}}
//     // { difficulty: 'easy', duration: { gte: '5' } }
//     // { difficulty: 'easy', duration: { '$gte': '5' } }

//     //SORTING METHOD
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(",").join(" ");
//       console.log(sortBy);
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort("-createdAt");
//     }

//     //FIELDS LIMITING
//     if (req.query.fields) {
//       const fields = req.query.fields.split(",").join(" ");
//       query = query.select(fields);
//     } else {
//       query = query.select("-__v");
//     }

//     //PAGINATIONS FUNCTION

//     // page=2&limit=3, page = 1, 1 -10, page 2, 11 -20, page 3, 21 -30
//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 10;
//     const skip = (page - 1) * limit;

//     query = query.skip(skip).limit(limit);

//     if (req.query.page) {
//       const newNFTs = await NFT.countDocuments();
//       if (skip >= newNFTs) throw new Error("This page dosen't exist");
//     }

//     const nfts = await query;

//     // console.log(req.query);

//     // const nfts = await NFT.find({
//     //   difficulty: "easy",
//     //   duration: 5,
//     // });

//     // const nfts = await NFT.find()
//     //   .where("duration")
//     //   .equals(5)
//     //   .where("difficulty")
//     //   .equals("easy");
//     // /SEND QUERY
//     res.status(200).json({
//       status: "success",
//       results: nfts.length,
//       data: {
//         nfts,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// //POST METHOD
// exports.createNFT = async (req, res) => {
//   // const newNFT = new NFT({})
//   // newNFT.save();

//   try {
//     const newNFT = await NFT.create(req.body);

//     res.status(201).json({
//       status: "success",
//       data: {
//         nft: newNFT,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: "Invalid data send for NFT",
//     });
//   }
// };

// // GET SINGLE NFT
// exports.getSingleNFT = async (req, res) => {
//   try {
//     const nft = await NFT.findById(req.params.id);

//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// //PATCH METHOD
// exports.updateNFT = async (req, res) => {
//   try {
//     const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// //DELET METHOD
// exports.deleteNFT = async (req, res) => {
//   try {
//     await NFT.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };

// /// PART 3 ------------------------------

// const NFT = require("./../models/nftModel");
// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter() {
//     //BUILD QUERY
//     const queryObj = { ...this.queryString };
//     const excludedFields = ["page", "sort", "limit", "fields"];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     //ADVANCE FILTERING QUERY
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     this.query = this.query.find(JSON.parse(queryStr));

//     // this.query = NFT.find(JSON.parse(queryStr));
//     return this;
//   }

//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join(" ");
//       console.log(sortBy);
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort("-createdAt");
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(",").join(" ");
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select("-__v");
//     }
//     return this;
//   }

//   pagination() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 10;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);

//     // if (this.queryString.page) {
//     //   const newNFTs = await NFT.countDocuments();
//     //   if (skip >= newNFTs) throw new Error("This page dosen't exist");
//     // }

//     return this;
//   }
// }

// exports.aliasTopNFTs = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.sort = "-ratingsAverage,price";
//   req.query.fields = "name,price,ratingsAverage,difficulty";
//   next();
// };

// exports.getAllNfts = async (req, res) => {
//   try {
//     // //BUILD QUERY
//     // const queryObj = { ...req.query };
//     // const excludedFields = ["page", "sort", "limit", "fields"];
//     // excludedFields.forEach((el) => delete queryObj[el]);

//     // //ADVANCE FILTERING QUERY
//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     // let query = NFT.find(JSON.parse(queryStr));

//     //SORTING METHOD
//     // if (req.query.sort) {
//     //   const sortBy = req.query.sort.split(",").join(" ");
//     //   console.log(sortBy);
//     //   query = query.sort(sortBy);
//     // } else {
//     //   query = query.sort("-createdAt");
//     // }

//     //FIELDS LIMITING
//     // if (req.query.fields) {
//     //   const fields = req.query.fields.split(",").join(" ");
//     //   query = query.select(fields);
//     // } else {
//     //   query = query.select("-__v");
//     // }

//     //PAGINATIONS FUNCTION
//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 10;
//     // const skip = (page - 1) * limit;

//     // query = query.skip(skip).limit(limit);

//     // if (req.query.page) {
//     //   const newNFTs = await NFT.countDocuments();
//     //   if (skip >= newNFTs) throw new Error("This page dosen't exist");
//     // }

//     const features = new APIFeatures(NFT.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .pagination();
//     const nfts = await features.query;

//     // /SEND QUERY
//     res.status(200).json({
//       status: "success",
//       results: nfts.length,
//       data: {
//         nfts,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// //POST METHOD
// exports.createNFT = async (req, res) => {
//   // const newNFT = new NFT({})
//   // newNFT.save();

//   try {
//     const newNFT = await NFT.create(req.body);

//     res.status(201).json({
//       status: "success",
//       data: {
//         nft: newNFT,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: "Invalid data send for NFT",
//     });
//   }
// };

// // GET SINGLE NFT
// exports.getSingleNFT = async (req, res) => {
//   try {
//     const nft = await NFT.findById(req.params.id);

//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// //PATCH METHOD
// exports.updateNFT = async (req, res) => {
//   try {
//     const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// //DELET METHOD
// exports.deleteNFT = async (req, res) => {
//   try {
//     await NFT.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };

// PART 4 ------------------------------

const NFT = require("./../models/nftModel");
const APIFeatures = require("./../Utils/apiFeatures");

exports.aliasTopNFTs = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

exports.getAllNfts = async (req, res) => {
  try {
    const features = new APIFeatures(NFT.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const nfts = await features.query;

    // /SEND QUERY
    res.status(200).json({
      status: "success",
      results: nfts.length,
      data: {
        nfts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
//POST METHOD
exports.createNFT = async (req, res) => {
  try {
    const newNFT = await NFT.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        nft: newNFT,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// GET SINGLE NFT
exports.getSingleNFT = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
//PATCH METHOD
exports.updateNFT = async (req, res) => {
  try {
    const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
//DELET METHOD
exports.deleteNFT = async (req, res) => {
  try {
    await NFT.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

//Aggregation Pipeline

exports.getNFTsStats = async (req, res) => {
  try {
    const stats = await NFT.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: "$ratingsAverage",
          _id: { $toUpper: "$difficulty" },
          numNFT: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgRating: 1 },
      },
      // {
      //   $match: {
      //     _id: { $ne: "EASY" },
      //   },
      // },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

//CALCULATING NUMBER OF NFT CREATE IN THE MONTH OR MONTHLY PLAN

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await NFT.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numNFTStarts: { $sum: 1 },
          nfts: { $push: "$name" },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numNFTStarts: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
