import { BlogPost } from '../models/BlogPost.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getBlogPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find({ isComplianceApproved: true }).sort({ publishedAt: -1 });
    res.status(200).json(new ApiResponse(200, posts, 'Blog posts retrieved'));
  } catch (error) {
    next(error);
  }
};

export const getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isComplianceApproved: true });
    if (!post) {
      return res.status(404).json(new ApiResponse(404, null, 'Blog post not found'));
    }
    res.status(200).json(new ApiResponse(200, post, 'Blog post details retrieved'));
  } catch (error) {
    next(error);
  }
};
