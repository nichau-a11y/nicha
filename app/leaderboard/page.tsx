
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Item = {
  partnerId: string;
  month: string;
  level: string;
  active: number;
  tv: number;
  rank: number;
  updatedAt: string;
};

const rules = [
  { level: 'Level 1', tv: '≥ 3,000', active: '≥ 150', reward: '1,200 USD' },
  { level: 'Level 2', tv: '≥ 1,700', active: '≥ 100', reward: '800 USD' },
  { level: 'Level 3', tv: '≥ 1,300', active: '≥ 80', reward: '400 USD' },
  { level: 'Level 4', tv: '≥ 900', active: '≥ 50', reward: '200 USD' },
];

export default function Leaderboard() {
  const [rows, setRows] = useState<Item[]>([]);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch('/api/leaderboard', {
          cache: 'no-store',
        });

        if (res.status === 401) {
          router.replace('/login');
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Unable to load leaderboard');
        }

        if (active) {
          setRows(Array.isArray(data.rows) ? data.rows : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [router]);

  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (level === 'All' || row.level === level) &&
          row.partnerId.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [rows, level, query]
  );

  const podium = rows.slice(0, 3);

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <main className="el-page">
      {/* NAVIGATION */}
      <header className="el-nav">
        <Link href="/" className="el-logo">
          EXNESS <span>ELEVATE</span>
        </Link>

        <div className="el-nav-actions">
          <Link href="/" className="el-nav-link">
            Campaign
          </Link>
          <button onClick={logout} className="el-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="el-container">

        {/* CAMPAIGN BANNER — ORIGINAL IMAGE */}
        <section className="el-banner">
          <Image
            src="/images/elevate-campaign.png"
            alt="Exness Elevate Campaign, 1 October 2026 to 31 January 2027"
            width={1818}
            height={758}
            priority
            sizes="(max-width: 800px) 100vw, 1200px"
            className="el-full-image"
          />
        </section>

        {/* HEADER */}
        <section className="el-intro">
          <div>
            <div className="el-eyebrow">PARTNER EXCELLENCE 2026</div>
            <h1>Partner Leaderboard</h1>
            <p>
              Track your performance and discover your position
              among Exness Elevate partners.
            </p>
          </div>

          <div className="el-priority">
            RANKING PRIORITY
            <strong>Level → Active Traders → TV Lots</strong>
          </div>
        </section>

        {loading && (
          <div className="el-panel el-message">
            Loading leaderboard…
          </div>
        )}

        {error && (
          <div className="el-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* SUMMARY */}
            <section className="el-stats">
              <div className="el-stat">
                <span>PARTICIPANTS</span>
                <strong>{rows.length.toLocaleString()}</strong>
              </div>

              <div className="el-stat">
                <span>REPORTING MONTH</span>
                <strong className="el-stat-small">
                  {rows[0]?.month || 'No data'}
                </strong>
              </div>

              <div className="el-stat">
                <span>LAST PUBLISHED</span>
                <strong className="el-stat-small">
                  {rows[0]?.updatedAt
                    ? new Date(rows[0].updatedAt).toLocaleDateString('en-GB')
                    : '—'}
                </strong>
              </div>
            </section>

            {/* TOP 3 */}
            {podium.length > 0 && (
              <section className="el-section">
                <div className="el-section-heading">
                  <div className="el-eyebrow">THE TOP PERFORMERS</div>
                  <h2>Top 3 Partners</h2>
                  <p>
                    Ranked by campaign level, qualified active traders,
                    and trading volume.
                  </p>
                </div>

                <div className="el-podium">
                  {[1, 0, 2]
                    .filter((i) => i < podium.length)
                    .map((i) => {
                      const partner = podium[i];

                      return (
                        <div
                          className={
                            'el-podium-card ' +
                            (i === 0 ? 'el-podium-first' : '')
                          }
                          key={partner.partnerId}
                        >
                          <div className="el-medal">
                            {['🥇', '🥈', '🥉'][i]}
                          </div>

                          <div className="el-rank">
                            RANK {partner.rank}
                          </div>

                          <div className="el-wallet">
                            {partner.partnerId}
                          </div>

                          <div className="el-podium-score">
                            {partner.active.toLocaleString()}
                          </div>

                          <div className="el-score-caption">
                            Active Traders
                          </div>

                          <div className="el-level">
                            {partner.level}
                          </div>

                          <div className="el-podium-tv">
                            TV Lots:{' '}
                            {partner.tv.toLocaleString('en-US', {
                              maximumFractionDigits: 3,
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {/* FULL LEADERBOARD */}
            <section className="el-section">
              <div className="el-section-heading">
                <div className="el-eyebrow">YOUR POSITION</div>
                <h2>Full Rankings</h2>
              </div>

              <div className="el-panel">
                <div className="el-filterbar">
                  <input
                    type="search"
                    aria-label="Search Wallet Number"
                    placeholder="Search Wallet Number..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="el-input"
                  />

                  <select
                    aria-label="Filter by Level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="el-select"
                  >
                    {[
                      'All',
                      'Level 1',
                      'Level 2',
                      'Level 3',
                      'Level 4',
                      'No rewards',
                    ].map((item) => (
                      <option key={item} value={item}>
                        {item === 'All' ? 'All Levels' : item}
                      </option>
                    ))}
                  </select>

                  <span className="el-result-count">
                    {filtered.length} partners
                  </span>
                </div>

                <div className="el-table-scroll">
                  <table className="el-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Wallet Number</th>
                        <th>Level</th>
                        <th className="el-num">Active Traders</th>
                        <th className="el-num">TV Lots</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.map((row) => (
                        <tr key={row.partnerId}>
                          <td className="el-rank-cell">
                            #{row.rank}
                          </td>

                          <td className="el-wallet-cell">
                            {row.partnerId}
                          </td>

                          <td>
                            <span className="el-table-level">
                              {row.level}
                            </span>
                          </td>

                          <td className="el-num">
                            {row.active.toLocaleString()}
                          </td>

                          <td className="el-num">
                            {row.tv.toLocaleString('en-US', {
                              maximumFractionDigits: 3,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filtered.length === 0 && (
                    <div className="el-empty">
                      No matching partners found.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* REWARDS & BENEFITS */}
        <section className="el-section">
          <div className="el-section-heading">
            <div className="el-eyebrow">CAMPAIGN BENEFITS</div>
            <h2>Rewards & Privileges</h2>
            <p>
              Discover the opportunities available to
              qualifying Exness Elevate partners.
            </p>
          </div>

          <div className="el-rewards-grid">
            <article className="el-reward-card">
              <Image
                src="/images/reward-monthly.png"
                alt="Extra monthly reward: cash rewards from 200 to 1,200 USD"
                width={761}
                height={680}
                sizes="(max-width: 768px) 100vw, 600px"
                className="el-full-image"
              />
            </article>

            <article className="el-reward-card">
              <Image
                src="/images/reward-privileges.png"
                alt="Exclusive privileges and partner events"
                width={748}
                height={680}
                sizes="(max-width: 768px) 100vw, 600px"
                className="el-full-image"
              />
            </article>
          </div>
        </section>

        {/* GRAND PRIZE — ADDED AS THE FOURTH IMAGE */}
        <section className="el-section">
          <div className="el-section-heading">
            <div className="el-eyebrow">LEVEL 1 TOP</div>
            <h2>Grand Prize</h2>
            <p>
              An exclusive finale for partners who maintain
              Level 1 status throughout the campaign.
            </p>
          </div>

          <div className="el-grand-card">
            <Image
              src="/images/grand-prize.png"
              alt="Grand prize after the campaign — exclusive journey to the Exness office"
              width={822}
              height={1034}
              sizes="(max-width: 768px) 100vw, 480px"
              className="el-full-image"
            />
          </div>
        </section>

        {/* CAMPAIGN RULES */}
        <section className="el-section">
          <div className="el-section-heading">
            <div className="el-eyebrow">CAMPAIGN REQUIREMENTS</div>
            <h2>Levels & Monthly Rewards</h2>
            <p>
              Qualification thresholds and extra monthly rewards.
            </p>
          </div>

          <div className="el-panel el-table-scroll">
            <table className="el-table el-rules-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Trading Volume (Lots)</th>
                  <th>Active Referred Clients / Month</th>
                  <th>Extra Monthly Reward</th>
                </tr>
              </thead>

              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.level}>
                    <td>
                      <strong>{rule.level}</strong>
                    </td>
                    <td>{rule.tv}</td>
                    <td>{rule.active}</td>
                    <td className="el-reward-amount">
                      {rule.reward}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="el-disclaimer">
            Reward eligibility is subject to the official
            Exness Elevate Campaign terms and conditions.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="el-footer">
          <div>
            <strong>EXNESS <span>ELEVATE</span></strong>
            <p>1 October 2026 – 31 January 2027</p>
          </div>

          <p>
            Rankings reflect the latest published CSV.
            For wallet verification, contact the campaign administrator.
          </p>

          <Link href="/">Campaign Home →</Link>
        </footer>
      </div>

      {/* ALL PAGE STYLES — NO GLOBAL CSS EDIT REQUIRED */}
      <style jsx>{`
        .el-page {
          min-height: 100vh;
          background: #080e1d;
          color: #f9f7f2;
          font-family: inherit;
        }

        .el-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px max(24px, calc((100vw - 1220px) / 2));
          background: #070b15;
          border-bottom: 1px solid #252c3a;
          gap: 20px;
        }

        .el-logo {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: white;
          text-decoration: none;
        }

        .el-logo span,
        .el-footer strong span {
          color: #f1c55c;
        }

        .el-nav-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .el-nav-link {
          color: #d5d6dc;
          text-decoration: none;
        }

        .el-logout {
          border: 1px solid #a98843;
          border-radius: 8px;
          background: transparent;
          color: #f6d783;
          padding: 10px 22px;
          cursor: pointer;
        }

        .el-container {
          width: min(1220px, calc(100% - 36px));
          margin: 0 auto;
        }

        .el-banner {
          margin-top: 28px;
          border-radius: 16px;
          overflow: hidden;
          background: #17100c;
        }

        .el-full-image {
          display: block;
          width: 100%;
          height: auto;
        }

        .el-intro {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 26px;
          padding: 48px 0 32px;
        }

        .el-eyebrow {
          color: #dfb85c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.2em;
          margin-bottom: 12px;
        }

        .el-intro h1 {
          font-size: clamp(30px, 5vw, 48px);
          line-height: 1.15;
          margin: 0 0 12px;
          color: white;
        }

        .el-intro p,
        .el-section-heading p {
          color: #aab2c2;
          line-height: 1.7;
          margin: 0;
        }

        .el-priority {
          border: 1px solid #59482e;
          border-radius: 12px;
          padding: 16px 22px;
          color: #c6ad79;
          font-size: 11px;
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }

        .el-priority strong {
          display: block;
          color: white;
          font-size: 14px;
          margin-top: 7px;
          letter-spacing: 0;
        }

        .el-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 48px;
        }

        .el-stat,
        .el-panel,
        .el-podium-card {
          background: #151b2b;
          border: 1px solid #303444;
          border-radius: 16px;
        }

        .el-stat {
          padding: 26px;
          min-width: 0;
        }

        .el-stat span {
          display: block;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: #a4a9b7;
          margin-bottom: 12px;
        }

        .el-stat strong {
          display: block;
          font-size: 34px;
          color: #f0c55e;
          overflow-wrap: anywhere;
        }

        .el-stat .el-stat-small {
          font-size: 20px;
          color: white;
        }

        .el-section {
          margin-bottom: 65px;
        }

        .el-section-heading {
          margin-bottom: 23px;
        }

        .el-section-heading h2 {
          color: white;
          font-size: clamp(26px, 3.5vw, 36px);
          margin: 0 0 9px;
        }

        .el-podium {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          align-items: stretch;
        }

        .el-podium-card {
          padding: 28px 16px;
          text-align: center;
          min-width: 0;
        }

        .el-podium-first {
          border-color: #b99146;
          background: linear-gradient(165deg, #3e3020, #161b28 72%);
          box-shadow: 0 0 32px rgba(202, 155, 56, 0.12);
        }

        .el-medal {
          font-size: 44px;
          margin-bottom: 8px;
        }

        .el-rank {
          color: #d6b977;
          font-weight: 800;
          letter-spacing: 0.1em;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .el-wallet {
          color: white;
          font-size: 17px;
          font-weight: 700;
          overflow-wrap: anywhere;
          margin-bottom: 17px;
        }

        .el-podium-score {
          color: #f5c75e;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 900;
          line-height: 1.2;
        }

        .el-score-caption {
          color: #b8bdc8;
          margin: 8px 0 15px;
        }

        .el-level {
          display: table;
          margin: 0 auto;
          color: #1c1a16;
          background: #f0c55e;
          border-radius: 99px;
          font-weight: 800;
          padding: 8px 22px;
        }

        .el-podium-tv {
          margin-top: 19px;
          color: #bac0ce;
          font-size: 13px;
        }

        .el-panel {
          padding: 20px;
          overflow: hidden;
        }

        .el-message {
          margin-bottom: 30px;
        }

        .el-error {
          color: #ffc3b9;
          border: 1px solid #9b524c;
          padding: 20px;
          border-radius: 12px;
        }

        .el-filterbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .el-input,
        .el-select {
          background: #0c1424;
          border: 1px solid #4b5162;
          border-radius: 9px;
          color: #fff;
          padding: 13px 16px;
          font-size: 14px;
          max-width: 100%;
        }

        .el-input {
          flex: 1;
          min-width: 190px;
        }

        .el-input::placeholder {
          color: #9b9fa9;
        }

        .el-select {
          min-width: 165px;
        }

        .el-select option {
          background: #101828;
        }

        .el-result-count {
          color: #a4abba;
          font-size: 13px;
          margin-left: auto;
        }

        .el-table-scroll {
          overflow-x: auto;
        }

        .el-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 620px;
        }

        .el-table th {
          font-size: 12px;
          color: #acb2c1;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-align: left;
          white-space: nowrap;
          padding: 17px 16px;
          border-bottom: 1px solid #384052;
        }

        .el-table td {
          color: #f5f5f7;
          padding: 17px 16px;
          border-bottom: 1px solid #2b3343;
          font-size: 14px;
        }

        .el-table tbody tr:hover {
          background: #222b3e;
        }

        .el-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .el-table .el-num {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        .el-rank-cell,
        .el-reward-amount {
          color: #f1c665 !important;
          font-weight: 800;
        }

        .el-wallet-cell {
          overflow-wrap: anywhere;
        }

        .el-table-level {
          display: inline-block;
          background: #343542;
          border-radius: 99px;
          padding: 6px 12px;
          font-size: 12px;
          white-space: nowrap;
        }

        .el-empty {
          padding: 30px 15px;
          color: #aab2c2;
          text-align: center;
        }

        .el-rewards-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .el-reward-card {
          min-width: 0;
          border-radius: 14px;
          overflow: hidden;
          background: #1d2230;
          border: 1px solid #303444;
        }

        .el-grand-card {
          width: min(480px, 100%);
          margin: 0 auto;
          border-radius: 16px;
          overflow: hidden;
          background: #191816;
          border: 1px solid #72572b;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.32);
        }

        .el-rules-table th,
        .el-rules-table td {
          text-align: center;
        }

        .el-rules-table td {
          font-size: 17px;
        }

        .el-disclaimer {
          margin: 13px 0 0;
          color: #9ca4b5;
          font-size: 12px;
        }

        .el-footer {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 30px;
          padding: 30px 0 48px;
          border-top: 1px solid #3a3840;
          color: #a9aebb;
          font-size: 13px;
        }

        .el-footer strong {
          display: block;
          color: white;
          letter-spacing: 0.07em;
          font-size: 17px;
        }

        .el-footer p {
          max-width: 380px;
          line-height: 1.6;
          margin: 8px 0;
        }

        .el-footer a {
          color: #f2c866;
          text-decoration: none;
        }

        @media (max-width: 820px) {
          .el-intro {
            flex-direction: column;
            align-items: stretch;
          }

          .el-priority {
            flex-shrink: 1;
          }

          .el-stats,
          .el-podium,
          .el-rewards-grid {
            grid-template-columns: 1fr;
          }

          .el-podium-first {
            order: -1;
          }

          .el-footer {
            flex-direction: column;
          }
        }

        @media (max-width: 520px) {
          .el-nav {
            padding: 16px;
          }

          .el-logo {
            font-size: 15px;
          }

          .el-nav-actions {
            gap: 10px;
          }

          .el-nav-link {
            font-size: 12px;
          }

          .el-logout {
            padding: 8px 12px;
            font-size: 12px;
          }

          .el-container {
            width: calc(100% - 24px);
          }

          .el-banner {
            margin-top: 16px;
          }

          .el-intro {
            padding-top: 32px;
          }

          .el-section {
            margin-bottom: 46px;
          }

          .el-panel {
            padding: 12px;
          }

          .el-stat {
            padding: 20px;
          }

          .el-result-count {
            margin-left: 0;
          }
        }
      `}</style>
    </main>
  );
}
