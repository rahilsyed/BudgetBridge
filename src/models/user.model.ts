import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user.interface';


const userSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: [true, 'First Name is reuired'] },
  lastName: { type: String, required: [true, 'Last Name is required'] },
  email: { type: String, required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique:true,
    match:[
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
    ],
    phone:{type: String, required:false},
    imgUrl: {type: String}
   },
   password:{type: String , required:[true,"Please enter a Password"]}
});
