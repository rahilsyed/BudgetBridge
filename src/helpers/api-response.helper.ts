import {Response} from "express";


const successResponse = (res: Response, msg: string, data:any)=>{
    let resdata ={
        status: true,
        message: msg,
        data : data
    }
    return res.status(200).json(resdata)
}
const errorResponse =(res:Response, msg:string)=>{
    let resData={
        status: false,
        message: msg,
        data: null
    }
    return res.status(500).json(resData);
}

const notFoundResponse=(res:Response, msg:string)=>{
let resData={
    status:false,
    message: msg,
    data: null
}
return res.status(404).json(resData);
}


const validationError=(res:Response, msg:String)=>{
let resData={
    status:false,
    message: msg,
    data: null
}
return res.status(400).json(resData);
}

const unauthorizedResponse = (res:Response, msg: string)=>{
    let resData={
    status:false,
    message: msg,
    data: null
}
return res.status(401).json(resData);
}


export default{
    successResponse,
    errorResponse,
    notFoundResponse,
    validationError,
    unauthorizedResponse
}