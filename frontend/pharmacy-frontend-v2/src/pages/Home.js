import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMedicines, getExpiringMedicines, getAllSuppliers } from '../services/api';
import { FaPills, FaExclamationTriangle, FaTruck, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { getExpiryAnalytics } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAllMedicines().then((res) => setMedicines(res.data.data));
    getExpiringMedicines().then((res) => setExpiring(res.data.data));
    getAllSuppliers().then((res) => setSuppliers(res.data.data));
    getExpiryAnalytics().then((res) => setAnalytics(res.data.data));
  }, []);

  const getDaysLeft = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

  const stats = [
    { label: 'Total Medicines', value: medicines.length, icon: <FaPills />, color: '#2e7d32', bg: '#e8f5e9', path: '/medicines' },
    { label: 'Expiring Soon', value: expiring.length, icon: <FaExclamationTriangle />, color: '#c62828', bg: '#ffebee', path: '/expiring' },
    { label: 'Total Suppliers', value: suppliers.length, icon: <FaTruck />, color: '#1565c0', bg: '#e3f2fd', path: '/suppliers' },
    { label: 'Healthy Stock', value: medicines.length - expiring.length, icon: <FaCheckCircle />, color: '#00695c', bg: '#e0f2f1', path: '/medicines' },
  ];

  return (
    <div className="fade-in">
      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>🏥 Pharmacy Inventory System</div>
          <h1 style={styles.heroTitle}>MediStock <span style={styles.heroGreen}>Refinne</span> Edition</h1>
          <p style={styles.heroDesc}>Manage your pharmacy inventory efficiently. Track medicines, monitor expiry dates, and handle suppliers all in one place.</p>
          <div style={styles.heroBtns}>
            <button style={styles.primaryBtn} onClick={() => navigate('/medicines')}>💊 View Medicines <FaArrowRight /></button>
            <button style={styles.secondaryBtn} onClick={() => navigate('/expiring')}>⚠️ Check Expiring</button>
          </div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardIcon}>💊</div>
            <div style={styles.heroCardText}>Smart Inventory</div>
            <div style={styles.heroCardSub}>Real-time tracking</div>
          </div>
        </div>
      </div>

      {/* EXPIRY ALERT */}
      {expiring.length > 0 && (
        <div style={styles.alertBox} className="pulse">
          <div style={styles.alertHeader}>
            <div style={styles.alertLeft}>
              <span style={styles.alertDot} />
              <span style={styles.alertTitle}>🚨 EXPIRY ALERT — {expiring.length} Medicine(s) Need Attention!</span>
            </div>
            <button style={styles.alertBtn} onClick={() => navigate('/expiring')}>View All <FaArrowRight /></button>
          </div>
          <div style={styles.alertGrid}>
            {expiring.map((med) => {
              const days = getDaysLeft(med.expiryDate);
              return (
                <div key={med._id} style={styles.alertCard}>
                  <div style={styles.alertMed}>💊 {med.name}</div>
                  <div style={styles.alertBrand}>{med.brand}</div>
                  <div style={{ ...styles.alertDays, color: days <= 7 ? '#c62828' : '#e65100' }}>
                    ⏰ {days} days left
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STATS */}
      <div style={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} style={{ ...styles.statCard, background: s.bg, borderLeft: `4px solid ${s.color}` }} onClick={() => navigate(s.path)}>
            <div style={{ ...styles.statIcon, color: s.color, background: 'white' }}>{s.icon}</div>
            <div>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
            <FaArrowRight style={{ ...styles.statArrow, color: s.color }} />
          </div>
        ))}
      </div>

      {/* RECENT MEDICINES */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>📋 Recent Inventory</h2>
          <button style={styles.viewAllBtn} onClick={() => navigate('/medicines')}>View All →</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={styles.thead}>
              {['Medicine', 'Brand', 'Category', 'Qty', 'Price', 'Expiry', 'Status'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {medicines.slice(0, 5).map((med) => {
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
  hero: { background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', borderRadius: '20px', padding: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', color: 'white' },
  heroLeft: { maxWidth: '550px' },
  heroBadge: { background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '50px', fontSize: '13px', display: 'inline-block', marginBottom: '15px' },
  heroTitle: { fontSize: '42px', fontWeight: '800', marginBottom: '15px', lineHeight: 1.2 },
  heroGreen: { color: '#a5d6a7' },
  heroDesc: { color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.7, marginBottom: '25px' },
  heroBtns: { display: 'flex', gap: '15px' },
  primaryBtn: { background: 'white', color: '#1b5e20', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
  secondaryBtn: { background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  heroRight: { display: 'flex', gap: '15px' },
  heroCard: { background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '30px', textAlign: 'center', backdropFilter: 'blur(10px)' },
  heroCardIcon: { fontSize: '48px', marginBottom: '10px' },
  heroCardText: { fontWeight: '700', fontSize: '16px' },
  heroCardSub: { color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' },
  alertBox: { background: '#ffebee', border: '2px solid #ef9a9a', borderRadius: '16px', padding: '25px', marginBottom: '25px' },
  alertHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  alertLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  alertDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#c62828', display: 'inline-block' },
  alertTitle: { fontWeight: '700', color: '#c62828', fontSize: '16px' },
  alertBtn: { background: '#c62828', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' },
  alertGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' },
  alertCard: { background: 'white', borderRadius: '10px', padding: '15px', border: '1px solid #ffcdd2' },
  alertMed: { fontWeight: '700', color: '#1a2e1a', marginBottom: '4px' },
  alertBrand: { color: '#666', fontSize: '12px', marginBottom: '8px' },
  alertDays: { fontWeight: '700', fontSize: '13px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '15px', marginBottom: '25px' },
  statCard: { borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  statIcon: { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexShrink: 0 },
  statValue: { fontSize: '32px', fontWeight: '800', lineHeight: 1 },
  statLabel: { fontSize: '13px', color: '#666', marginTop: '4px' },
  statArrow: { marginLeft: 'auto', fontSize: '16px' },
  tableCard: { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid #e8f5e9' },
  tableTitle: { fontSize: '18px', fontWeight: '700', color: '#1b5e20' },
  viewAllBtn: { background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  thead: { background: '#f1f8e9' },
  th: { padding: '12px 18px', color: '#2e7d32', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #f0faf4' },
  td: { padding: '14px 18px', color: '#444', fontSize: '14px' },
  tdBold: { padding: '14px 18px', color: '#1a2e1a', fontWeight: '600', fontSize: '14px' },
  catBadge: { background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
};

export default Home;