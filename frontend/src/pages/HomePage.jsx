import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import API from '../api/axios';
import {
  ShieldCheck, Truck, CreditCard, Zap, ArrowRight, Star, ChevronRight,
  Leaf, Award, Heart, Users, MapPin, BookOpen, CheckCircle2, Clock,
  Package, Globe, BadgeCheck
} from 'lucide-react';

// Category images
const CATEGORY_IMAGES = {
  'mint-menthol': '/images/pouch_mint.png',
  'citrus-fruit': '/images/pouch_citrus.png',
  'berry': '/images/pouch_berry.png',
  'coffee': '/images/pouch_coffee.png',
  'default': '/images/pouch_mint.png'
};

const HERO_IMAGE = '/images/pouch_hero.png';
const LIFESTYLE_IMAGE_1 = '/images/pouch_mint.png';
const LIFESTYLE_IMAGE_2 = '/images/pouch_citrus.png';
const LIFESTYLE_IMAGE_3 = '/images/pouch_berry.png';
const CTA_BG_IMAGE = '/images/pouch_hero.png';
const ABOUT_IMAGE = '/images/pouch_coffee.png';

const TESTIMONIALS = [
  {
    name: 'Michael T.',
    province: 'Ontario',
    rating: 5,
    comment: 'Great selection of Canadian-compliant pouches. Fast shipping to Toronto and the age verification was seamless.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sarah L.',
    province: 'British Columbia',
    rating: 5,
    comment: 'Love the mint flavors! Arrived in Vancouver in just 3 days. Very professional packaging with all the required health warnings.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'James R.',
    province: 'Alberta',
    rating: 4,
    comment: 'Finally a trustworthy Canadian source. The tax calculation was transparent and the product quality is excellent.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
  }
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Verify Your Age',
    desc: 'Complete provincial age verification (18+/19+/21+ depending on province) to access the platform.',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&auto=format&fit=crop&q=80'
  },
  {
    step: '02',
    title: 'Browse & Select',
    desc: 'Explore our curated catalog of Health Canada compliant nicotine pouches by flavor, strength, and brand.',
    icon: Package,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&auto=format&fit=crop&q=80'
  },
  {
    step: '03',
    title: 'Checkout Securely',
    desc: 'Pay with 256-bit encrypted checkout. Provincial tax is automatically calculated for your region.',
    icon: CreditCard,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&auto=format&fit=crop&q=80'
  },
  {
    step: '04',
    title: 'Fast Canada-Wide Delivery',
    desc: 'Receive your order via Canada Post with real-time tracking. Discreet, compliant packaging guaranteed.',
    icon: Truck,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&auto=format&fit=crop&q=80'
  }
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, newRes, catRes, brandRes] = await Promise.all([
          API.get('/products?isFeatured=true'),
          API.get('/products?isNewArrival=true'),
          API.get('/products/categories'),
          API.get('/products/brands')
        ]);
        setFeatured(featRes.data.data || []);
        setNewArrivals(newRes.data.data || []);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    };
    fetchData();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div>
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden min-h-[600px]">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Canadian landscape"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[11px] font-semibold mb-6 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Canadian Age-Verified & Tax Compliant Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Premium Nicotine{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Pouches
                </span>{' '}
                for Canadian Adults
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
                Canada's enterprise-grade platform for tobacco-free nicotine pouches. Featuring strict provincial age verification, automated tax calculation, and fast nationwide shipping.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/shop"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
                >
                  Browse Full Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/blog"
                  className="bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition"
                >
                  Learn More
                </Link>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 text-center">
                <div>
                  <p className="text-2xl font-extrabold text-white">50+</p>
                  <p className="text-[11px] text-slate-400">SKU Products</p>
                </div>
                <div className="w-px bg-slate-700" />
                <div>
                  <p className="text-2xl font-extrabold text-white">13</p>
                  <p className="text-[11px] text-slate-400">Provinces Served</p>
                </div>
                <div className="w-px bg-slate-700" />
                <div>
                  <p className="text-2xl font-extrabold text-white">4mg</p>
                  <p className="text-[11px] text-slate-400">Max Strength</p>
                </div>
                <div className="w-px bg-slate-700" />
                <div>
                  <p className="text-2xl font-extrabold text-white">100%</p>
                  <p className="text-[11px] text-slate-400">Compliant</p>
                </div>
              </div>
            </motion.div>

            {/* Hero visual - product showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-3xl blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&auto=format&fit=crop&q=80"
                        alt="Premium product"
                        className="w-full h-48 object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80"
                        alt="Fresh mint"
                        className="w-full h-32 object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&auto=format&fit=crop&q=80"
                        alt="Citrus flavors"
                        className="w-full h-32 object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
                      <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&auto=format&fit=crop&q=80"
                        alt="Quality products"
                        className="w-full h-48 object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== TRUST BADGES ===================== */}
      <section className="border-y border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: 'Age Verified', desc: 'Provincial compliance', color: 'text-cyan-400' },
              { icon: Truck, title: 'Canada-Wide', desc: 'Fast 2-5 day shipping', color: 'text-blue-400' },
              { icon: CreditCard, title: 'Secure Payment', desc: '256-bit encrypted', color: 'text-emerald-400' },
              { icon: Zap, title: 'Fresh Stock', desc: 'Always in-date', color: 'text-amber-400' }
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0">
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{badge.title}</p>
                  <p className="text-[11px] text-slate-400">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED CATEGORIES WITH IMAGES ===================== */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/20 text-cyan-400 text-[10px] font-semibold mb-3">
              <Leaf className="w-3 h-3" /> Flavor Profiles
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Shop by Category</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">Discover our curated flavor collections, from icy mint to refreshing citrus blends</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition duration-300 shadow-lg hover:shadow-cyan-500/5"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES['default']}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">{cat.name}</h3>
                      <p className="text-[11px] text-slate-300 mt-1">{cat.description || 'Explore this category'}</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                      Shop Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                    </span>
                    <span className="text-[10px] text-slate-500">Canadian Compliant</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===================== FEATURED PRODUCTS ===================== */}
      {featured.length > 0 && (
        <section className="bg-slate-900/30 border-y border-slate-800/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/20 text-amber-400 text-[10px] font-semibold mb-3">
                  <Star className="w-3 h-3 fill-amber-400" /> Best Sellers
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Products</h2>
                <p className="text-sm text-slate-400 mt-2">Handpicked best-selling pouches loved by Canadian adults</p>
              </motion.div>
              <Link to="/shop" className="hidden sm:flex text-xs text-cyan-400 hover:text-cyan-300 font-semibold items-center gap-1 transition">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-400 text-[10px] font-semibold mb-3">
            <CheckCircle2 className="w-3 h-3" /> Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">From age verification to doorstep delivery — your compliant ordering journey in 4 simple steps</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative"
            >
              <div className="rounded-2xl overflow-hidden bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition duration-300 h-full">
                <div className="relative h-40 overflow-hidden">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-extrabold text-xs">
                    {step.step}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== NEW ARRIVALS ===================== */}
      {newArrivals.length > 0 && (
        <section className="bg-slate-900/30 border-y border-slate-800/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold mb-3">
                  <Zap className="w-3 h-3" /> Just Landed
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">New Arrivals</h2>
                <p className="text-sm text-slate-400 mt-2">Latest additions to our Health Canada compliant catalog</p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== WHY CHOOSE CANPOUCH - LIFESTYLE SECTION ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img src={LIFESTYLE_IMAGE_1} alt="Shopping experience" className="w-full h-56 object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-cyan-500/20">
                  <img src={ABOUT_IMAGE} alt="Our team" className="w-full h-36 object-cover" />
                </div>
              </div>
              <div className="pt-8 space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img src={LIFESTYLE_IMAGE_2} alt="Premium packaging" className="w-full h-36 object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img src={LIFESTYLE_IMAGE_3} alt="Quality assurance" className="w-full h-56 object-cover" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/20 text-cyan-400 text-[10px] font-semibold mb-4">
              <Award className="w-3 h-3" /> Why Choose CanPouch
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Canada's Most Trusted Nicotine Pouch Platform</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              We're not just another retailer. CanPouch.ca is built from the ground up as an enterprise-grade, compliance-first platform that puts Canadian regulations, consumer safety, and product quality above everything else.
            </p>

            <div className="space-y-5">
              {[
                { icon: ShieldCheck, title: 'Health Canada Compliant', desc: 'All products verified under the 4mg/pouch NHP regulation framework.' },
                { icon: Globe, title: '13 Provinces & Territories', desc: 'Provincial-specific age gates (18+/19+/21+) with automated tax rates for GST, PST, HST.' },
                { icon: BadgeCheck, title: 'Licensed Brands Only', desc: 'We carry only licensed, lab-verified nicotine pouch manufacturers.' },
                { icon: Heart, title: 'Customer-First Approach', desc: 'Secure checkout, real-time Canada Post tracking, and responsive support.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== CUSTOMER TESTIMONIALS ===================== */}
      <section className="bg-slate-900/40 border-y border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/20 text-amber-400 text-[10px] font-semibold mb-3">
              <Users className="w-3 h-3" /> Verified Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">What Canadian Adults Are Saying</h2>
            <p className="text-sm text-slate-400 mt-2">Real feedback from verified, age-authenticated customers across Canada</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition duration-300 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">"{t.comment}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/30" />
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t.province}, Canada
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BRANDS WITH LOGOS ===================== */}
      {brands.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white">Trusted Licensed Brands</h2>
              <p className="text-xs text-slate-400 mt-1">Only Health Canada approved nicotine pouch manufacturers</p>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-5">
              {brands.map((brand, i) => (
                <motion.div
                  key={brand._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/shop?brand=${brand.slug}`}
                    className="group flex flex-col items-center justify-center px-8 py-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition min-w-[160px] shadow-lg hover:shadow-cyan-500/5"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center mb-3">
                      <span className="text-xl font-extrabold text-cyan-400">{brand.name?.[0]}</span>
                    </div>
                    <p className="text-base font-bold text-white group-hover:text-cyan-400 transition">{brand.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{brand.description || 'View collection'}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== EDUCATIONAL / BLOG PREVIEW ===================== */}
      <section className="bg-slate-900/30 border-y border-slate-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-400 text-[10px] font-semibold mb-3">
                <BookOpen className="w-3 h-3" /> Educational Content
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Regulatory Knowledge Hub</h2>
              <p className="text-sm text-slate-400 mt-2">Factual, non-medical educational articles on Canadian nicotine pouch regulations</p>
            </motion.div>
            <Link to="/blog" className="hidden sm:flex text-xs text-cyan-400 hover:text-cyan-300 font-semibold items-center gap-1 transition">
              All Articles <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Understanding Health Canada\'s 4mg Nicotine Limit',
                excerpt: 'A comprehensive guide to the federal regulation governing maximum nicotine strength in pouches sold across Canadian provinces.',
                image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&auto=format&fit=crop&q=80',
                date: 'Jul 15, 2026'
              },
              {
                title: 'Provincial Age Verification Requirements Explained',
                excerpt: 'Each province has different minimum age requirements. Learn about ON (19+), AB (18+), BC (19+), and QC (21+) regulations.',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=80',
                date: 'Jul 10, 2026'
              },
              {
                title: 'How Canadian Excise Tax Applies to Nicotine Products',
                excerpt: 'Understanding GST, PST, HST and how they are calculated differently across provinces for nicotine pouch purchases.',
                image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop&q=80',
                date: 'Jul 5, 2026'
              }
            ].map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link to="/blog" className="group block rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition shadow-lg">
                  <div className="relative h-44 overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] text-cyan-400 font-semibold bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 inline mr-1" />{article.date}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition mb-2">{article.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{article.excerpt}</p>
                    <span className="mt-3 inline-flex text-[11px] text-cyan-400 font-semibold items-center gap-1">
                      Read Article <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== NEWSLETTER / CTA ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative rounded-3xl overflow-hidden">
          <img src={CTA_BG_IMAGE} alt="Canadian landscape" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-cyan-950/80" />
          <div className="relative p-8 sm:p-14 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-[10px] font-semibold mb-4">
                <Leaf className="w-3 h-3" /> Join 5,000+ Verified Canadian Adults
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Ready to Explore Premium Pouches?</h2>
              <p className="text-sm text-slate-300 mb-8 max-w-lg mx-auto">
                Browse our complete selection of tobacco-free nicotine pouches. All orders are age-verified with provincial tax automatically calculated.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-10 py-4 rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 hover:-translate-y-0.5"
                >
                  Shop All Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-bold px-10 py-4 rounded-xl text-sm transition hover:bg-white/20"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
