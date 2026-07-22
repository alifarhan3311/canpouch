import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// Helper to escape regex characters to prevent regex injection
const escapeRegex = (string) => {
  return typeof string === 'string' ? string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, brand, strength, minPrice, maxPrice, search, sort, isFeatured, isNewArrival } = req.query;
    
    let query = { isActive: true };

    if (category && typeof category === 'string') {
      const catObj = await Category.findOne({ slug: category.toLowerCase().trim() });
      if (catObj) query.category = catObj._id;
    }

    if (brand && typeof brand === 'string') {
      const brandObj = await Brand.findOne({ slug: brand.toLowerCase().trim() });
      if (brandObj) query.brand = brandObj._id;
    }

    if (strength && !isNaN(Number(strength))) {
      query.strengthMg = Number(strength);
    }

    if (isFeatured === 'true') query.isFeatured = true;
    if (isNewArrival === 'true') query.isNewArrival = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) query.price.$lte = Number(maxPrice);
    }

    if (search && typeof search === 'string') {
      const sanitizedSearch = escapeRegex(search.trim());
      if (sanitizedSearch) {
        query.$or = [
          { name: { $regex: sanitizedSearch, $options: 'i' } },
          { description: { $regex: sanitizedSearch, $options: 'i' } },
          { flavor: { $regex: sanitizedSearch, $options: 'i' } }
        ];
      }
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .sort(sortOption);

    res.status(200).json(new ApiResponse(200, products, 'Products retrieved'));
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const slug = typeof req.params.slug === 'string' ? req.params.slug.toLowerCase().trim() : '';
    const product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.status(200).json(new ApiResponse(200, product, 'Product detail retrieved'));
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved'));
  } catch (error) {
    next(error);
  }
};

export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true });
    res.status(200).json(new ApiResponse(200, brands, 'Brands retrieved'));
  } catch (error) {
    next(error);
  }
};
