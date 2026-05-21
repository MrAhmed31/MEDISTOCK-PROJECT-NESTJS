import React, { useEffect, useState } from 'react';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', contact: '', email: '', medicine_name: '', supply_date: '', quantity: '' });

  const fetch = () => getAllSuppliers().then((res) => setSuppliers(res.data.data));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    if (editingId) await updateSupplier(editingId, form);
    else await createSupplier(form);
    setForm({ name: '', contact: '', email: '', medicine_name: '', supply_date: '', quantity: '' });
    setShowForm(false); setEditingId(null); fetch();
  };

  const handleEdit = (sup) => {
    setForm({ name: sup.name, contact: sup.contact, email: sup.email, medicine_name: sup.medicine_name, supply_date: sup.supply_date?.split('T')[0], quantity: sup.quantity });
    setEditingId(sup.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this supplier?')) { await deleteSupplier(id); fetch(); }
  };

  const fields = [
    { key: 'name', label: 'Supplier Name' }, { key: 'contact', label: 'Contact' },
    { key: 'email', label: 'Email' }, { key: 'medicine_name', label: 'Medicine Name' },
    { key: 'quantity', label: 'Quantity' },
  ];

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏭 Suppliers</h1>
          <p style={styles.subtitle}>{suppliers.length} suppliers registered</p>
        </div>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', contact: '', email: '', medicine_name: '', supply_date: '', quantity: '' }); }}>
          {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Supplier</>}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{editingId ? '✏️ Edit Supplier' : '➕ Add New Supplier'}</h2>
          <div style={styles.formGrid}>
            {fields.map(({ key, label }) => (
              <div key={key} style={styles.inputGroup}>
                <label style={styles.label}>{label}</label>
                <input style={styles.input} placeholder={label} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Supply Date</label>
              <input style={styles.input} type="date" value={form.supply_date} onChange={(e) => setForm({ ...form, supply_date: e.target.value })} />
            </div>
          </div>
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {editingId ? '✅ Update' : '✅ Save Supplier'}
          </button>
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={styles.thead}>
              {['Supplier', 'Contact', 'Email', 'Medicine', 'Supply Date', 'Qty', 'Actions'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((sup) => (
              <tr key={sup.id} style={styles.tr}>
                <td style={styles.tdBold}>{sup.name}</td>
                <td style={styles.td}>{sup.contact}</td>
                <td style={styles.td}>{sup.email}</td>
                <td style={styles.td}><span style={styles.medBadge}>{sup.medicine_name}</span></td>
                <td style={styles.td}>{new Date(sup.supply_date).toLocaleDateString()}</td>
                <td style={styles.td}>{sup.quantity}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(sup)}><FaEdit /></button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(sup.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
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
  thead: { background: '#f1f8e9' },
  th: { padding: '12px 18px', color: '#2e7d32', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #f0faf4' },
  td: { padding: '13px 18px', color: '#444', fontSize: '14px' },
  tdBold: { padding: '13px 18px', color: '#1a2e1a', fontWeight: '600', fontSize: '14px' },
  medBadge: { background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  editBtn: { background: '#e3f2fd', color: '#1565c0', border: 'none', padding: '7px 11px', borderRadius: '8px', cursor: 'pointer', marginRight: '6px' },
  deleteBtn: { background: '#ffebee', color: '#c62828', border: 'none', padding: '7px 11px', borderRadius: '8px', cursor: 'pointer' },
};

export default Suppliers;