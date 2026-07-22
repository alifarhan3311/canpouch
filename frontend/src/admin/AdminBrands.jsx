import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Tag, Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', logo: '', isActive: true });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/brands');
      setBrands(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setFormData({ name: '', description: '', logo: '', isActive: true });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEditModal = (brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name || '', description: brand.description || '', logo: brand.logo || '', isActive: brand.isActive });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await API.put(`/admin/brands/${editingBrand._id}`, formData);
      } else {
        await API.post('/admin/brands', formData);
      }
      setShowModal(false);
      fetchBrands();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete brand?')) return;
    try {
      await API.delete(`/admin/brands/${id}`);
      fetchBrands();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-cyan-400" />
            Brand Management
          </h1>
          <p className="text-xs text-slate-400">Manage licensed pouch manufacturer brands</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading brands...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="p-3.5">Brand Name</th>
                <th className="p-3.5">Slug</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {brands.map((b) => (
                <tr key={b._id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    {b.logo && <img src={b.logo} alt={b.name} className="w-6 h-6 rounded-md object-cover bg-slate-950" />}
                    <span>{b.name}</span>
                  </td>
                  <td className="p-3.5 font-mono text-cyan-400">{b.slug}</td>
                  <td className="p-3.5 text-slate-400 max-w-xs truncate">{b.description || '-'}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                      {b.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button onClick={() => handleOpenEditModal(b)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(b._id)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400">
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
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {errorMsg && <div className="p-3 bg-red-950 text-red-200 text-xs rounded-lg">{errorMsg}</div>}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ZYN / Velo / Zone"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;
