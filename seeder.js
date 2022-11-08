const fs=require("fs")
const mongoose=require("mongoose")
const colors=require("colors")
const dotenv=require("dotenv")


//Load Env Vars
dotenv.config({path:'./config/config.env'})


const User=require("./models/User")


//connect To Db
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    // useFindAndModify:false
})


const users=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`),'utf-8')


//Import data into DB
const importData=async()=>{
    try {
        await User.create(users)
        console.log("Data Imported".green.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

// Delete data from DB
const deleteData=async()=>{
    try {
        await User.deleteMany()
        // await Review.deleteMany()
        console.log("Data Deleted....".red.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

if(process.argv[2]==='-i'){
    importData()
}
else if(process.argv[2]=='-d'){
    deleteData()
}
