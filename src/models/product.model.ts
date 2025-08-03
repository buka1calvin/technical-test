import { model, models, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    comment: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    position: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product || model("Product", productSchema);
