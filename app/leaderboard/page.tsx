
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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

export default function Leaderboard() {
  const [rows, setRows] = useState<Item[]>([]);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetch('/api/leaderboard', { cache: 'no-store' })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace('/login');
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load leaderboard');
        }

        setRows(data.rows);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  const podium = rows.slice(0, 3);

  return (
    <main className="wrap">
      {/* HEADER */}
      <div className="row">
        <div>
          <div className="eyebrow">Elevate 2026</div>
          <h1 style={{ margin: '7px 0' }}>Partner Leaderboard</h1>
          <p>Level → Active Traders → TV Lots</p>
        </div>

        <button
          className="outline"
          style={{ color: '#0d1d3b', borderColor: '#b8c8db' }}
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {loading && <div className="card">Loading leaderboard…</div>}

      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          {/* SUMMARY */}
          <div className="grid" style={{ marginBottom: 25 }}>
            <div className="card">
              <div className="muted">Participants</div>
              <div className="kpi">{rows.length}</div>
            </div>

            <div className="card">
              <div className="muted">Reporting month</div>
              <div className="kpi" style={{ fontSize: 22 }}>
                {rows[0]?.month || 'No data'}
              </div>
            </div>

            <div className="card">
              <div className="muted">Last published</div>
              <div className="kpi" style={{ fontSize: 19 }}>
                {rows[0]?.updatedAt
                  ? new Date(rows[0].updatedAt).toLocaleDateString('en-GB')
                  : '—'}
              </div>
            </div>
          </div>

          {/* TOP 3 PODIUM */}
          {podium.length > 0 && (
            <div className="podium" style={{ marginBottom: 25 }}>
              {[1, 0, 2]
                .filter((i) => i < podium.length)
                .map((i) => (
                  <div
                    className="card"
                    key={podium[i].partnerId}
                    style={{ textAlign: 'center' }}
                  >
                    <div className="medal">
                      {['🥇', '🥈', '🥉'][i]}
                    </div>

                    <div className="muted">
                      Rank {podium[i].rank}
                    </div>

                    <strong
                      title={podium[i].partnerId}
                      style={{
                        display: 'block',
                        overflowWrap: 'anywhere',
                        marginTop: 4,
                      }}
                    >
                      {podium[i].partnerId}
                    </strong>

                    <div className="score">
                      {podium[i].active.toLocaleString()}
                    </div>

                    {/* ACTIVE TRADERS AND LEVEL — SEPARATE LINES */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 10,
                        marginTop: 6,
                      }}
                    >
                      <small style={{ display: 'block' }}>
                        Active Traders
                      </small>

                      <span
                        className={
                          'tag ' +
                          (podium[i].level === 'Level 1' ? 'level1' : '')
                        }
                        style={{ display: 'inline-block' }}
                      >
                        {podium[i].level}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* FULL RANKINGS */}
          <div className="card">
            <div className="row">
              <h2 style={{ margin: 0 }}>Full Rankings</h2>
              <small>{filtered.length} partners</small>
            </div>

            <div className="controls">
              <input
                aria-label="Search Partner Wallet Number"
                placeholder="Search Partner Wallet Number…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <select
                style={{ width: 170 }}
                aria-label="Filter Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {[
                  'All',
                  'Level 1',
                  'Level 2',
                  'Level 3',
                  'Level 4',
                  'No rewards',
                ].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Partner Wallet Number</th>
                    <th>Level</th>
                    <th className="num">Active Traders</th>
                    <th className="num">TV Lots</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.partnerId}>
                      <td>
                        <strong>#{row.rank}</strong>
                      </td>

                      <td
                        title={row.partnerId}
                        style={{ overflowWrap: 'anywhere' }}
                      >
                        {row.partnerId}
                      </td>

                      <td>
                        <span
                          className={
                            'tag ' +
                            (row.level === 'Level 1' ? 'level1' : '')
                          }
                        >
                          {row.level}
                        </span>
                      </td>

                      <td className="num">
                        {row.active.toLocaleString()}
                      </td>

                      <td className="num">
                        {row.tv.toLocaleString('en-US', {
                          maximumFractionDigits: 3,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <p style={{ padding: 14 }}>
                  No matching participants.
                </p>
              )}
            </div>
          </div>

          <p className="muted" style={{ marginTop: 16 }}>
            Rankings reflect the latest published CSV. For Wallet Number
            verification, contact the campaign administrator.{' '}
            <Link href="/">Campaign home</Link>
          </p>
        </>
      )}
    </main>
  );
}
