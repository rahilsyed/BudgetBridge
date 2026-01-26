import mongoose from 'mongoose';

export const userOverallPipeline = (userId: string) => {
    const objectId = new mongoose.Types.ObjectId(userId);
    return [
        {
            '$match': {
                '_id': objectId
            }
        }, {
            '$lookup': {
                'from': 'income',
                'let': {
                    'userId': '$_id'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$userId'
                                        ]
                                    }, {
                                        '$ne': [
                                            '$isDeleted', true
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                'as': 'incomes'
            }
        }, {
            '$addFields': {
                'totalIncome': {
                    '$sum': '$incomes.amount'
                }
            }
        }, {
            '$lookup': {
                'from': 'expense',
                'let': {
                    'userId': '$_id'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$userId'
                                        ]
                                    }, {
                                        '$ne': [
                                            'isDeleted', true
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                'as': 'expenses'
            }
        }, {
            '$addFields': {
                'totalExpense': {
                    '$sum': '$expenses.amount'
                }
            }
        }, {
            '$addFields': {
                'totalAvailableBalance': {
                    '$subtract': [
                        '$totalIncome', '$totalExpense'
                    ]
                }
            }
        }, {
            '$project': {
                'incomes': 0,
                'expenses': 0,
                'password': 0,
                '__v': 0,
                'updatedAt': 0
            }
        }, {
            '$lookup': {
                'from': 'income',
                'let': {
                    'userId': '$_id'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$userId'
                                        ]
                                    }, {
                                        '$ne': [
                                            'isDeleted', true
                                        ]
                                    }
                                ]
                            }
                        }
                    }, {
                        '$sort': {
                            'createdAt': -1
                        }
                    }, {
                        '$limit': 3
                    }, {
                        '$project': {
                            '_id': 1,
                            'amount': 1,
                            'source': 1,
                            'bankAccountId': 1,
                            'incomeType': 1,
                            'description': 1,
                            'date': 1
                        }
                    }
                ],
                'as': 'recentIncomes'
            }
        }, {
            '$lookup': {
                'from': 'expense',
                'let': {
                    'userId': '$_id'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$userId'
                                        ]
                                    }, {
                                        '$ne': [
                                            'isDeleted', true
                                        ]
                                    }
                                ]
                            }
                        }
                    }, {
                        '$sort': {
                            'createdAt': -1
                        }
                    }, {
                        '$limit': 3
                    }, {
                        '$project': {
                            '_id': 1,
                            'amount': 1,
                            'bankAccountId': 1,
                            'description': 1,
                            'date': 1
                        }
                    }
                ],
                'as': 'recentExpense'
            }
        },
        {
            '$lookup': {
                'from': 'expense',
                'let': {
                    'userId': '$_id',
                    'startOfMonth': {
                        '$dateTrunc': {
                            'date': '$$NOW',
                            'unit': 'month'
                        }
                    }
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$userId'
                                        ]
                                    }, {
                                        '$ne': [
                                            '$isDeleted', true
                                        ]
                                    }, {
                                        '$gte': [
                                            '$createdAt', '$$startOfMonth'
                                        ]
                                    }
                                ]
                            }
                        }
                    }, {
                        '$sort': {
                            'createdAt': -1
                        }
                    }
                ],
                'as': 'monthlyExpenses'
            }
        }, {
            '$addFields': {
                'monthlyExpenses': {
                    '$sum': '$monthlyExpenses.amount'
                }
            }
        }
    ]
};



