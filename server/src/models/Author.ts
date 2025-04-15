import { Schema, model, models, Types, Model } from "mongoose";

export type AuthorModelType = {
  _id: Types.ObjectId;
  authorName: string;
  authorImage?: string;
  createdAt: Date;
  updatedAt: Date;
};

const AuthorSchema = new Schema<AuthorModelType>(
  {
    authorName: { type: String, required: true, unique: true },
    authorImage: { type: String },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const AuthorModel: Model<AuthorModelType> =
  models.Author || model<AuthorModelType>("Author", AuthorSchema);
