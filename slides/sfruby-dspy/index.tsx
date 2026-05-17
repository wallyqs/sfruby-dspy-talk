import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import rubyLogo from '@assets/header-ruby-logo.svg';
import miniGitRuby from '@assets/mini-git-ruby.jpeg';

export const design: DesignSystem = {
  palette: { bg: '#0a0a0c', text: '#f6f5f0', accent: '#cc342d' },
  fonts: {
    display: '"Inter", system-ui, -apple-system, sans-serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 160, body: 36 },
  radius: 12,
};

const muted = '#8a8a92';

const Intro: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <div
      style={{
        fontSize: 28,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'var(--osd-accent)',
        fontWeight: 600,
      }}
    >SF Ruby Meetup // May 2026</div>

    <div>
      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          margin: 0,
        }}
      >
        Building Agents
        <br />
        with{' '}
        <span style={{ color: 'var(--osd-accent)' }}>DSPy</span> in{' '}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            verticalAlign: 'baseline',
          }}
        >
          Ruby
          <img
            src={rubyLogo}
            alt=""
            style={{
              height: 200,
              width: 200,
              marginLeft: 24,
              display: 'block',
            }}
          />
        </span>
      </h1>
      <p
        style={{
          fontSize: 'var(--osd-size-body)',
          lineHeight: 1.5,
          color: muted,
          marginTop: 48,
          maxWidth: 1200,
        }}
      >
        Programming — not prompting — language models, the Ruby way.
      </p>
    </div>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--osd-text)',
          }}
        >
          Waldemar Quevedo
        </span>
        <a
          href="https://twitter.com/wallyqs"
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: 'var(--osd-accent)',
            textDecoration: 'none',
            letterSpacing: '0.02em',
          }}
        >
          @wallyqs
        </a>
      </div>
      <span style={{ fontSize: 24, color: muted, letterSpacing: '0.18em' }}>{''}</span>
    </div>
  </div>
);

const LetsTalkRuby: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '80px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{ fontFamily: 'var(--osd-font-display)', fontSize: 88, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0 }}
    >
      Let&rsquo;s talk about{' '}
      <span style={{ color: 'var(--osd-accent)' }}>Ruby</span>
    </h2>

    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 32,
        marginBottom: 28,
        minHeight: 0,
      }}
    >
      <img
        src={miniGitRuby}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'left center',
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
        }}
      />
    </div>

    <a
      href="https://dev.to/mame/which-programming-language-is-best-for-claude-code-508a"
      style={{ fontSize: '41px', color: 'var(--osd-accent)', textDecoration: 'none', letterSpacing: '0.02em', alignSelf: 'flex-start', textAlign: 'left' }}
    >dev.to/mame/which-programming-language-is-best-for-claude-code</a>
  </div>
);

export const meta: SlideMeta = { title: 'Building Agents with DSPy in Ruby', theme: 'corporate' };

export default [Intro, LetsTalkRuby] satisfies Page[];
