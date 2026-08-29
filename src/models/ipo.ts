import mongoose, { Schema } from 'mongoose'
import IIpo from '../interfaces/ipo'

const ipoSchema: Schema<IIpo> = new Schema({
    listingName: {
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:'true'
    },
    price: {
        type: String,
        required: true
    },
    numberOfShares: {
        type: Number,
        required: true
    },
    expectedGMP: {
        type: String,
    },
    listingDate: {
        type: Date,
    },
    isApplied: {
        type: Boolean,
        default: false,
    },
    fundsReleaseDate: {
        type: Date,
    },
    bankAccountId:{
        type: Schema.Types.ObjectId,
        ref: 'bankAccounts'
    }
}, {
    timestamps: true,
    collection: 'ipos'
})

const IpoSchema = mongoose.model<IIpo>('ipos', ipoSchema);
export default IpoSchema