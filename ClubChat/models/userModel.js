const mongoose=require('mongoose');
const db_link="mongodb+srv://harry_123:flyingbeast@cluster0.zxoymhd.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(db_link)
.then(function(db){
    console.log("db connected");
})
.catch(function(err){
    console.log(err);
})

const userSchmea=mongoose.Schema({
    clientid:{
        type:String,
        requried:true,
    },
    username:{
        type:String,
        required:true,
    },
    room:{
        type:String,
        required :true,
    }
})

const userModel=mongoose.model('userModel',userSchmea);

module.exports=userModel;