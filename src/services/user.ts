import User from "../models/user";
import { userOverallPipeline } from "../query/user";



const getUserDashBoardCardData = async (userId: any) => {
    const result = await User.aggregate(userOverallPipeline(userId) as []);
    return result[0];
}



export default {
    getUserDashBoardCardData
}