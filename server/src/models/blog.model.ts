import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  image: string;
  activeDays: number;
  createdAt: Date;
  expiresAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    activeDays: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

BlogSchema.pre<IBlog>("save", function (next) {
  this.expiresAt = new Date(
    this.createdAt.getTime() + this.activeDays * 24 * 60 * 60 * 1000
  );
  next();
});

export default mongoose.model<IBlog>("Blog", BlogSchema);
