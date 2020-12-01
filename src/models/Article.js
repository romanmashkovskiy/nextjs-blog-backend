import mongoose, { Schema } from 'mongoose';
import { ReviewSchema } from './Review';

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // slug: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // sanitizedHtml: {
  //   type: String,
  //   required: true,
  // },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviews: [
    ReviewSchema,
  ],
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      // eslint-disable-next-line no-param-reassign
      delete ret.createdAt;
      // eslint-disable-next-line no-param-reassign
      delete ret.updatedAt;
      // eslint-disable-next-line no-param-reassign
      delete ret.__v;
    },
  },
  toObject: {
    transform: (doc, ret) => {
    },
  },
});

class ArticleClass {
}

ArticleSchema.loadClass(ArticleClass);

const Product = mongoose.model('Article', ArticleSchema);

export default Product;
