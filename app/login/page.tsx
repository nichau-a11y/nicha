
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  async function enter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setErr('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          role: 'partner',
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to sign in');
      }

      router.push('/leaderboard');
      router.refresh();
    } catch (error) {
      setErr(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="elevate-login-page">
      <div className="elevate-login-container">

        {/* CAMPAIGN BRANDING */}
        <div className="elevate-login-header">
          <Link href="/" className="elevate-login-logo">
            EXNESS <span>ELEVATE</span>
          </Link>

          <Link href="/" className="elevate-back-link">
            ← Campaign Home
          </Link>
        </div>

        {/* LOGIN PANEL */}
        <div className="elevate-login-panel">

          {/* LEFT IMAGE */}
          <div className="elevate-login-visual">
            <Image
              src="/images/reward-privileges.png"
              alt="Exness Elevate exclusive privileges"
              fill
              priority
              sizes="(max-width: 850px) 100vw, 50vw"
              className="elevate-login-image"
            />

            <div className="elevate-login-image-shade" />

            <div className="elevate-login-visual-caption">
              <span>EXNESS ELEVATE 2026</span>
              <h2>Rise to the top.</h2>
              <p>
                Your performance. Your progress.
                Your opportunity to elevate.
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="elevate-login-form-panel">
            <div className="elevate-login-eyebrow">
              PRIVATE PARTNER ACCESS
            </div>

            <h1>Welcome Back</h1>

            <p className="elevate-login-description">
              Enter your campaign password to access
              the Exness Elevate Partner Leaderboard.
            </p>

            <form onSubmit={enter}>
              <label htmlFor="partner-password">
                Campaign Password
              </label>

              <div className="elevate-password-wrapper">
                <input
                  id="partner-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="elevate-password-input"
                  disabled={busy}
                />

                <button
                  type="button"
                  className="elevate-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <button
                type="submit"
                className="elevate-login-submit"
                disabled={busy}
              >
                {busy ? 'Verifying…' : 'Enter Leaderboard →'}
              </button>
            </form>

            {err && (
              <div className="elevate-login-error" role="alert">
                {err}
              </div>
            )}

            <div className="elevate-login-help">
              <span>🔒</span>
              <p>
                Access is restricted to authorized campaign partners.
                If you need assistance, please contact your
                campaign administrator.
              </p>
            </div>
          </div>
        </div>

        <footer className="elevate-login-footer">
          <span>Exness Elevate Campaign</span>
          <span>1 October 2026 – 31 January 2027</span>
        </footer>
      </div>

      <style jsx>{`
        .elevate-login-page {
          min-height: 100vh;
          background:
            radial-gradient(
              ellipse at 18% 18%,
              rgba(151, 99, 35, 0.16),
              transparent 45%
            ),
            #080e1d;
          color: #ffffff;
          padding: 32px 24px;
        }

        .elevate-login-container {
          width: min(1160px, 100%);
          margin: 0 auto;
        }

        .elevate-login-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 55px;
        }

        .elevate-login-logo {
          font-size: 21px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-decoration: none;
          color: #ffffff;
        }

        .elevate-login-logo span {
          color: #f0c463;
        }

        .elevate-back-link {
          color: #c4c8d1;
          text-decoration: none;
          font-size: 14px;
        }

        .elevate-back-link:hover {
          color: #f0c463;
        }

        .elevate-login-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 610px;
          border: 1px solid #3e3b3b;
          border-radius: 22px;
          overflow: hidden;
          background: #151b2b;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.3);
        }

        .elevate-login-visual {
          position: relative;
          min-height: 610px;
          overflow: hidden;
          background: #1b1715;
        }

        .elevate-login-image {
          object-fit: cover;
          object-position: center top;
        }

        .elevate-login-image-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.04),
            rgba(0, 0, 0, 0.2) 45%,
            rgba(0, 0, 0, 0.87)
          );
          pointer-events: none;
        }

        .elevate-login-visual-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 38px;
          z-index: 1;
          pointer-events: none;
        }

        .elevate-login-visual-caption span {
          color: #f0c463;
          font-weight: 800;
          letter-spacing: 0.16em;
          font-size: 12px;
        }

        .elevate-login-visual-caption h2 {
          font-size: 42px;
          color: white;
          margin: 12px 0;
          line-height: 1.08;
        }

        .elevate-login-visual-caption p {
          color: #dedbd6;
          line-height: 1.6;
          max-width: 340px;
        }

        .elevate-login-form-panel {
          padding: 70px 55px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .elevate-login-eyebrow {
          color: #f0c463;
          letter-spacing: 0.2em;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 18px;
        }

        .elevate-login-form-panel h1 {
          color: #ffffff;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.15;
          margin: 0 0 18px;
        }

        .elevate-login-description {
          color: #b4bdcc;
          line-height: 1.8;
          margin: 0 0 32px;
          font-size: 15px;
        }

        .elevate-login-form-panel label {
          display: block;
          font-weight: 700;
          color: #f4f1ea;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .elevate-password-wrapper {
          position: relative;
        }

        .elevate-password-input {
          width: 100%;
          min-width: 0;
          background: #0d1423;
          color: #ffffff;
          border: 1px solid #515363;
          border-radius: 10px;
          padding: 17px 72px 17px 18px;
          outline: none;
          font-size: 15px;
          box-sizing: border-box;
        }

        .elevate-password-input::placeholder {
          color: #9ca5b7;
        }

        .elevate-password-input:focus {
          border-color: #f0c463;
          box-shadow: 0 0 0 3px rgba(240, 196, 99, 0.13);
        }

        .elevate-show-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          padding: 8px 10px;
          border: 0;
          background: transparent;
          color: #e6c57b;
          cursor: pointer;
          font-size: 13px;
        }

        .elevate-login-submit {
          width: 100%;
          margin-top: 20px;
          padding: 17px 20px;
          background: #f0c463;
          color: #101521;
          border: 0;
          border-radius: 10px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .elevate-login-submit:hover:not(:disabled) {
          background: #ffdb84;
        }

        .elevate-login-submit:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .elevate-login-error {
          margin-top: 20px;
          padding: 13px 15px;
          border-radius: 10px;
          background: #422226;
          border: 1px solid #a25357;
          color: #ffe3e3;
          font-size: 14px;
        }

        .elevate-login-help {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border-top: 1px solid #374051;
          padding-top: 23px;
          margin-top: 35px;
        }

        .elevate-login-help span {
          font-size: 18px;
        }

        .elevate-login-help p {
          color: #aeb8c9;
          margin: 0;
          line-height: 1.7;
          font-size: 13px;
        }

        .elevate-login-footer {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 30px;
          color: #8893a7;
          font-size: 12px;
        }

        @media (max-width: 850px) {
          .elevate-login-page {
            padding: 20px 15px;
          }

          .elevate-login-header {
            margin-bottom: 25px;
          }

          .elevate-login-panel {
            grid-template-columns: 1fr;
          }

          .elevate-login-visual {
            min-height: 310px;
          }

          .elevate-login-visual-caption {
            padding: 25px;
          }

          .elevate-login-visual-caption h2 {
            font-size: 30px;
          }

          .elevate-login-form-panel {
            padding: 35px 25px;
          }

          .elevate-login-footer {
            flex-direction: column;
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .elevate-login-logo {
            font-size: 17px;
          }

          .elevate-back-link {
            font-size: 12px;
          }

          .elevate-login-form-panel {
            padding: 30px 20px;
          }
        }
      `}</style>
    </main>
  );
}
