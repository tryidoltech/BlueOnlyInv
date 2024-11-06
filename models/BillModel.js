const { default: mongoose } = require("mongoose");

const BillSchema = mongoose.Schema({
  value: {
    type: Object,
    default: {},
  },
  tableData: {
    type: Array,
    default: [],
  },
  transactionData: {
    type: Array,
    default: [],
  },
  paidAmount:{
    type:Number,
    default:0
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
},{
  timestamps: true
});
const Bill = mongoose.model("Bill", BillSchema);
module.exports = Bill;
