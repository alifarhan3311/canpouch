import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../src/models/User.js';
import { Category } from '../src/models/Category.js';
import { Brand } from '../src/models/Brand.js';
import { Product } from '../src/models/Product.js';
import { ComplianceRule } from '../src/models/ComplianceRule.js';
import { BlogPost } from '../src/models/BlogPost.js';
import { CANADIAN_PROVINCES, MANDATORY_PRODUCT_WARNINGS } from '../src/constants/index.js';

const FLAVOR_IMAGES = {
  mint: ['/images/pouch_mint.png'],
  citrus: ['/images/pouch_citrus.png'],
  berry: ['/images/pouch_berry.png'],
  coffee: ['/images/pouch_coffee.png'],
  spice: ['/images/pouch_mint.png']
};

const getRandomImg = (type) => {
  const arr = FLAVOR_IMAGES[type] || FLAVOR_IMAGES.mint;
  return arr[0];
};

const seedData = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect("mongodb+srv://alifarhan1531_db_user:7yOEDrGW9vCzrrPY@cluster0.goz87ui.mongodb.net/?appName=Cluster0" || 'mongodb://localhost:27017/canpouch_db');
    console.log('Connected to MongoDB for seeding 50 products...');

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Product.deleteMany();
    await ComplianceRule.deleteMany();
    await BlogPost.deleteMany();

    console.log('Cleared old database records.');

    // 1. Seed Compliance Rules
    for (const prov of CANADIAN_PROVINCES) {
      await ComplianceRule.create({
        provinceCode: prov.code,
        provinceName: prov.name,
        minAge: prov.minAge,
        taxRate: prov.taxRate,
        taxName: prov.taxName,
        isRestricted: prov.restricted,
        warningNotice: `Age verification mandatory for ${prov.name}. Legal age: ${prov.minAge}+.`
      });
    }
    console.log('Seeded Canadian Provincial Compliance Rules & Taxes.');

    // 2. Seed Admin & Customer Users
    await User.create({
      firstName: 'Admin',
      lastName: 'Officer',
      email: 'admin@canpouch.ca',
      password: 'AdminPassword123!',
      role: 'admin',
      dateOfBirth: new Date('1990-01-01'),
      province: 'ON',
      isAgeVerified: true
    });

    await User.create({
      firstName: 'Alex',
      lastName: 'Tremblay',
      email: 'customer@canpouch.ca',
      password: 'CustomerPassword123!',
      role: 'customer',
      dateOfBirth: new Date('1995-05-15'),
      province: 'ON',
      isAgeVerified: true,
      addresses: [
        {
          street: '100 Yonge Street, Suite 400',
          city: 'Toronto',
          province: 'ON',
          postalCode: 'M5H 1H1',
          country: 'Canada',
          isDefault: true
        }
      ]
    });

    console.log('Seeded Admin (admin@canpouch.ca) & Customer (customer@canpouch.ca) accounts.');

    // 3. Seed Categories
    const catMint = await Category.create({ name: 'Mint & Menthol', slug: 'mint-menthol', description: 'Crisp spearmint, peppermint, and icy menthol pouch blends.' });
    const catCitrus = await Category.create({ name: 'Citrus & Fruit', slug: 'citrus-fruit', description: 'Zesty lemon-lime, orange, and tropical fruit flavors.' });
    const catBerry = await Category.create({ name: 'Berry & Exotic', slug: 'berry-exotic', description: 'Wild berry, black currant, and dragonfruit pouch blends.' });
    const catCoffee = await Category.create({ name: 'Coffee & Espresso', slug: 'coffee-espresso', description: 'Rich roasted espresso and vanilla coffee flavors.' });
    const catSpice = await Category.create({ name: 'Cinnamon & Spice', slug: 'cinnamon-spice', description: 'Warm cinnamon, clove, and spiced pouch varieties.' });

    // Seed Brands
    const brandZyn = await Brand.create({ name: 'ZYN', slug: 'zyn', description: 'World renowned tobacco-free nicotine pouch brand.' });
    const brandVelo = await Brand.create({ name: 'VELO', slug: 'velo', description: 'Sleek, slim nicotine pouches for modern adults.' });
    const brandFre = await Brand.create({ name: 'FRE', slug: 'fre', description: 'Full flavor impact nicotine pouches.' });
    const brandBridge = await Brand.create({ name: 'Bridge', slug: 'bridge', description: 'Premium craft nicotine pouch formulations.' });
    const brandZone = await Brand.create({ name: 'Zone', slug: 'zone', description: 'High performance precision moisture pouches.' });
    const brandFox = await Brand.create({ name: 'White Fox', slug: 'white-fox', description: 'All-white portion nicotine pouches with intense feel.' });
    const brandOn = await Brand.create({ name: 'On!', slug: 'on', description: 'Compact mini dry pouch design.' });

    console.log('Seeded Categories & Brands.');

    // 4. Generate 50 Products Data
    const rawProducts = [
      // ZYN (10 products)
      { name: 'ZYN Cool Mint 3mg', brand: brandZyn, category: catMint, flavor: 'Cool Mint', strengthMg: 3, price: 11.99, type: 'mint' },
      { name: 'ZYN Cool Mint 4mg', brand: brandZyn, category: catMint, flavor: 'Cool Mint', strengthMg: 4, price: 12.99, type: 'mint', isFeatured: true, isBestSeller: true },
      { name: 'ZYN Spearmint 3mg', brand: brandZyn, category: catMint, flavor: 'Spearmint', strengthMg: 3, price: 11.99, type: 'mint' },
      { name: 'ZYN Spearmint 4mg', brand: brandZyn, category: catMint, flavor: 'Spearmint', strengthMg: 4, price: 12.99, type: 'mint', isFeatured: true },
      { name: 'ZYN Citrus Chill 3mg', brand: brandZyn, category: catCitrus, flavor: 'Citrus Chill', strengthMg: 3, price: 11.99, type: 'citrus' },
      { name: 'ZYN Citrus Chill 4mg', brand: brandZyn, category: catCitrus, flavor: 'Citrus Chill', strengthMg: 4, price: 12.99, type: 'citrus', isFeatured: true, isBestSeller: true },
      { name: 'ZYN Black Cherry 4mg', brand: brandZyn, category: catBerry, flavor: 'Black Cherry', strengthMg: 4, price: 12.99, type: 'berry', isNewArrival: true },
      { name: 'ZYN Espresso Roast 4mg', brand: brandZyn, category: catCoffee, flavor: 'Espresso Roast', strengthMg: 4, price: 12.99, type: 'coffee' },
      { name: 'ZYN Cinnamon Freeze 4mg', brand: brandZyn, category: catSpice, flavor: 'Cinnamon Freeze', strengthMg: 4, price: 12.99, type: 'spice' },
      { name: 'ZYN Peppermint Frost 4mg', brand: brandZyn, category: catMint, flavor: 'Peppermint', strengthMg: 4, price: 12.99, type: 'mint' },

      // VELO (10 products)
      { name: 'VELO Polar Mint 3mg', brand: brandVelo, category: catMint, flavor: 'Polar Mint', strengthMg: 3, price: 12.49, type: 'mint' },
      { name: 'VELO Polar Mint 4mg', brand: brandVelo, category: catMint, flavor: 'Polar Mint', strengthMg: 4, price: 13.49, type: 'mint', isFeatured: true },
      { name: 'VELO Tropic Breeze 4mg', brand: brandVelo, category: catCitrus, flavor: 'Tropic Breeze', strengthMg: 4, price: 13.49, type: 'citrus', isNewArrival: true, isBestSeller: true },
      { name: 'VELO Berry Frost 3mg', brand: brandVelo, category: catBerry, flavor: 'Berry Frost', strengthMg: 3, price: 12.49, type: 'berry' },
      { name: 'VELO Berry Frost 4mg', brand: brandVelo, category: catBerry, flavor: 'Berry Frost', strengthMg: 4, price: 13.49, type: 'berry', isFeatured: true },
      { name: 'VELO Icy Lemon 4mg', brand: brandVelo, category: catCitrus, flavor: 'Lemon Lime', strengthMg: 4, price: 13.49, type: 'citrus' },
      { name: 'VELO Wintergreen Rush 4mg', brand: brandVelo, category: catMint, flavor: 'Wintergreen', strengthMg: 4, price: 13.49, type: 'mint' },
      { name: 'VELO Creamy Vanilla 3mg', brand: brandVelo, category: catCoffee, flavor: 'Vanilla Cream', strengthMg: 3, price: 12.49, type: 'coffee' },
      { name: 'VELO Dragonfruit Ice 4mg', brand: brandVelo, category: catBerry, flavor: 'Dragonfruit', strengthMg: 4, price: 13.49, type: 'berry', isNewArrival: true },
      { name: 'VELO Arctic Peppermint 4mg', brand: brandVelo, category: catMint, flavor: 'Peppermint', strengthMg: 4, price: 13.49, type: 'mint' },

      // FRE (8 products)
      { name: 'FRE Mint Refresh 3mg', brand: brandFre, category: catMint, flavor: 'Mint', strengthMg: 3, price: 11.49, type: 'mint' },
      { name: 'FRE Mint Refresh 4mg', brand: brandFre, category: catMint, flavor: 'Mint', strengthMg: 4, price: 12.49, type: 'mint', isBestSeller: true },
      { name: 'FRE Lush Berry 4mg', brand: brandFre, category: catBerry, flavor: 'Wild Berry', strengthMg: 4, price: 12.49, type: 'berry' },
      { name: 'FRE Citrus Zest 3mg', brand: brandFre, category: catCitrus, flavor: 'Citrus Zest', strengthMg: 3, price: 11.49, type: 'citrus' },
      { name: 'FRE Espresso Dark 4mg', brand: brandFre, category: catCoffee, flavor: 'Dark Roast Coffee', strengthMg: 4, price: 12.49, type: 'coffee', isFeatured: true },
      { name: 'FRE Sweet Cinnamon 4mg', brand: brandFre, category: catSpice, flavor: 'Cinnamon', strengthMg: 4, price: 12.49, type: 'spice' },
      { name: 'FRE Wintergreen Chill 4mg', brand: brandFre, category: catMint, flavor: 'Wintergreen', strengthMg: 4, price: 12.49, type: 'mint' },
      { name: 'FRE Mango Peach 4mg', brand: brandFre, category: catCitrus, flavor: 'Mango Peach', strengthMg: 4, price: 12.49, type: 'citrus', isNewArrival: true },

      // Bridge (8 products)
      { name: 'Bridge Spearmint Wave 3mg', brand: brandBridge, category: catMint, flavor: 'Spearmint', strengthMg: 3, price: 11.99, type: 'mint' },
      { name: 'Bridge Spearmint Wave 4mg', brand: brandBridge, category: catMint, flavor: 'Spearmint', strengthMg: 4, price: 12.99, type: 'mint' },
      { name: 'Bridge Citrus Surge 4mg', brand: brandBridge, category: catCitrus, flavor: 'Citrus Surge', strengthMg: 4, price: 12.99, type: 'citrus' },
      { name: 'Bridge Blackberry Freeze 4mg', brand: brandBridge, category: catBerry, flavor: 'Blackberry', strengthMg: 4, price: 12.99, type: 'berry', isNewArrival: true },
      { name: 'Bridge Mocha Blend 4mg', brand: brandBridge, category: catCoffee, flavor: 'Mocha Coffee', strengthMg: 4, price: 12.99, type: 'coffee' },
      { name: 'Bridge Spiced Apple 4mg', brand: brandBridge, category: catSpice, flavor: 'Apple Cinnamon', strengthMg: 4, price: 12.99, type: 'spice' },
      { name: 'Bridge Menthol Ice 4mg', brand: brandBridge, category: catMint, flavor: 'Menthol', strengthMg: 4, price: 12.99, type: 'mint', isBestSeller: true },
      { name: 'Bridge Raspberry Mint 4mg', brand: brandBridge, category: catBerry, flavor: 'Raspberry Mint', strengthMg: 4, price: 12.99, type: 'berry' },

      // Zone (5 products)
      { name: 'Zone Precision Mint 4mg', brand: brandZone, category: catMint, flavor: 'Precision Mint', strengthMg: 4, price: 13.99, type: 'mint', isFeatured: true },
      { name: 'Zone Citrus Fusion 4mg', brand: brandZone, category: catCitrus, flavor: 'Citrus Fusion', strengthMg: 4, price: 13.99, type: 'citrus' },
      { name: 'Zone Wild Grape 4mg', brand: brandZone, category: catBerry, flavor: 'Wild Grape', strengthMg: 4, price: 13.99, type: 'berry', isNewArrival: true },
      { name: 'Zone Roasted Espresso 4mg', brand: brandZone, category: catCoffee, flavor: 'Espresso', strengthMg: 4, price: 13.99, type: 'coffee' },
      { name: 'Zone Cinnamon Heat 4mg', brand: brandZone, category: catSpice, flavor: 'Cinnamon Heat', strengthMg: 4, price: 13.99, type: 'spice' },

      // White Fox (5 products)
      { name: 'White Fox Full Charge Mint 4mg', brand: brandFox, category: catMint, flavor: 'Full Charge Mint', strengthMg: 4, price: 14.49, type: 'mint', isFeatured: true, isBestSeller: true },
      { name: 'White Fox Black Edition 4mg', brand: brandFox, category: catMint, flavor: 'Dark Peppermint', strengthMg: 4, price: 14.49, type: 'mint' },
      { name: 'White Fox Double Mint 4mg', brand: brandFox, category: catMint, flavor: 'Double Mint', strengthMg: 4, price: 14.49, type: 'mint' },
      { name: 'White Fox Citrus Blossom 4mg', brand: brandFox, category: catCitrus, flavor: 'Citrus Blossom', strengthMg: 4, price: 14.49, type: 'citrus' },
      { name: 'White Fox Nordic Berries 4mg', brand: brandFox, category: catBerry, flavor: 'Nordic Berries', strengthMg: 4, price: 14.49, type: 'berry' },

      // On! (4 products)
      { name: 'On! Mint Mini 4mg', brand: brandOn, category: catMint, flavor: 'Mint', strengthMg: 4, price: 10.99, type: 'mint', isBestSeller: true },
      { name: 'On! Citrus Mini 4mg', brand: brandOn, category: catCitrus, flavor: 'Citrus', strengthMg: 4, price: 10.99, type: 'citrus' },
      { name: 'On! Coffee Mini 4mg', brand: brandOn, category: catCoffee, flavor: 'Coffee', strengthMg: 4, price: 10.99, type: 'coffee' },
      { name: 'On! Berry Mini 4mg', brand: brandOn, category: catBerry, flavor: 'Berry', strengthMg: 4, price: 10.99, type: 'berry' }
    ];

    const productsToInsert = rawProducts.map((p, index) => {
      const skuNum = (1001 + index).toString();
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const img = getRandomImg(p.type);

      return {
        name: p.name,
        slug,
        sku: `CP-${skuNum}`,
        description: `Canadian legal ${p.strengthMg}mg tobacco-free nicotine pouch. Manufactured under Health Canada NHP guidelines with ${p.flavor} flavor profile. 20 pouches per can.`,
        price: p.price,
        compareAtPrice: Number((p.price + 2.00).toFixed(2)),
        strengthMg: p.strengthMg,
        pouchesPerCan: 20,
        flavor: p.flavor,
        brand: p.brand._id,
        category: p.category._id,
        stock: Math.floor(30 + Math.random() * 120),
        images: [img],
        imageUrl: img,
        isFeatured: !!p.isFeatured,
        isNewArrival: !!p.isNewArrival,
        isBestSeller: !!p.isBestSeller,
        averageRating: Number((4.3 + Math.random() * 0.7).toFixed(1)),
        numReviews: Math.floor(8 + Math.random() * 65),
        warnings: MANDATORY_PRODUCT_WARNINGS
      };
    });

    await Product.insertMany(productsToInsert);
    console.log(`Successfully seeded ${productsToInsert.length} Nicotine Pouch Products!`);

    // 5. Seed Educational Compliance Blog Posts
    await BlogPost.create({
      title: 'Understanding Canadian Age Restrictions & Provincial Regulations for Nicotine Pouches',
      slug: 'understanding-canadian-nicotine-regulations',
      excerpt: 'A neutral breakdown of legal minimum purchasing ages across Canadian provinces from Ontario to British Columbia.',
      content: 'In Canada, adult consumer age verification is legally enforced at the provincial level. Provinces such as Alberta require a legal age of 18, whereas Ontario, British Columbia, and Manitoba enforce 19+, and Quebec requires 21+. Online retailers must enforce strict digital age validation prior to processing orders.',
      author: 'CanPouch Regulatory Affairs Unit',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop',
      tags: ['Compliance', 'Canadian Law', 'Age Gate'],
      isComplianceApproved: true
    });

    console.log('Seeded Educational Blog Posts.');
    console.log('Database seeding complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
