import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaPills, FaExclamationTriangle, FaTruck, FaHeartbeat } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const items = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/medicines', icon: <FaPills />, label: 'Medicines' },
    { path: '/expiring', icon: <FaExclamationTriangle />, label: 'Expiring' },
    { path: '/suppliers', icon: <FaTruck />, label: 'Suppliers' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <FaHeartbeat style={styles.logoIcon} />
        <div>
          <div style={styles.logoText}>MediStock</div>
          <div style={styles.logoSub}>Pharmacy System</div>
        </div>
      </div>

      <div style={styles.menu}>
        <div style={styles.menuLabel}>MAIN MENU</div>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{ ...styles.menuItem, ...(isActive ? styles.activeItem : {}) }}>
                <span style={{ ...styles.menuIcon, ...(isActive ? styles.activeIcon : {}) }}>
                  {item.icon}
                </span>
                <span style={{ ...styles.menuText, ...(isActive ? styles.activeText : {}) }}>
                  {item.label}
                </span>
                {isActive && <div style={styles.activeLine} />}
              </div>
            </Link>
          );
        })}
      </div>

      <div style={styles.sidebarFooter}>
        <div style={styles.footerCard}>
          <div style={styles.footerIcon}>💊</div>
          <div style={styles.footerText}>Pharmacy Manager</div>
          <div style={styles.footerSub}>v2.0 Green Edition</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: { width: '260px', minHeight: '100vh', background: 'linear-gradient(180deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 100, boxShadow: '4px 0 20px rgba(0,0,0,0.15)' },
  logo: { padding: '30px 25px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.15)' },
  logoIcon: { fontSize: '32px', color: '#a5d6a7' },
  logoText: { fontSize: '20px', fontWeight: '800', color: 'white' },
  logoSub: { fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' },
  menu: { flex: 1, padding: '25px 15px' },
  menuLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '2px', padding: '0 10px', marginBottom: '10px' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '12px', marginBottom: '5px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease' },
  activeItem: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' },
  menuIcon: { fontSize: '18px', color: 'rgba(255,255,255,0.6)', width: '20px' },
  activeIcon: { color: '#a5d6a7' },
  menuText: { fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.7)' },
  activeText: { color: 'white', fontWeight: '700' },
  activeLine: { position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '4px', height: '60%', background: '#a5d6a7', borderRadius: '2px' },
  sidebarFooter: { padding: '20px 15px' },
  footerCard: { background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', textAlign: 'center' },
  footerIcon: { fontSize: '28px', marginBottom: '8px' },
  footerText: { color: 'white', fontWeight: '700', fontSize: '13px' },
  footerSub: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '3px' },
};

export default Sidebar;