import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    fullName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String
    },
    watchHistory:[{
        type:mongoose.Schema.ObjectId,
        ref:'Video'
    }],
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    }

},{
    timestamps:true
})
userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
    
} )
userSchema.methods.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateRefreshToken=function (){
    const refreshToken=jwt.sign(
        {
            _id:this._id,
            username:this.username,
            fullName:this.fullName,
            email:this.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }   
    );

}
userSchema.methods.generateAccessToken=function (){
    const refreshToken=jwt.sign(
        {
            _id:this._id,
            username:this.username,
            fullName:this.fullName,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }   
    );

}
export const User=mongoose.model('User',userSchema);
        
    