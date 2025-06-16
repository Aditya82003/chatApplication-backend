import mongoose from "mongoose"

export const connectDB = async (url:string)=>{
    try{
        await mongoose.connect(url)
        console.log('MongoDb connected successfully')
    }catch(err){
        console.log(err)
    }
}