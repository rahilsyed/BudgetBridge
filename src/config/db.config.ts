import mongoose from "mongoose"
import dotenv from "dotenv";
import logging from "./logging.config"
dotenv.config();

const MONGO_URL: string = process.env.DATABASE_URL!;  // here "!" is non null assertion operator which tell typescript trustme the Value is not null


const connectToDB = ()=>{
    mongoose.connect(MONGO_URL)
    .then(()=>{
        logging.info('DATABASE','Connected to the database at :' ,MONGO_URL)
    })
    .catch((err)=>{
        logging.error('Error connecting to the database',err )
        process.exit(1);
    })
}


export default connectToDB;


