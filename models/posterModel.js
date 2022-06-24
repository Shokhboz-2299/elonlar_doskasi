const {Schema, model} = require('mongoose')

const posterSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    min:50
  },
  image: {
    type: String,
    required: true
  },
  isActive:{
    type:Boolean,
    required:true,
    default:true
  },
  visits: {
    type:Number,
    default:1
  }
})

module.exports = model('Poster', posterSchema)