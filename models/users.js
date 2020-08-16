const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const User = new Schema({
    email: {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
    }
}, {
    timestamps: true
});

//Encrypting the password
User.pre('save', function (next) {
  var user = this;
  if(user.password){
    bcrypt.hash(user.password, 10, (err,hash)=>{
      if (err) {
          return next(err);
      }
      user.password = hash;
    })
  }
  next();
});
  
  User.pre('update', function (next) {
    var user = this;
    if(user.password){
      bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
          return next(err);
        }
        user.password = hash;
      })
    }
    next();
  });

  //Verfying the password with encryted password
  User.methods.validPassword = function (password){
    return bcrypt.compareSync(password, this.password);
  };

module.exports = mongoose.model('User', User);

