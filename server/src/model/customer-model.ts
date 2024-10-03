import mongoose, { Document, Schema } from "mongoose";

interface Customer extends Document {
    name: string
    email: string
    password: string
}

const customerSchema: Schema<Customer> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
},
{
    timestamps:true
})

export const Customer=mongoose.model<Customer>('customer',customerSchema)

