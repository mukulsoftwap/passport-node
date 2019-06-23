var mongoos = require('mongoose');

mongoos.connect('mongodb+srv://demo:demo123@cluster0-nkpbx.mongodb.net/test?retryWrites=true&w=majority',  { useNewUrlParser: true });

var Schema = mongoos.Schema;

var userSchema = new Schema({
    username : String,
    password : String
})

// userSchema.pre('save', function(next){
//     let num = ""+this.number;
//     if(num.length!=10){
//         // data();
//         next(new Error("number should be of length 10"));
//     }else{
//         next();
//     }
    
// })

var User = mongoos.model('User', userSchema);

module.exports = User;