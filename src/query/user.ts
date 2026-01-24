import mongoose from 'mongoose';

export const userOverallPipeline = (userId: string) => {
    const objectId = new mongoose.Types.ObjectId(userId);

    return [
        {
            $match: {
                _id: objectId,
                isDeleted: { $ne: true }
            }
        },

        // Income lookup
        // Income
        {
            $lookup: {
                from: 'income',
                let: { userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$userId', '$$userId'] },
                                    { $ne: ['$isDeleted', true] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalIncome: {
                                $sum: { $toDouble: '$amount' }
                            }
                        }
                    }
                ],
                as: 'incomeData'
            }
        },

        // Expense
        {
            $lookup: {
                from: 'expense',
                let: { userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$userId', '$$userId'] },
                                    { $ne: ['$isDeleted', true] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalExpense: {
                                $sum: { $toDouble: '$amount' }
                            }
                        }
                    }
                ],
                as: 'expenseData'
            }
        },


        // Flatten totals
        {
            $addFields: {
                totalIncome: {
                    $ifNull: [{ $arrayElemAt: ['$incomeData.totalIncome', 0] }, 0]
                },
                totalExpense: {
                    $ifNull: [{ $arrayElemAt: ['$expenseData.totalExpense', 0] }, 0]
                }
            }
        },
        {
            $addFields: {
                availableBalance: {
                    $subtract: ['$totalIncome', '$totalExpense']
                }
            }
        },

        // Final shape
        {
            $project: {
                incomeData: 0,
                expenseData: 0,
                password: 0,
                __v: 0
            }
        }
    ];
};
