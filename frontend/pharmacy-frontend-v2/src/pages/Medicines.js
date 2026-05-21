import React, { useEffect, useState } from 'react';
import { getAllMedicines, createMedicine, updateMedicine, deleteMedicine } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', brand: '', category: '', quantity: '', price: '', expiryDate: '', description: '' });

  const fetch = () => getAllMedicines().then((res) => setMedicines(res.data.data));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    if (editingId) await updateMedicine(editingId, form);
    else await createMedicine(form);
    setForm({ name: '', brand: '', category: '', quantity: '', price: '', expiryDate: '', description: '' });
    setShowForm(false); setEditingId(null); fetch();
  };

  const handleEdit = (med) => {
    setForm({ name: med.name, brand: med.brand, category: med.category, quantity: med.quantity, price: med.price, expiryDate: med.expiryDate?.split('T')[0], description: med.description });
    setEditingId(med._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this medicine?')) { await deleteMedicine(id); fetch(); }
  };

  const getDaysLeft = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.brand.toLowerCase().includes(search.toLowerCase())
  );

  const fields = [
    { key: 'name', label: 'Medicine Name' }, { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' }, { key: 'quantity', label: 'Quantity' },
    { key: 'price', label: 'Price (Rs.)' }, { key: 'description', label: 'Description' },
  ];

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💊 Medicines</h1>
          <p style={styles.subtitle}>{medicines.length} medicines in inventory</p>
        </div>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', brand: '', category: '', quantity: '', price: '', expiryDate: '', description: '' }); }}>
          {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Medicine</>}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{editingId ? '✏️ Edit Medicine' : '➕ Add New Medicine'}</h2>
          <div style={styles.formGrid}>
            {fields.map(({ key, label }) => (
              <div key={key} style={styles.inputGroup}>
                <label style={styles.label}>{label}</label>
                <input style={styles.input} placeholder={label} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Expiry Date</label>
              <input style={styles.input} type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            </div>
          </div>
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {editingId ? '✅ Update' : '✅ Save Medicine'}
          </button>
        </div>
      )}

      <div style={styles.tableCard}>
        <div style={styles.searchBar}>
          <input style={styles.searchInput} placeholder="🔍 Search medicines..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={styles.thead}>
              {['Medicine', 'Brand', 'Category', 'Qty', 'Price', 'Expiry', 'Status', 'Actions'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((med) => {
              const days = getDaysLeft(med.expiryDate);
              const isExpired = days < 0;
              const isExpiring = days <= 30;
              return (
                <tr key={med._id} style={styles.tr}>
                  <td style={styles.tdBold}>{med.name}</td>
                  <td style={styles.td}>{med.brand}</td>
                  <td style={styles.td}><span style={styles.catBadge}>{med.category}</span></td>
                  <td style={styles.td}>{med.quantity}</td>
                  <td style={styles.td}>Rs. {med.price}</td>
                  <td style={styles.td}>{new Date(med.expiryDate).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, background: isExpired ? '#ffebee' : isExpiring ? '#fff8e1' : '#e8f5e9', color: isExpired ? '#c62828' : isExpiring ? '#e65100' : '#2e7d32' }}>
                      {isExpired ? '🔴 Expired' : isExpiring ? '🟡 Expiring' : '🟢 Good'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(med)}><FaEdit /></button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(med._id)}><FaTrash /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1b5e20' },
  subtitle: { color: '#666', fontSize: '14px', marginTop: '4px' },
  addBtn: { background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: 'white', border: 'none', padding: '12px 22px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
  formCard: { background: 'white', borderRadius: '16px', padding: '25px', marginBottom: '20px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', border: '1px solid #c8e6c9' },
  formTitle: { color: '#2e7d32', marginBottom: '20px', fontSize: '18px', fontWeight: '700' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#2e7d32', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '11px 14px', borderRadius: '10px', border: '1px solid #c8e6c9', background: '#f9fbe7', color: '#1a2e1a', fontSize: '14px', outline: 'none' },
  submitBtn: { background: 'linear-gradient(135deg, #2e7d32, #43a047)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
  tableCard: { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  searchBar: { padding: '15px 20px', borderBottom: '1px solid #e8f5e9' },
  searchInput: { width: '100%', padding: '10px 15px', borderRadius: '10px', border: '1px solid #c8e6c9', background: '#f0faf4', fontSize: '14px', outline: 'none', color: '#1a2e1a' },
  thead: { background: '#f1f8e9' },
  th: { padding: '12px 18px', color: '#2e7d32', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #f0faf4', transition: 'background 0.2s' },
  td: { padding: '13px 18px', color: '#444', fontSize: '14px' },
  tdBold: { padding: '13px 18px', color: '#1a2e1a', fontWeight: '600', fontSize: '14px' },
  catBadge: { background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  editBtn: { background: '#e3f2fd', color: '#1565c0', border: 'none', padding: '7px 11px', borderRadius: '8px', cursor: 'pointer', marginRight: '6px' },
  deleteBtn: { background: '#ffebee', color: '#c62828', border: 'none', padding: '7px 11px', borderRadius: '8px', cursor: 'pointer' },
};

export default Medicines;