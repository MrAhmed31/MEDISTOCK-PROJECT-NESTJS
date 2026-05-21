import React, { useEffect, useState } from 'react';
import {
  getExpiryAnalytics, getExpiringWeek, getExpiringMonth,
  getExpiringYear, getExpired, getHealthyStock
} from '../services/api';
import { FaArrowRight } from 'react-icons/fa';

const Expiring = () => {
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('week');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getExpiryAnalytics().then((res) => setAnalytics(res.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const apiMap = {
      week: getExpiringWeek,
      month: getExpiringMonth,
      year: getExpiringYear,
      expired: getExpired,
      healthy: getHealthyStock,
    };
    apiMap[activeTab]().then((res) => {
      setData(res.data.data);
      setLoading(false);
    });
  }, [activeTab]);

  const tabs = [
    { key: 'week', label: 'This Week', color: '#e65100', bg: '#fff3e0', icon: '🟠' },
    { key: 'month', label: 'This Month', color: '#f9a825', bg: '#fffde7', icon: '🟡' },
    { key: 'year', label: 'This Year', color: '#1565c0', bg: '#e3f2fd', icon: '🔵' },
    { key: 'expired', label: 'Expired', color: '#c62828', bg: '#ffebee', icon: '🔴' },
    { key: 'healthy', label: 'Healthy', color: '#2e7d32', bg: '#e8f5e9', icon: '🟢' },
  ];

  const colorMap = {
    red: '#c62828', orange: '#e65100',
    yellow: '#f9a825', blue: '#1565c0', green: '#2e7d32',
  };

  const activeTabData = tabs.find(t => t.key === activeTab);

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <h1 style={styles.title}>⚠️ Advanced Expiry Tracking</h1>
        <p style={styles.subtitle}>Complete medicine expiry analysis and categorization</p>
      </div>

      {/* ANALYTICS CARDS */}
      {analytics && (
        <div style={styles.analyticsGrid}>
          {[
            { label: 'This Week', value: analytics.weekly, color: '#e65100', bg: '#fff3e0', icon: '🟠' },
            { label: 'This Month', value: analytics.monthly, color: '#f9a825', bg: '#fffde7', icon: '🟡' },
            { label: 'This Year', value: analytics.yearly, color: '#1565c0', bg: '#e3f2fd', icon: '🔵' },
            { label: 'Expired', value: analytics.expired, color: '#c62828', bg: '#ffebee', icon: '🔴' },
            { label: 'Healthy', value: analytics.healthy, color: '#2e7d32', bg: '#e8f5e9', icon: '🟢' },
          ].map((card, i) => (
            <div key={i} style={{ ...styles.analyticsCard, background: card.bg, borderTop: `4px solid ${card.color}` }}>
              <div style={styles.analyticsIcon}>{card.icon}</div>
              <div style={{ ...styles.analyticsValue, color: card.color }}>{card.value}</div>
              <div style={styles.analyticsLabel}>{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* NEAREST EXPIRY */}
      {analytics?.nearestExpiry && (
        <div style={styles.nearestCard}>
          <div style={styles.nearestLeft}>
            <div style={styles.nearestBadge}>⚡ NEXT TO EXPIRE</div>
            <div style={styles.nearestMed}>{analytics.nearestExpiry.name}</div>
            <div style={styles.nearestBrand}>{analytics.nearestExpiry.brand}</div>
          </div>
          <div style={styles.timeGrid}>
            {[
              { value: analytics.nearestExpiry.timeLeft.daysLeft, label: 'Days' },
              { value: analytics.nearestExpiry.timeLeft.weeksLeft, label: 'Weeks' },
              { value: analytics.nearestExpiry.timeLeft.monthsLeft, label: 'Months' },
              { value: analytics.nearestExpiry.timeLeft.yearsLeft, label: 'Years' },
            ].map((t, i) => (
              <div key={i} style={styles.timeBox}>
                <div style={styles.timeValue}>{t.value}</div>
                <div style={styles.timeLabel}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROGRESS BARS */}
      {analytics && (
        <div style={styles.progressCard}>
          <h3 style={styles.progressTitle}>📊 Inventory Health</h3>
          {[
            { label: 'Healthy Stock', value: analytics.percentages.healthy, color: '#2e7d32' },
            { label: 'At Risk This Week', value: analytics.percentages.atRisk, color: '#e65100' },
            { label: 'Expired', value: analytics.percentages.expired, color: '#c62828' },
          ].map((item, i) => (
            <div key={i} style={styles.progressItem}>
              <div style={styles.progressRow}>
                <span style={styles.progressLabel}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: '700' }}>{item.value}%</span>
              </div>
              <div style={styles.progressBg}>
                <div style={{ ...styles.progressFill, width: `${item.value}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABS */}
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? {
                background: tab.bg,
                color: tab.color,
                border: `2px solid ${tab.color}`,
                fontWeight: '700',
              } : {})
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
            {analytics && (
              <span style={{ ...styles.tabCount, background: tab.color }}>
                {tab.key === 'week' ? analytics.weekly :
                 tab.key === 'month' ? analytics.monthly :
                 tab.key === 'year' ? analytics.yearly :
                 tab.key === 'expired' ? analytics.expired :
                 analytics.healthy}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* MEDICINES GRID */}
      {loading ? (
        <div style={styles.loading}>⏳ Loading medicines...</div>
      ) : data.length === 0 ? (
        <div style={styles.empty}>✅ No medicines in this category!</div>
      ) : (
        <div style={styles.grid}>
          {data.map((med) => {
            const color = colorMap[med.timeLeft?.color] || '#2e7d32';
            return (
              <div key={med._id} style={{ ...styles.medCard, borderLeft: `4px solid ${color}` }}>
                <div style={styles.medHeader}>
                  <div style={styles.medName}>💊 {med.name}</div>
                  <div style={{ ...styles.medBadge, background: `${color}15`, color, border: `1px solid ${color}` }}>
                    {med.timeLeft?.status?.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                <div style={styles.medBrand}>{med.brand} • {med.category}</div>

                {/* TIME BOXES */}
                <div style={styles.timeRow}>
                  {[
                    { value: med.timeLeft?.daysLeft, label: 'Days' },
                    { value: med.timeLeft?.weeksLeft, label: 'Weeks' },
                    { value: med.timeLeft?.monthsLeft, label: 'Months' },
                    { value: med.timeLeft?.yearsLeft, label: 'Years' },
                  ].map((t, i) => (
                    <div key={i} style={{ ...styles.timeBox2, borderColor: color }}>
                      <div style={{ ...styles.timeVal, color }}>{t.value}</div>
                      <div style={styles.timeLab}>{t.label}</div>
                    </div>
                  ))}
                </div>

                <div style={styles.medFooter}>
                  <span>📦 {med.quantity} units</span>
                  <span>💰 Rs. {med.price}</span>
                  <span>📅 {new Date(med.expiryDate).toLocaleDateString()}</span>
                </div>

                {/* PROGRESS BAR */}
                <div style={styles.barBg}>
                  <div style={{
                    ...styles.barFill,
                    width: `${Math.min(Math.max((365 - (med.timeLeft?.daysLeft || 0)) / 365 * 100, 0), 100)}%`,
                    background: color
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: { marginBottom: '25px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1b5e20' },
  subtitle: { color: '#666', fontSize: '14px', marginTop: '4px' },
  analyticsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '15px', marginBottom: '20px' },
  analyticsCard: { borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  analyticsIcon: { fontSize: '28px', marginBottom: '8px' },
  analyticsValue: { fontSize: '36px', fontWeight: '900', lineHeight: 1 },
  analyticsLabel: { color: '#666', fontSize: '12px', marginTop: '6px', fontWeight: '600' },
  nearestCard: { background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', borderRadius: '16px', padding: '25px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },
  nearestLeft: {},
  nearestBadge: { background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', display: 'inline-block', marginBottom: '10px' },
  nearestMed: { fontSize: '22px', fontWeight: '800' },
  nearestBrand: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '4px' },
  timeGrid: { display: 'flex', gap: '12px' },
  timeBox: { background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 16px', textAlign: 'center', minWidth: '70px' },
  timeValue: { fontSize: '28px', fontWeight: '900', color: '#a5d6a7' },
  timeLabel: { color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '4px' },
  progressCard: { background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e8f5e9' },
  progressTitle: { color: '#1b5e20', fontWeight: '700', marginBottom: '15px', fontSize: '16px' },
  progressItem: { marginBottom: '15px' },
  progressRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  progressLabel: { color: '#444', fontSize: '13px' },
  progressBg: { background: '#f0faf4', borderRadius: '50px', height: '8px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '50px', transition: 'width 1s ease' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: { background: 'white', border: '2px solid #e8f5e9', color: '#666', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' },
  tabCount: { color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' },
  loading: { textAlign: 'center', padding: '50px', color: '#666', fontSize: '16px' },
  empty: { background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#2e7d32', fontSize: '16px', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' },
  medCard: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0faf4' },
  medHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' },
  medName: { fontWeight: '700', color: '#1a2e1a', fontSize: '15px' },
  medBadge: { padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700' },
  medBrand: { color: '#888', fontSize: '12px', marginBottom: '15px' },
  timeRow: { display: 'flex', gap: '8px', marginBottom: '15px' },
  timeBox2: { flex: 1, border: '1px solid', borderRadius: '8px', padding: '8px', textAlign: 'center' },
  timeVal: { fontSize: '20px', fontWeight: '800', lineHeight: 1 },
  timeLab: { color: '#888', fontSize: '10px', marginTop: '3px' },
  medFooter: { display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '11px', marginBottom: '12px' },
  barBg: { background: '#f0faf4', borderRadius: '50px', height: '4px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '50px', transition: 'width 1s ease' },
};

export default Expiring;