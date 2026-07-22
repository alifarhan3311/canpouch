import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { BookOpen, Plus, Edit2, Trash2, X, ShieldCheck } from 'lucide-react';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'CanPouch Educational Team',
    tags: 'Regulations, Health Canada',
    isComplianceApproved: true
  });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/blog');
      setPosts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'CanPouch Educational Team',
      tags: 'Regulations, Health Canada',
      isComplianceApproved: true
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'CanPouch Educational Team',
      tags: post.tags ? post.tags.join(', ') : '',
      isComplianceApproved: post.isComplianceApproved !== false
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim())
      };
      if (editingPost) {
        await API.put(`/admin/blog/${editingPost._id}`, payload);
      } else {
        await API.post('/admin/blog', payload);
      }
      setShowModal(false);
      fetchPosts();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save blog post');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete blog article?')) return;
    try {
      await API.delete(`/admin/blog/${id}`);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Educational Blog Management
          </h1>
          <p className="text-xs text-slate-400">Publish compliance-verified educational articles on Canadian pouch regulations</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          Create Blog Post
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading blog posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No blog posts found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Author</th>
                <th className="p-3.5">Compliance Status</th>
                <th className="p-3.5">Published Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {posts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-white max-w-sm truncate">{p.title}</td>
                  <td className="p-3.5 text-slate-400">{p.author}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
                      <ShieldCheck className="w-3 h-3" /> Approved
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-3.5 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(p)} className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg bg-slate-800 text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">{editingPost ? 'Edit Blog Post' : 'Create Blog Post'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {errorMsg && <div className="p-3 bg-red-950 text-red-200 text-xs rounded-lg">{errorMsg}</div>}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Understanding Health Canada 4mg Nicotine Pouch Limits"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Short Excerpt</label>
                <textarea
                  rows="2"
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Article Content</label>
                <textarea
                  rows="5"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-cyan-600 text-white font-bold rounded-lg">Save Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
