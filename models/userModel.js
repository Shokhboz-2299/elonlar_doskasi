const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique:true
  },
  username: {
    type:String,
    required:true,
    trim:true,
    unique:true
  },
  phone: {
    type: String,
    required:true
  },
  password: {
    type: String,
    required:true,
    minlength:6
  },
  posters: [{type: Schema.Types.ObjectId, ref: 'Poster'}]
},
{
  timestamps:true
})

module.exports = model('User', userSchema)