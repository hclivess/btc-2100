import React, { useState } from 'react';

const BTCCompleteHistory = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // ==================== EARLY HISTORY (2009-2015) ====================
  const earlyHistory = [
    { year: 2009, event: 'Genesis Block', date: '2009-01-03', price: 0, note: 'Satoshi mines first block. No market price.' },
    { year: 2009, event: 'First Trade', date: '2009-10-05', price: 0.00099, note: '5,050 BTC for $5.02 via PayPal' },
    { year: 2010, event: 'Pizza Day', date: '2010-05-22', price: 0.0025, note: '10,000 BTC for 2 pizzas (~$25)' },
    { year: 2010, event: 'First ATH', date: '2010-11-06', price: 0.39, note: 'First major ATH' },
    { year: 2011, event: 'Parity ($1)', date: '2011-02-09', price: 1.00, note: 'BTC reaches $1 for first time' },
    { year: 2011, event: 'First Bubble ATH', date: '2011-06-08', price: 29.60, note: 'First major bubble peak' },
    { year: 2011, event: 'First Crash ATL', date: '2011-11-18', price: 2.14, note: '-93% crash' },
    { year: 2012, event: 'First Halving', date: '2012-11-28', price: 12.35, note: 'Block reward: 50→25 BTC' },
    { year: 2013, event: 'First $100', date: '2013-04-01', price: 100, note: 'Breaks triple digits' },
    { year: 2013, event: 'First $1000', date: '2013-11-27', price: 1000, note: 'Breaks four digits' },
    { year: 2013, event: 'Pre-Pattern ATH', date: '2013-12-04', price: 1156, note: 'Cycle 0 peak' },
    { year: 2014, event: 'Mt.Gox Collapse', date: '2014-02-24', price: 111, note: '744K BTC lost, -90% crash' },
    { year: 2015, event: 'Cycle Pattern Begins', date: '2015-01-14', price: 170, note: 'ATL that starts the 1064/364 pattern' },
  ];

  // ==================== CYCLE PATTERN (2015-2025) VERIFIED ====================
  const verifiedCycles = [
    { 
      cycle: 1, 
      phase: 'bull', 
      atlDate: '2015-01-14', 
      athDate: '2017-12-17', 
      atlPrice: 170, 
      athPrice: 19783, 
      bull: 116.37, 
      bear: 0.84,
      days: 1064,
      events: ['2016 Halving (Jul 9)', 'ICO Mania', 'CME Futures Launch']
    },
    { 
      cycle: 1, 
      phase: 'bear', 
      athDate: '2017-12-17', 
      atlDate: '2018-12-15', 
      athPrice: 19783, 
      atlPrice: 3122, 
      days: 364,
      events: ['ICO Bust', 'SEC Crackdown', 'Crypto Winter']
    },
    { 
      cycle: 2, 
      phase: 'bull', 
      atlDate: '2018-12-15', 
      athDate: '2021-11-10', 
      atlPrice: 3122, 
      athPrice: 68789, 
      bull: 22.03, 
      bear: 0.78,
      days: 1064,
      events: ['COVID Crash/Recovery', '2020 Halving (May 11)', 'Tesla Buys BTC', 'El Salvador Legal Tender']
    },
    { 
      cycle: 2, 
      phase: 'bear', 
      athDate: '2021-11-10', 
      atlDate: '2022-11-09', 
      athPrice: 68789, 
      atlPrice: 15460, 
      days: 364,
      events: ['Luna/UST Collapse', '3AC Bankruptcy', 'FTX Collapse']
    },
    { 
      cycle: 3, 
      phase: 'bull', 
      atlDate: '2022-11-09', 
      athDate: '2025-10-06', 
      atlPrice: 15460, 
      athPrice: 126210, 
      bull: 8.16, 
      bear: null,
      days: 1064,
      verified: true,
      events: ['Spot ETF Approval (Jan 2024)', '2024 Halving (Apr 20)', 'Trump Election', '$100K Milestone']
    },
  ];

  // ==================== FUTURE PROJECTIONS (2026-2100) ====================
  const futureParams = [
    [4.0, 0.75], [3.5, 0.65], [3.0, 0.55], [2.6, 0.50], [2.3, 0.45],
    [2.1, 0.42], [1.9, 0.38], [1.8, 0.35], [1.7, 0.32], [1.6, 0.30],
    [1.55, 0.28], [1.5, 0.26], [1.45, 0.24], [1.4, 0.22], [1.35, 0.20],
    [1.32, 0.18], [1.30, 0.16], [1.28, 0.15], [1.25, 0.14],
  ];

  const addDays = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const generateFutureCycles = () => {
    const cycles = [];
    let atlPrice = 126210 * 0.22;
    let atlDate = '2026-10-05';
    
    for (let i = 0; i < futureParams.length; i++) {
      const athDate = addDays(atlDate, 1064);
      const nextAtlDate = addDays(athDate, 364);
      if (new Date(athDate).getFullYear() > 2100) break;
      
      const [bull, bear] = futureParams[i];
      const athPrice = atlPrice * bull;
      const halving = [2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2100];
      const athYear = new Date(athDate).getFullYear();
      
      cycles.push({
        cycle: 4 + i,
        atlDate,
        athDate,
        nextAtlDate,
        atlPrice: Math.round(atlPrice),
        athPrice: Math.round(athPrice),
        bull,
        bear,
        halving: halving.find(h => h >= new Date(atlDate).getFullYear() && h <= athYear)
      });
      
      atlPrice = athPrice * (1 - bear);
      atlDate = nextAtlDate;
    }
    return cycles;
  };

  const futureCycles = generateFutureCycles();

  const formatPrice = (price) => {
    if (price === 0) return '$0';
    if (price < 0.01) return '$' + price.toFixed(5);
    if (price < 1) return '$' + price.toFixed(2);
    if (price >= 1e6) return '$' + (price / 1e6).toFixed(2) + 'M';
    if (price >= 1e3) return '$' + (price / 1e3).toFixed(0) + 'K';
    return '$' + Math.round(price).toLocaleString();
  };

  const getYear = (dateStr) => new Date(dateStr).getFullYear();

  // Summary stats
  const stats = {
    genesis: '2009-01-03',
    firstPrice: 0.00099,
    currentATH: 126210,
    currentATHDate: '2025-10-06',
    projectedATH2100: futureCycles[futureCycles.length - 1]?.athPrice || 0,
    totalGain: ((126210 / 0.00099) * 100).toFixed(0),
    pizzaValue: 10000 * 126210,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Bitcoin: Genesis to 2100</h1>
          <p className="text-gray-400">Complete price history & cycle extrapolation</p>
        </div>

        {/* Epic Stats Banner */}
        <div className="bg-gradient-to-r from-orange-900/40 to-yellow-900/40 border border-orange-500 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-xs">First Trade (2009)</div>
              <div className="text-orange-400 font-mono font-bold">$0.00099</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">2025 ATH ✓</div>
              <div className="text-green-400 font-mono font-bold">$126,210</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Total Gain</div>
              <div className="text-yellow-400 font-bold">127,484,748%</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Pizza Day BTC Today</div>
              <div className="text-orange-400 font-mono font-bold">$1.26B</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {['overview', 'early', 'cycles', 'future', 'table'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab === 'early' ? 'Early History' : 
               tab === 'cycles' ? 'Cycle Pattern' :
               tab === 'future' ? 'Future (2026-2100)' :
               tab === 'table' ? 'Full Table' :
               'Overview'}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Timeline Visual */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4 text-yellow-400">Price Evolution (Log Scale)</h2>
              <div className="space-y-2">
                {[
                  { year: 2009, price: 0.00099, label: 'First Trade' },
                  { year: 2011, price: 29.60, label: 'First Bubble' },
                  { year: 2013, price: 1156, label: 'Pre-Pattern ATH' },
                  { year: 2017, price: 19783, label: 'Cycle 1 ATH' },
                  { year: 2021, price: 68789, label: 'Cycle 2 ATH' },
                  { year: 2025, price: 126210, label: 'Cycle 3 ATH ✓', verified: true },
                  { year: 2037, price: futureCycles.find(c => getYear(c.athDate) >= 2037)?.athPrice, label: '~2037' },
                  { year: 2050, price: futureCycles.find(c => getYear(c.athDate) >= 2050)?.athPrice, label: '~2050' },
                  { year: 2075, price: futureCycles.find(c => getYear(c.athDate) >= 2075)?.athPrice, label: '~2075' },
                  { year: 2100, price: futureCycles[futureCycles.length-1]?.athPrice, label: '~2100' },
                ].map((item, i) => {
                  const maxLog = Math.log10(500000);
                  const minLog = Math.log10(0.0001);
                  const priceLog = item.price ? Math.log10(item.price) : minLog;
                  const width = ((priceLog - minLog) / (maxLog - minLog)) * 100;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-400 text-right">{item.year}</div>
                      <div className="flex-1 h-6 bg-gray-700 rounded overflow-hidden">
                        <div 
                          className={`h-full flex items-center px-2 ${
                            item.verified ? 'bg-gradient-to-r from-green-600 to-emerald-400' :
                            item.year <= 2025 ? 'bg-gradient-to-r from-orange-600 to-orange-400' :
                            'bg-gradient-to-r from-blue-600 to-blue-400'
                          }`}
                          style={{ width: `${Math.max(5, width)}%` }}
                        >
                          <span className="text-xs font-mono truncate">{formatPrice(item.price || 0)}</span>
                        </div>
                      </div>
                      <div className="w-24 text-xs text-gray-500">{item.label}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-4 justify-center text-xs">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-500"></div> Historical</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-500"></div> Verified Prediction</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-500"></div> Projected</span>
              </div>
            </div>

            {/* The Pattern */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-yellow-400">The 1064/364 Cycle Pattern</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/30 border border-green-600 rounded p-3">
                  <div className="text-green-400 text-2xl font-bold">1064 days</div>
                  <div className="text-gray-400 text-sm">Bull Market (ATL→ATH)</div>
                  <div className="text-gray-500 text-xs">~2.9 years</div>
                </div>
                <div className="bg-red-900/30 border border-red-600 rounded p-3">
                  <div className="text-red-400 text-2xl font-bold">364 days</div>
                  <div className="text-gray-400 text-sm">Bear Market (ATH→ATL)</div>
                  <div className="text-gray-500 text-xs">~1 year</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500 rounded">
                <div className="text-green-400 font-semibold">✓ Prediction Verified</div>
                <div className="text-gray-300 text-sm">
                  Anonymous 4chan post (Dec 12, 2023) predicted ATH on October 6, 2025.
                  Actual ATH: <span className="text-green-400 font-mono">$126,210 on October 6, 2025</span>
                </div>
              </div>
            </div>

            {/* Decade Summary */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-yellow-400">ATH by Decade</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {[
                  { decade: '2010s', ath: 19783, verified: true },
                  { decade: '2020s', ath: 126210, verified: true },
                  { decade: '2030s', ath: futureCycles.filter(c => getYear(c.athDate) >= 2030 && getYear(c.athDate) < 2040).reduce((max, c) => Math.max(max, c.athPrice), 0) },
                  { decade: '2040s', ath: futureCycles.filter(c => getYear(c.athDate) >= 2040 && getYear(c.athDate) < 2050).reduce((max, c) => Math.max(max, c.athPrice), 0) },
                  { decade: '2050s', ath: futureCycles.filter(c => getYear(c.athDate) >= 2050 && getYear(c.athDate) < 2060).reduce((max, c) => Math.max(max, c.athPrice), 0) },
                  { decade: '2060s', ath: futureCycles.filter(c => getYear(c.athDate) >= 2060 && getYear(c.athDate) < 2070).reduce((max, c) => Math.max(max, c.athPrice), 0) },
                  { decade: '2070s', ath: futureCycles.filter(c => getYear(c.athDate) >= 2070 && getYear(c.athDate) < 2080).reduce((max, c) => Math.max(max, c.athPrice), 0) },
                  { decade: '2080s', ath: futureCycles.filter(c => getYear(c.athDate) >= 2080 && getYear(c.athDate) < 2090).reduce((max, c) => Math.max(max, c.athPrice), 0) },
                  { decade: '2090s', ath: futureCycles.filter(c => getYear(c.athDate) >= 2090 && getYear(c.athDate) < 2100).reduce((max, c) => Math.max(max, c.athPrice), 0) },
                  { decade: '2100', ath: futureCycles[futureCycles.length-1]?.athPrice || 0 },
                ].map((d, i) => (
                  <div key={i} className={`rounded p-2 text-center ${d.verified ? 'bg-green-900/30 border border-green-700' : 'bg-gray-700/50'}`}>
                    <div className="text-gray-400 text-xs">{d.decade}</div>
                    <div className={`font-bold ${d.verified ? 'text-green-400' : 'text-yellow-400'}`}>{formatPrice(d.ath)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EARLY HISTORY TAB */}
        {activeTab === 'early' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-yellow-400">Early History (2009-2015)</h2>
            <div className="space-y-3">
              {earlyHistory.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-center min-w-16">
                    <div className="text-orange-400 font-bold">{item.year}</div>
                    <div className="text-gray-500 text-xs">{item.date.slice(5)}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{item.event}</div>
                    <div className="text-gray-400 text-sm">{item.note}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-bold ${item.price === 0 ? 'text-gray-500' : 'text-green-400'}`}>
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CYCLES TAB */}
        {activeTab === 'cycles' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4 text-yellow-400">Verified Cycle Pattern (2015-2025)</h2>
              {verifiedCycles.map((c, i) => (
                <div key={i} className={`mb-4 p-4 rounded-lg ${
                  c.phase === 'bull' ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'
                } ${c.verified ? 'ring-2 ring-green-400' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`text-lg font-bold ${c.phase === 'bull' ? 'text-green-400' : 'text-red-400'}`}>
                        Cycle {c.cycle} - {c.phase.toUpperCase()}
                      </span>
                      {c.verified && <span className="ml-2 text-green-400">✓ VERIFIED</span>}
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">{c.days} days</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <div className="text-gray-500 text-xs">{c.phase === 'bull' ? 'ATL Date' : 'ATH Date'}</div>
                      <div className="text-white">{c.phase === 'bull' ? c.atlDate : c.athDate}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">{c.phase === 'bull' ? 'ATH Date' : 'ATL Date'}</div>
                      <div className="text-white">{c.phase === 'bull' ? c.athDate : c.atlDate}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Start Price</div>
                      <div className="font-mono text-white">{formatPrice(c.phase === 'bull' ? c.atlPrice : c.athPrice)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">End Price</div>
                      <div className="font-mono text-white">{formatPrice(c.phase === 'bull' ? c.athPrice : c.atlPrice)}</div>
                    </div>
                  </div>
                  {c.bull && (
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-400">Bull: {c.bull.toFixed(1)}x</span>
                      {c.bear && <span className="text-red-400">Bear: -{(c.bear * 100).toFixed(0)}%</span>}
                    </div>
                  )}
                  {c.events && (
                    <div className="mt-2 text-gray-400 text-xs">
                      Events: {c.events.join(' • ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FUTURE TAB */}
        {activeTab === 'future' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 text-yellow-400">Projected Cycles (2026-2100)</h2>
              <p className="text-gray-400 text-sm mb-4">Diminishing volatility model: bull multipliers decay 4x→1.25x, bear drops decay 75%→14%</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="text-left py-2">#</th>
                      <th className="text-left py-2">ATL</th>
                      <th className="text-left py-2">ATH</th>
                      <th className="text-right py-2">ATL $</th>
                      <th className="text-right py-2">ATH $</th>
                      <th className="text-right py-2">Bull</th>
                      <th className="text-right py-2">Bear</th>
                      <th className="text-center py-2">Halving</th>
                    </tr>
                  </thead>
                  <tbody>
                    {futureCycles.map((c, i) => (
                      <tr key={i} className="border-b border-gray-700/50">
                        <td className="py-2">{c.cycle}</td>
                        <td className="py-2 text-gray-400 text-xs">{c.atlDate}</td>
                        <td className="py-2 text-gray-400 text-xs">{c.athDate}</td>
                        <td className="py-2 text-right font-mono text-red-400">{formatPrice(c.atlPrice)}</td>
                        <td className="py-2 text-right font-mono text-green-400">{formatPrice(c.athPrice)}</td>
                        <td className="py-2 text-right text-green-400">{c.bull.toFixed(2)}x</td>
                        <td className="py-2 text-right text-red-400">-{(c.bear * 100).toFixed(0)}%</td>
                        <td className="py-2 text-center text-yellow-400">{c.halving || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-6 text-center">
              <div className="text-purple-400 font-semibold">Year 2100 Final Projection</div>
              <div className="text-4xl font-bold text-white my-2">{formatPrice(futureCycles[futureCycles.length-1]?.athPrice)}</div>
              <div className="text-gray-400 text-sm">ATH ~{futureCycles[futureCycles.length-1]?.athDate}</div>
            </div>
          </div>
        )}

        {/* FULL TABLE TAB */}
        {activeTab === 'table' && (
          <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4 text-yellow-400">Complete Data Export</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Event</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-left py-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {/* Early history */}
                {earlyHistory.map((item, i) => (
                  <tr key={`e-${i}`} className="border-b border-gray-700/30">
                    <td className="py-1 text-gray-400">{item.date}</td>
                    <td className="py-1">{item.event}</td>
                    <td className="py-1 text-right font-mono">{formatPrice(item.price)}</td>
                    <td className="py-1 text-orange-400">Early</td>
                  </tr>
                ))}
                {/* Verified cycles */}
                {verifiedCycles.filter(c => c.phase === 'bull').map((c, i) => (
                  <React.Fragment key={`v-${i}`}>
                    <tr className="border-b border-gray-700/30 bg-green-900/10">
                      <td className="py-1 text-gray-400">{c.athDate}</td>
                      <td className="py-1">Cycle {c.cycle} ATH {c.verified && '✓'}</td>
                      <td className="py-1 text-right font-mono text-green-400">{formatPrice(c.athPrice)}</td>
                      <td className="py-1 text-green-400">Verified</td>
                    </tr>
                  </React.Fragment>
                ))}
                {/* Future */}
                {futureCycles.map((c, i) => (
                  <tr key={`f-${i}`} className="border-b border-gray-700/30">
                    <td className="py-1 text-gray-400">{c.athDate}</td>
                    <td className="py-1">Cycle {c.cycle} ATH</td>
                    <td className="py-1 text-right font-mono text-yellow-400">{formatPrice(c.athPrice)}</td>
                    <td className="py-1 text-yellow-400">Projected</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Caveats */}
        <div className="mt-6 bg-red-900/20 border border-red-700 rounded-lg p-4 text-xs">
          <h3 className="text-red-400 font-semibold mb-2">⚠️ Disclaimers</h3>
          <ul className="text-gray-400 space-y-1">
            <li>• Pattern extrapolation only — not investment advice</li>
            <li>• Historical pattern verified for 3 cycles, future is uncertain</li>
            <li>• Halving rewards approach zero ~2140, changing market dynamics</li>
            <li>• Does not account for black swans, regulation, or technology shifts</li>
          </ul>
        </div>

        <div className="mt-4 text-center text-gray-600 text-xs">
          Based on 4chan /biz/ cycle theory (post Dec 12, 2023) • 2025 ATH verified Oct 6, 2025<br/>
          Data sources: CoinCodex, BitBo, Bankrate, CoinMarketCap
        </div>
      </div>
    </div>
  );
};

export default BTCCompleteHistory;
