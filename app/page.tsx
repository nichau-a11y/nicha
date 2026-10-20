
import Link from 'next/link';
import Image from 'next/image';

const rewards = [
  {
    level: 'Level 1',
    volume: '≥ 3,000',
    clients: '≥ 150',
    reward: '1,200 USD',
  },
  {
    level: 'Level 2',
    volume: '≥ 1,700',
    clients: '≥ 100',
    reward: '800 USD',
  },
  {
    level: 'Level 3',
    volume: '≥ 1,300',
    clients: '≥ 80',
    reward: '400 USD',
  },
  {
    level: 'Level 4',
    volume: '≥ 900',
    clients: '≥ 50',
    reward: '200 USD',
  },
];

export default function Home() {
  return (
    <main className="landing">
      <div className="landing-container">

        {/* CAMPAIGN HERO */}
        <section className="landing-hero">
          <Image
            src="/images/elevate-campaign.png"
            alt="Exness Elevate Campaign"
            width={1818}
            height={758}
            priority
            className="landing-image"
          />
        </section>

        {/* LEADERBOARD ACCESS */}
        <section className="landing-intro">
          <div>
            <span className="landing-eyebrow">
              PARTNER EXCELLENCE 2026
            </span>
            <h1>Elevate your performance.</h1>
            <p>
              Track your campaign performance, explore rewards,
              and see where you stand among participating partners.
            </p>
          </div>
          <Link href="/leaderboard" className="landing-button">
            View Leaderboard →
          </Link>
        </section>

        {/* REWARDS */}
        <section className="landing-section">
          <div className="landing-section-heading">
            <span className="landing-eyebrow">
              REWARDS & BENEFITS
            </span>
            <h2>Recognising your achievements</h2>
          </div>

          <div className="landing-rewards">
            <Image
              src="/images/reward-monthly.png"
              alt="Extra Monthly Reward"
              width={761}
              height={680}
              className="landing-image"
            />
            <Image
              src="/images/reward-privileges.png"
              alt="Exclusive Privileges"
              width={748}
              height={680}
              className="landing-image"
            />
          </div>
        </section>

        {/* GRAND PRIZE */}
        <section className="landing-section">
          <div className="landing-section-heading">
            <span className="landing-eyebrow">
              CAMPAIGN FINALE
            </span>
            <h2>Grand Prize</h2>
            <p>
              An exclusive journey to the Exness office for
              qualifying Level 1 partners.
            </p>
          </div>

          <div className="landing-grand">
            <Image
              src="/images/grand-prize.png"
              alt="Grand prize after the campaign"
              width={822}
              height={1034}
              className="landing-image"
            />
          </div>
        </section>

        {/* REQUIREMENTS */}
        <section className="landing-section">
          <div className="landing-section-heading">
            <span className="landing-eyebrow">
              CAMPAIGN REQUIREMENTS
            </span>
            <h2>Levels & Monthly Rewards</h2>
          </div>

          <div className="landing-table-scroll">
            <table className="landing-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Trading Volume (Lots)</th>
                  <th>Active Referred Clients / Month</th>
                  <th>Extra Monthly Reward</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((r) => (
                  <tr key={r.level}>
                    <td>{r.level}</td>
                    <td>{r.volume}</td>
                    <td>{r.clients}</td>
                    <td className="landing-gold">{r.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="landing-note">
            Reward eligibility is subject to the official
            Exness Elevate Campaign terms and conditions.
          </p>
        </section>

        {/* FINAL CTA */}
        <section className="landing-cta">
          <span className="landing-eyebrow">
            YOUR PERFORMANCE. YOUR PROGRESS.
          </span>
          <h2>Rise to the top.</h2>
          <p>
            View the latest published partner rankings.
          </p>
          <Link href="/leaderboard" className="landing-button">
            Enter Partner Leaderboard →
          </Link>
        </section>
      </div>

      <style>{`
        .landing {
          min-height: 100vh;
          background: #080e1d;
          color: #ffffff;
          padding: 28px 18px 70px;
        }

        .landing-container {
          max-width: 1220px;
          margin: 0 auto;
        }

        .landing-hero {
          overflow: hidden;
          border-radius: 16px;
        }

        .landing-image {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .landing-intro {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          padding: 65px 0;
        }

        .landing-intro h1 {
          font-size: clamp(30px, 5vw, 52px);
          margin: 12px 0;
          color: #ffffff;
        }

        .landing-intro p,
        .landing-section-heading p {
          color: #b6bdcb;
          line-height: 1.7;
          max-width: 650px;
        }

        .landing-eyebrow {
          display: block;
          color: #edbd5c;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.19em;
        }

        .landing-button {
          display: inline-block;
          background: #ffdc00;
          color: #0a0f19;
          border-radius: 8px;
          padding: 16px 25px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
        }

        .landing-button:hover {
          background: #f1c75d;
        }

        .landing-section {
          margin-bottom: 78px;
        }

        .landing-section-heading {
          margin-bottom: 26px;
        }

        .landing-section-heading h2 {
          font-size: clamp(28px, 4vw, 40px);
          margin: 12px 0;
          color: #ffffff;
        }

        .landing-rewards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          align-items: start;
        }

        .landing-rewards img {
          border-radius: 12px;
        }

        .landing-grand {
          max-width: 560px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid #806033;
        }

        .landing-table-scroll {
          overflow-x: auto;
          background: #141b2b;
          border-radius: 14px;
          padding: 20px;
        }

        .landing-table {
          width: 100%;
          min-width: 720px;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .landing-table th,
.landing-table td {
  padding: 24px 14px;
  text-align: center;
  border-bottom: 1px solid #30394b;
  background-color: #141b2b !important;
  color: #ffffff !important;
}

        .landing-table th {
  background-color: #242d40 !important;
  color: #eac26d !important;
  font-size: 13px;
  font-weight: 700;
}

        .landing-table td {
          font-size: 17px;
        }

        .landing-table td.landing-gold {
          color: #f0c463 !important;
          font-weight: 800;
        }

        .landing-note {
          color: #aeb7c7;
          font-size: 12px;
          margin-top: 16px;
        }

        .landing-cta {
          text-align: center;
          background: linear-gradient(135deg,#322518,#101727);
          border: 1px solid #654d2e;
          border-radius: 20px;
          padding: 65px 25px;
        }

        .landing-cta h2 {
          font-size: clamp(32px, 5vw, 54px);
          margin: 16px 0;
          color: #ffffff;
        }

        .landing-cta p {
          color: #c0c5cf;
          margin-bottom: 30px;
        }

        @media(max-width: 768px) {
          .landing {
            padding: 16px 12px 45px;
          }

          .landing-intro {
            flex-direction: column;
            align-items: flex-start;
            padding: 40px 0;
          }

          .landing-rewards {
            grid-template-columns: 1fr;
          }

          .landing-section {
            margin-bottom: 50px;
          }
        }
      `}</style>
    </main>
  );
}
