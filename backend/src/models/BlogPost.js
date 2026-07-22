import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'CanPouch Educational Team' },
    image: { type: String },
    tags: [{ type: String }],
    isComplianceApproved: { type: Boolean, default: true }, // Verified non-medical content
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
