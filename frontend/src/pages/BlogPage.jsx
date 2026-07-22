import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { BookOpen, ShieldCheck, Clock, ArrowRight, User, Tag } from 'lucide-react';

const BLOG_IMAGES = [
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'
];

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await API.get('/blogs');
        setPosts(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden mb-14">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80"
          alt="Educational resources"
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 backdrop-blur border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Factual & Compliant Educational Content
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Educational Articles & Regulatory News</h1>
            <p className="text-sm text-slate-300">Strictly neutral, non-medical information on Canadian nicotine pouch regulations, provincial compliance, and industry updates.</p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <BookOpen className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Articles Published Yet</h3>
          <p className="text-xs text-slate-400">Educational articles will appear here once published by the compliance team.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <div key={post._id} className="group rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition duration-300 shadow-lg flex flex-col">
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image || BLOG_IMAGES[i % BLOG_IMAGES.length]}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] text-white bg-slate-900/70 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                {post.isComplianceApproved && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[9px] text-cyan-400 bg-cyan-950/80 backdrop-blur border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map((tag, ti) => (
                      <span key={ti} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-0.5">
                        <Tag className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-base font-bold text-white group-hover:text-cyan-400 transition mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">{post.excerpt || post.content?.substring(0, 150)}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                      {post.author?.[0] || 'C'}
                    </div>
                    <span className="text-[11px] text-slate-300 font-medium">{post.author || 'CanPouch Team'}</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Info Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {[
          {
            image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&auto=format&fit=crop&q=80',
            title: 'Compliance Reviewed',
            desc: 'Every article is reviewed by our compliance team to ensure no prohibited health claims are made.'
          },
          {
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
            title: 'Fact-Based Only',
            desc: 'We provide factual regulatory information only. No medical advice or therapeutic claims are published.'
          },
          {
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=80',
            title: 'Regular Updates',
            desc: 'Stay informed about changes to Canadian nicotine pouch regulations as they are announced.'
          }
        ].map((card, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800">
            <img src={card.image} alt={card.title} className="w-full h-32 object-cover" />
            <div className="p-5">
              <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
