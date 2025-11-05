import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const transactionSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true 
    },
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: "Product", 
      required: true, 
      index: true 
    },
    amount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed"],
      default: "pending",
      index: true
    },
    referredBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      default: null, 
      index: true 
    }
  },
  { 
    timestamps: { 
      createdAt: "createdAt", 
      updatedAt: "updatedAt" 
    } 
  }
);

// Indexes for common queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ referredBy: 1, status: 1 });

// מונע כפילויות build במצב dev
export default models.Transaction || model("Transaction", transactionSchema);
