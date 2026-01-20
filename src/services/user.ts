import User from "../models/user";
import { userOverallPipeline } from "../query/user";



const getUserDashBoardCardData = async (userId: string) => {
    const result = await User.aggregate(userOverallPipeline(userId));
    return result[0];
}



export default {
    getUserDashBoardCardData
}