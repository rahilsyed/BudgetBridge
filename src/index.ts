import express, {Request, Response, NextFunction} from "express"
import fileUpload from "express-fileupload";
import cors from "cors";
import connectToDB from './config/db.config';
import logging from './config/logging.config';
import dotenv from "dotenv";
import apiRouter from "./routes/api.routes"
dotenv.config()
const app = express();

const NAMESPACE:string = "Server";

//Database connection 
connectToDB();

app.set("view engine" ,"ejs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir:'/tmp',
        limits:{ fileSize: 5000000}, //5mb
        abortOnLimit: true,
        responseOnLimit:"File size must be 5mb or less"
    }),
);
app.use((req:Request,res:Response,next:NextFunction)=>{
   //log the req
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL [${req.url}] - IP: [${req.socket.remoteAddress}]]`)
  res.on('finish', () => {
    // Log the res
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
  });
  next();
})

app.use("/api", apiRouter);
// app.get("/",(req:Request, res:Response)=>{
//     console.log("api working");
// })


app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})

