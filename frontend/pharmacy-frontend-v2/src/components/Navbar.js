import React from 'react';
import { FaBell, FaSearch, FaUserMd } from 'react-icons/fa';

const Navbar = ({ expiringCount }) => {
  return (
    <div style={styles.navbar}>
      <div style={styles.searchBox}>
        <FaSearch style={styles.searchIcon} />
        <input style={styles.searchInput} placeholder="Search medicines, suppliers..." />
      </div>
      <div style={styles.right}>
        <div style={styles.bellWrapper}>
          <FaBell style={styles.bell} />
          {expiringCount > 0 && (
            <span style={styles.badge} className="blink">{expiringCount}</span>
          )}
        </div>
        <div style={styles.userBox}>
          <FaUserMd style={styles.userIcon} />
          <div>
            <div style={styles.userName}>Pharmacist</div>
            <div style={styles.userRole}>Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  navbar: { height: '70px', background: 'white', borderBottom: '1px solid #e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 99 },
  searchBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f0faf4', border: '1px solid #c8e6c9', borderRadius: '12px', padding: '10px 18px', width: '350px' },
  searchIcon: { color: '#66bb6a', fontSize: '14px' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#2e7d32', width: '100%' },
  right: { display: 'flex', alignItems: 'center', gap: '20px' },
  bellWrapper: { position: 'relative', cursor: 'pointer' },
  bell: { fontSize: '20px', color: '#2e7d32' },
  badge: { position: 'absolute', top: '-8px', right: '-8px', background: '#e53935', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
  userBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f0faf4', border: '1px solid #c8e6c9', borderRadius: '12px', padding: '8px 15px', cursor: 'pointer' },
  userIcon: { fontSize: '22px', color: '#2e7d32' },
  userName: { fontSize: '13px', fontWeight: '700', color: '#1b5e20' },
  userRole: { fontSize: '11px', color: '#66bb6a' },
};

export default Navbar;