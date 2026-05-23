import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import rubyLogo from '@assets/header-ruby-logo.svg';
import miniGitRuby from '@assets/mini-git-ruby.jpeg';
import foxesDspy from '@assets/foxes-dspy.png';
import dspyAiOrig from '@assets/dspy-ai-orig.png';
import dspyPaper from '@assets/dspy-paper.png';
import dspyPuzzle from '@assets/dspy_puzzle.png';
import ohPythonIsInThis from '@assets/oh-python-is-in-this.jpg';
import dspyRb100 from '@assets/dspy-rb-1-0-0.png';
import rubyllm from '@assets/rubyllm.png';
import desiru from '@assets/desiru.png';
import optimizersImg from '@assets/optimizers.png';
import gepaImg from '@assets/gepa.png';

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

// Flip to `true` while exporting to PDF; `false` restores animated reveals.
const ANIMATIONS_DISABLED_FOR_EXPORT = false;

const dspyPredictSource = `require 'dspy'

DSPy.configure do |c|
  c.lm = DSPy::LM.new('openai/gpt-4o-mini', api_key: ENV['OPENAI_API_KEY'])
end

class Summarize < DSPy::Signature
  description "Summarize the given text in one sentence."

  input do
    const :text, String
  end

  output do
    const :summary, String
  end
end

summarizer = DSPy::Predict.new(Summarize)
result = summarizer.call(text: "DSPy.rb brings structured LLM programming to Ruby...")
puts result.summary`;

const chainOfThoughtSource = `require 'dspy'

DSPy.configure do |c|
  c.lm = DSPy::LM.new('openai/gpt-4o-mini', api_key: ENV['OPENAI_API_KEY'])
end

class MathProblem < DSPy::Signature
  description 'Solve a word problem with a single numeric answer.'

  input  { const :problem, String }
  output { const :answer,  String }
end

solver = DSPy::ChainOfThought.new(MathProblem)
result = solver.call(problem: 'A train travels 120 km in 2 hours. What is its average speed?')

puts "Reasoning: #{result.reasoning}"
puts "Answer:    #{result.answer}"`;

const reactSource = `require 'dspy'

class Search < DSPy::Tools::Base
  tool_name        'search'
  tool_description 'Search a small in-memory knowledge base.'

  KB = {
    'ruby 3.4' => 'Ruby 3.4.0: \`it\` block param, Prism parser, faster YJIT.',
    'dspy.rb'  => 'DSPy.rb 1.0 — signatures, modules, MIPROv2, GEPA.',
  }.freeze

  sig { params(query: String).returns(String) }
  def call(query:)
    hit = KB.find { |k, _| query.downcase.include?(k) }
    hit ? hit.last : 'No results.'
  end
end

class Research < DSPy::Signature
  description 'Answer the question, using the search tool when needed.'
  input  { const :question, String }
  output { const :answer,   String }
end

agent  = DSPy::ReAct.new(Research, tools: [Search.new], max_iterations: 5)
result = agent.call(question: "What's new in Ruby 3.4?")
puts result.answer`;

const RB_KEYWORDS = new Set(['require', 'class', 'do', 'end', 'def', 'puts', 'self', 'return']);
const CODE_STR = '#c3e88d';
const CODE_KW = '#c792ea';
const CODE_SYM = '#82aaff';
const CODE_COMMENT = '#5a5a62';

const highlightRuby = (src: string) =>
  src.split('\n').map((line, lineIdx) => {
    const parts: { text: string; color?: string }[] = [];
    const regex = /('[^']*'|"[^"]*"|#[^\n]*|:[a-z_][a-z0-9_]*|[A-Z][A-Za-z0-9_]*(?:::[A-Z][A-Za-z0-9_]*)*|[a-z_][a-z0-9_?!]*|\d+|\s+|[^\s\w])/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(line)) !== null) {
      const t = m[0];
      let color: string | undefined;
      if (t.startsWith("'") || t.startsWith('"')) color = CODE_STR;
      else if (t.startsWith('#')) color = CODE_COMMENT;
      else if (/^:[a-z_]/.test(t)) color = CODE_SYM;
      else if (RB_KEYWORDS.has(t)) color = CODE_KW;
      else if (/^[A-Z]/.test(t)) color = 'var(--osd-accent)';
      parts.push({ text: t, color });
    }
    return (
      <div key={lineIdx}>
        {parts.length === 0
          ? ' '
          : parts.map((p, i) =>
              p.color ? (
                <span key={i} style={{ color: p.color }}>
                  {p.text}
                </span>
              ) : (
                <span key={i}>{p.text}</span>
              ),
            )}
      </div>
    );
  });

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

const Fact = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
    <span
      style={{
        display: 'inline-block',
        width: 14,
        height: 14,
        borderRadius: 999,
        background: 'var(--osd-accent)',
        flexShrink: 0,
      }}
    />
    <span style={{ fontSize: 40, lineHeight: 1.3 }}>{children}</span>
  </div>
);

const WhoAmI: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '96px 120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: 28,
        color: 'var(--osd-accent)',
        letterSpacing: '0.04em',
      }}
    >
      $ whoami
    </div>

    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 132,
        fontWeight: 900,
        letterSpacing: '-0.04em',
        lineHeight: 1.0,
        margin: '32px 0 0 0',
      }}
    >
      Waldemar Quevedo
    </h2>

    <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, marginTop: 36 }}>
      <a
        href="https://twitter.com/wallyqs"
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          fontSize: 48,
          fontWeight: 600,
          color: 'var(--osd-accent)',
          textDecoration: 'none',
          letterSpacing: '0.01em',
        }}
      >
        @wallyqs
      </a>
      <span style={{ fontSize: 26, color: muted, letterSpacing: '0.04em' }}>
        <a href="https://twitter.com/wallyqs" style={{ color: muted, textDecoration: 'none' }}>{''}</a>
        {'  ·  '}
        <a href="https://github.com/wallyqs" style={{ color: muted, textDecoration: 'none' }}>{''}</a>
      </span>
    </div>

    <div
      style={{
        marginTop: 72,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <Fact>
        Long-time{' '}
        <a
          href="https://nats.io"
          style={{ color: 'var(--osd-text)', textDecoration: 'underline', textDecorationColor: 'var(--osd-accent)', textUnderlineOffset: 8 }}
        >
          NATS.io
        </a>{' '}
        maintainer
      </Fact>
      <Fact>Forever a Rubyist</Fact>
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

const FoxesDspy: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '80px 120px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <style>{`
      @keyframes osd-foxes-page-turn {
        0%   {
          opacity: 0;
          transform: rotateY(105deg);
          filter: brightness(0.35) saturate(0.6);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        30%  {
          opacity: 1;
          filter: brightness(0.55) saturate(0.75);
        }
        70%  {
          filter: brightness(0.9) saturate(0.95);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
        }
        100% {
          opacity: 1;
          transform: rotateY(0deg);
          filter: brightness(1) saturate(1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        }
      }
    `}</style>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 96,
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        margin: 0,
      }}
    >
      {''}{''}
      <span style={{ color: 'var(--osd-accent)' }}>{''}</span>
    </h2>

    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 48,
        minHeight: 0,
        lineHeight: '1.3',
        perspective: '2200px',
      }}
    >
      <img
        src={foxesDspy}
        alt=""
        style={{
          maxWidth: '120%',
          maxHeight: '180%',
          objectFit: 'contain',
          objectPosition: 'left center',
          background: '#f6f5f0',
          padding: 32,
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
          transformOrigin: 'left center',
          backfaceVisibility: 'hidden',
          animation: ANIMATIONS_DISABLED_FOR_EXPORT ? undefined : 'osd-foxes-page-turn 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both',
        }}
      />
    </div>
  </div>
);

const WhatIsDspy: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '80px 120px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 96,
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 120, width: 120, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>
        In this talk<span style={{ color: 'var(--osd-accent)' }}>...</span>
      </span>
    </h2>

    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 48,
        marginBottom: 32,
        minHeight: 0,
      }}
    >
      <img
        src={dspyAiOrig}
        alt=""
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          objectPosition: 'left center',
          background: '#f6f5f0',
          padding: 32,
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
        }}
      />
    </div>

    <div style={{ display: 'flex', alignItems: 'baseline', gap: 32, flexWrap: 'wrap' }}>
      <a
        href="https://dspy.ai"
        style={{
          fontSize: 41,
          color: 'var(--osd-accent)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        dspy.ai
      </a>
      <span style={{ fontSize: 32, color: muted }}>·</span>
      <a
        href="https://github.com/stanfordnlp/dspy/"
        style={{
          fontSize: 41,
          color: 'var(--osd-accent)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        github.com/stanfordnlp/dspy
      </a>
    </div>
  </div>
);

const DspyAcronym: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '120px 120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 48,
        flexWrap: 'wrap',
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{
          height: 220,
          width: 220,
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 220,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.0,
          color: 'var(--osd-accent)',
        }}
      >
        DSPy
      </span>
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 160,
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: muted,
        }}
      >
        =
      </span>
    </div>

    <style>{`@keyframes osd-acronym-reveal { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    <div
      style={{
        marginTop: 56,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 96,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          opacity: ANIMATIONS_DISABLED_FOR_EXPORT ? 1 : 0,
          animation: ANIMATIONS_DISABLED_FOR_EXPORT ? undefined : 'osd-acronym-reveal 0.55s ease-out 0.4s forwards',
        }}
      >
        <span style={{ color: 'var(--osd-accent)' }}>D</span>eclarative
      </span>{' '}
      <span
        style={{
          display: 'inline-block',
          opacity: ANIMATIONS_DISABLED_FOR_EXPORT ? 1 : 0,
          animation: ANIMATIONS_DISABLED_FOR_EXPORT ? undefined : 'osd-acronym-reveal 0.55s ease-out 1.2s forwards',
        }}
      >
        <span style={{ color: 'var(--osd-accent)' }}>S</span>elf-improving
      </span>{' '}
      <span
        style={{
          display: 'inline-block',
          opacity: ANIMATIONS_DISABLED_FOR_EXPORT ? 1 : 0,
          animation: ANIMATIONS_DISABLED_FOR_EXPORT ? undefined : 'osd-acronym-reveal 0.55s ease-out 2.0s forwards',
        }}
      >
        <span style={{ color: 'var(--osd-accent)' }}>Py</span>thon
      </span>
    </div>
  </div>
);

const OhPython: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      overflow: 'hidden',
    }}
  >
    <img
      src={ohPythonIsInThis}
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </div>
);

const Desiru: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '80px 120px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 88,
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{
          height: 110,
          width: 110,
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />
      <span>
        Prior Work: <span style={{ color: 'var(--osd-accent)' }}>DeSIRu</span> by{' '}
        <span style={{ color: 'var(--osd-accent)' }}>Obie Fernandez</span>
      </span>
    </h2>

    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 48,
        marginBottom: 32,
        minHeight: 0,
      }}
    >
      <img
        src={desiru}
        alt=""
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          objectPosition: 'left center',
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
        }}
      />
    </div>

    <a
      href="https://github.com/obie/desiru"
      style={{
        fontSize: 41,
        color: 'var(--osd-accent)',
        textDecoration: 'none',
        letterSpacing: '0.02em',
        alignSelf: 'flex-start',
      }}
    >
      github.com/obie/desiru
    </a>
  </div>
);

const DspyRb100: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '80px 120px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 88,
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 110, width: 110, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>
        Good news for{' '}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            verticalAlign: 'baseline',
          }}
        >
          Rubyists
          <img
            src={rubyLogo}
            alt=""
            style={{
              height: 110,
              width: 110,
              marginLeft: 24,
              display: 'block',
            }}
          />
        </span>
      </span>
    </h2>

    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 64,
        marginTop: 48,
        marginBottom: 32,
        minHeight: 0,
      }}
    >
      <img
        src={dspyRb100}
        alt=""
        style={{
          maxWidth: '60%',
          maxHeight: '100%',
          objectFit: 'contain',
          objectPosition: 'left center',
          background: '#f6f5f0',
          padding: 32,
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          maxWidth: '36%',
        }}
      >
        <style>{`@keyframes osd-rubyllm-reveal { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <img
          src={rubyllm}
          alt=""
          style={{
            maxWidth: '100%',
            maxHeight: 320,
            objectFit: 'contain',
            borderRadius: 'var(--osd-radius)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
            opacity: ANIMATIONS_DISABLED_FOR_EXPORT ? 1 : 0,
            animation: ANIMATIONS_DISABLED_FOR_EXPORT ? undefined : 'osd-rubyllm-reveal 0.55s ease-out 0.4s forwards',
          }}
        />
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: '1.7',
            opacity: ANIMATIONS_DISABLED_FOR_EXPORT ? 1 : 0,
            animation: ANIMATIONS_DISABLED_FOR_EXPORT ? undefined : 'osd-rubyllm-reveal 0.55s ease-out 1.2s forwards',
          }}
        >
          <span style={{ color: 'var(--osd-accent)' }}>I</span>ncluded
        </div>
      </div>
    </div>

    <a
      href="https://oss.vicente.services/dspy.rb/blog/articles/dspy-rb-1-0-0-release/"
      style={{
        fontSize: 32,
        color: 'var(--osd-accent)',
        textDecoration: 'none',
        letterSpacing: '0.02em',
        alignSelf: 'flex-start',
      }}
    >
      oss.vicente.services/dspy.rb/blog/articles/dspy-rb-1-0-0-release
    </a>
  </div>
);

const DspyPaper: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '80px 120px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 88,
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 110, width: 110, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>
        The <span style={{ color: 'var(--osd-accent)' }}>DSPy</span> paper
      </span>
    </h2>

    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 64,
        marginTop: 40,
        marginBottom: 32,
        minHeight: 0,
      }}
    >
      <img
        src={dspyPaper}
        alt=""
        style={{
          maxWidth: '60%',
          maxHeight: '100%',
          objectFit: 'contain',
          objectPosition: 'left center',
          background: '#f6f5f0',
          padding: 32,
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>
        <div
          style={{ fontFamily: 'var(--osd-font-display)', fontSize: '55px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' }}
        >
          Compiling Declarative Language Model Calls into Self-Improving Pipelines
        </div>
        <div style={{ fontSize: '39px', color: muted, lineHeight: 1.4 }}>
          Khattab et al. · Stanford · 2023
        </div>
      </div>
    </div>

    <a
      href="https://arxiv.org/pdf/2310.03714"
      style={{
        fontSize: 41,
        color: 'var(--osd-accent)',
        textDecoration: 'none',
        letterSpacing: '0.02em',
        alignSelf: 'flex-start',
      }}
    >
      arxiv.org/pdf/2310.03714
    </a>
  </div>
);

const WhyDspy: Page = () => (
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
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 900,
        letterSpacing: '-0.04em',
        lineHeight: 1.0,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 48,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 200, width: 200, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>
        Why <span style={{ color: 'var(--osd-accent)' }}>DSPy</span>?
      </span>
    </h2>
  </div>
);

const ProblemWithPrompting: Page = () => {
  const Row = ({
    problem,
    answer,
    delay,
  }: {
    problem: string;
    answer: React.ReactNode;
    delay: number;
  }) => (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          animation: ANIMATIONS_DISABLED_FOR_EXPORT ? undefined : `osd-row-fade-in 0.5s ease-out ${delay}s both`,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            borderRadius: 999,
            background: 'var(--osd-accent)',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.2 }}>{problem}</span>
      </div>
      <div
        style={{
          fontSize: 44,
          color: muted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '-0.05em',
          animation: ANIMATIONS_DISABLED_FOR_EXPORT ? undefined : `osd-row-fade-in 0.5s ease-out ${delay}s both`,
        }}
      >
        ──▶
      </div>
      <span
        style={{
          fontSize: 44,
          fontWeight: 700,
          color: 'var(--osd-accent)',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          animation: ANIMATIONS_DISABLED_FOR_EXPORT ? undefined : `osd-row-fade-in 0.5s ease-out ${delay}s both`,
        }}
      >
        {answer}
      </span>
    </>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
        padding: '96px 120px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        @keyframes osd-row-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
      <h2
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        <img
          src={dspyPuzzle}
          alt=""
          style={{ height: 90, width: 90, objectFit: 'contain', flexShrink: 0 }}
        />
        <span>
          What is the problem with{' '}
          <span style={{ color: 'var(--osd-accent)' }}>prompting</span>?
        </span>
      </h2>

      <div
        style={{
          flex: 1,
          marginTop: 56,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 80px minmax(0, 1fr)',
          columnGap: 40,
          rowGap: 32,
          alignContent: 'center',
        }}
      >
        <Row
          problem="Brittle prompt strings"
          answer={
            <span
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
              }}
            >
              DSPy::Signature
            </span>
          }
          delay={0.4}
        />
        <Row problem="Manual prompt engineering" answer="Optimizers" delay={1.0} />
        <Row problem="Model lock-in" answer="Prompts port across models" delay={1.6} />
        <Row problem="New model, re-tune everything" answer="Optimizer adapts prompts automatically" delay={2.2} />
      </div>
    </div>
  );
};

const DspyFeatures: Page = () => {
  const Module = ({ name, desc, fade }: { name: string; desc: string; fade?: boolean }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 32,
        animation: fade && !ANIMATIONS_DISABLED_FOR_EXPORT ? 'osd-feature-fade 0.9s ease-out 2.5s forwards' : undefined,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 18,
          height: 18,
          borderRadius: 999,
          background: 'var(--osd-accent)',
          flexShrink: 0,
          transform: 'translateY(-8px)',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
            fontSize: 56,
            fontWeight: 600,
            color: 'var(--osd-text)',
            letterSpacing: '-0.01em',
          }}
        >
          DSPy::<span style={{ color: 'var(--osd-accent)' }}>{name}</span>
        </span>
        <span style={{ fontSize: 36, color: muted, lineHeight: 1.35 }}>{desc}</span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
        padding: '80px 120px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`@keyframes osd-feature-fade { from { opacity: 1; } to { opacity: 0; } }`}</style>
      <h2
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        <img
          src={dspyPuzzle}
          alt=""
          style={{ height: 110, width: 110, objectFit: 'contain', flexShrink: 0 }}
        />
        <span>
          <span style={{ color: 'var(--osd-accent)' }}>DSPy</span> Features
        </span>
      </h2>

      <div
        style={{
          flex: 1,
          marginTop: 56,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: 80,
          rowGap: 36,
          alignContent: 'center',
        }}
      >
        <Module name="Predict" desc="Single-step LLM call with typed I/O" />
        <Module name="ChainOfThought" desc="Step-by-step reasoning, baked in" />
        <Module name="ReAct" desc="Reasoning + tool-use loop" />
      </div>
    </div>
  );
};

const DspyOptimizers: Page = () => {
  const Opt = ({ name, desc, highlight, fade }: { name: string; desc: string; highlight?: boolean; fade?: boolean }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 28,
        animation: fade && !ANIMATIONS_DISABLED_FOR_EXPORT ? 'osd-opt-fade 0.9s ease-out 2.5s forwards' : undefined,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 14,
          height: 14,
          borderRadius: 999,
          background: 'var(--osd-accent)',
          flexShrink: 0,
          transform: 'translateY(-6px)',
          boxShadow: highlight ? '0 0 0 5px rgba(204, 52, 45, 0.18)' : undefined,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 18,
            fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
            fontSize: 42,
            fontWeight: highlight ? 700 : 600,
            color: 'var(--osd-text)',
            letterSpacing: '-0.01em',
          }}
        >
          <span>
            DSPy::<span style={{ color: 'var(--osd-accent)' }}>{name}</span>
          </span>
          {highlight ? (
            <span
              style={{
                fontFamily: 'var(--osd-font-body)',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--osd-accent)',
                border: '2px solid var(--osd-accent)',
                borderRadius: 6,
                padding: '3px 8px',
              }}
            >
              New
            </span>
          ) : null}
        </span>
        <span style={{ fontSize: 28, color: muted, lineHeight: 1.35 }}>{desc}</span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
        padding: '80px 120px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`@keyframes osd-opt-fade { from { opacity: 1; } to { opacity: 0; } }`}</style>
      <h2
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        <img
          src={dspyPuzzle}
          alt=""
          style={{ height: 110, width: 110, objectFit: 'contain', flexShrink: 0 }}
        />
        <span>
          <span style={{ color: 'var(--osd-accent)' }}>DSPy</span> Optimizers
        </span>
      </h2>

      <div
        style={{
          flex: 1,
          marginTop: 56,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 36,
        }}
      >
        <Opt name="MIPROv2" desc="Bayesian search over instructions + demos" fade />
        <Opt name="BootstrapFinetune" desc="Compile your program to a fine-tuned model" fade />
        <Opt name="GEPA" desc="Reflective prompt evolution — LLM critiques and mutates its own prompts" highlight />
      </div>
    </div>
  );
};

const Gepa: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '80px 120px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 88,
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 110, width: 110, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>
        <span style={{ color: 'var(--osd-accent)' }}>GEPA</span>: Reflective Prompt Evolution
      </span>
    </h2>

    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 48,
        marginBottom: 32,
        minHeight: 0,
      }}
    >
      <img
        src={gepaImg}
        alt=""
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          objectPosition: 'left center',
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
        }}
      />
    </div>

    <a
      href="https://www.youtube.com/watch?v=HbGah-uP1fI"
      style={{
        fontSize: 32,
        color: 'var(--osd-accent)',
        textDecoration: 'none',
        letterSpacing: '0.01em',
        alignSelf: 'flex-start',
        lineHeight: 1.3,
      }}
    >
      GEPA: Reflective Prompt Evolution
    </a>
  </div>
);

const OptimizersInPractice: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '80px 120px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 88,
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 110, width: 110, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>
        Optimizers <span style={{ color: 'var(--osd-accent)' }}>in practice</span>
      </span>
    </h2>

    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 48,
        marginBottom: 32,
        minHeight: 0,
      }}
    >
      <img
        src={optimizersImg}
        alt=""
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          objectPosition: 'left center',
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
        }}
      />
    </div>

    <a
      href="https://www.youtube.com/watch?v=bxToahwOVpY&t=1247s"
      style={{
        fontSize: 30,
        color: 'var(--osd-accent)',
        textDecoration: 'none',
        letterSpacing: '0.01em',
        alignSelf: 'flex-start',
        lineHeight: 1.3,
      }}
    >
      From One-Shot to Agentic: Optimizing Shop Intelligence with DSPy @ Shopify Scale
    </a>
  </div>
);

const GemInstall: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}
  >
    <div
      style={{
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: 96,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        display: 'flex',
        alignItems: 'baseline',
        gap: 36,
      }}
    >
      <span style={{ color: 'var(--osd-accent)' }}>$</span>
      <span>
        gem install <span style={{ color: 'var(--osd-accent)' }}>dspy</span>
      </span>
    </div>
  </div>
);

const DspyPredict: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '48px 64px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 52,
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 68, width: 68, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>Sample module using DSPy::Predict</span>
    </h2>

    <div
      style={{
        marginTop: 24,
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#15151a',
        borderRadius: 'var(--osd-radius)',
        overflow: 'hidden',
        border: '1px solid #222228',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div
        style={{
          background: '#1d1d23',
          padding: '12px 28px',
          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          fontSize: 22,
          color: muted,
          borderBottom: '1px solid #2a2a30',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: 999,
            background: 'var(--osd-accent)',
          }}
        />
        dspy_predict.rb
      </div>

      <div
        style={{
          flex: 1,
          padding: '24px 32px',
          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          fontSize: 26,
          lineHeight: 1.4,
          color: '#e6e4dc',
          whiteSpace: 'pre',
          overflow: 'hidden',
        }}
      >
        {highlightRuby(dspyPredictSource)}
      </div>
    </div>
  </div>
);

const DspyChainOfThought: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '48px 64px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 52,
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 68, width: 68, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>Sample module using DSPy::ChainOfThought</span>
    </h2>

    <div
      style={{
        marginTop: 24,
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#15151a',
        borderRadius: 'var(--osd-radius)',
        overflow: 'hidden',
        border: '1px solid #222228',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div
        style={{
          background: '#1d1d23',
          padding: '12px 28px',
          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          fontSize: 22,
          color: muted,
          borderBottom: '1px solid #2a2a30',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: 999,
            background: 'var(--osd-accent)',
          }}
        />
        chain_of_thought.rb
      </div>

      <div
        style={{
          flex: 1,
          padding: '24px 32px',
          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          fontSize: 26,
          lineHeight: 1.4,
          color: '#e6e4dc',
          whiteSpace: 'pre',
          overflow: 'hidden',
        }}
      >
        {highlightRuby(chainOfThoughtSource)}
      </div>
    </div>
  </div>
);

const DspyReAct: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '48px 64px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 52,
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 68, width: 68, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>Sample agent using DSPy::ReAct</span>
    </h2>

    <div
      style={{
        marginTop: 24,
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#15151a',
        borderRadius: 'var(--osd-radius)',
        overflow: 'hidden',
        border: '1px solid #222228',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div
        style={{
          background: '#1d1d23',
          padding: '12px 28px',
          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          fontSize: 22,
          color: muted,
          borderBottom: '1px solid #2a2a30',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: 999,
            background: 'var(--osd-accent)',
          }}
        />
        react_search_agent.rb
      </div>

      <div
        style={{
          flex: 1,
          padding: '20px 32px',
          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          fontSize: 20,
          lineHeight: 1.4,
          color: '#e6e4dc',
          whiteSpace: 'pre',
          overflow: 'hidden',
        }}
      >
        {highlightRuby(reactSource)}
      </div>
    </div>
  </div>
);

const WhatIsCodingAgent: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '80px 120px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 72,
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 90, width: 90, objectFit: 'contain', flexShrink: 0 }}
      />
      <span>
        What is a <span style={{ color: 'var(--osd-accent)' }}>Coding Agent</span>?
      </span>
    </h2>

    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 48,
      }}
    >
      <blockquote
        style={{
          margin: 0,
          padding: '0 0 0 48px',
          borderLeft: '8px solid var(--osd-accent)',
          fontFamily: 'var(--osd-font-display)',
          fontSize: 64,
          fontStyle: 'italic',
          fontWeight: 500,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          color: 'var(--osd-text)',
          maxWidth: 1600,
        }}
      >
        &ldquo;The main agent loop today is a{' '}
        <span style={{ color: 'var(--osd-accent)', fontStyle: 'normal', fontWeight: 700 }}>
          ReAct
        </span>{' '}
        loop: the model reasons, takes an action via a tool call, observes the result, and
        repeats.&rdquo;
      </blockquote>

      <div
        style={{
          marginTop: 40,
          paddingLeft: 56,
          fontSize: 36,
          color: muted,
          letterSpacing: '0.02em',
          lineHeight: 1.3,
        }}
      >— Addy Osmani, Google Cloud AI Director  and Author of 'Beyond Vibe Coding' from O'Reilly</div>
    </div>

    <a
      href="https://addyosmani.com/blog/agent-harness-engineering/"
      style={{
        fontSize: 28,
        color: 'var(--osd-accent)',
        textDecoration: 'none',
        letterSpacing: '0.01em',
        alignSelf: 'flex-start',
      }}
    >
      addyosmani.com/blog/agent-harness-engineering
    </a>
  </div>
);

const Demo: Page = () => (
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
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 900,
        letterSpacing: '-0.04em',
        lineHeight: 1.0,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 48,
      }}
    >
      <img
        src={dspyPuzzle}
        alt=""
        style={{ height: 200, width: 200, objectFit: 'contain', flexShrink: 0 }}
      />
      <span style={{ color: 'var(--osd-accent)' }}>Demo</span>
    </h2>
    <p
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 56,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        color: muted,
        margin: '40px 0 0 0',
      }}
    >
      Simple Coding Agent in{' '}
      <span style={{ color: 'var(--osd-text)' }}>Ruby</span>
    </p>
  </div>
);

const Thanks: Page = () => {
  const Section = ({
    label,
    links,
  }: {
    label: string;
    links: { href: string; text: string; note?: string }[];
  }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: muted,
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {links.map(({ href, text, note }) => (
          <div key={href} style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <span
              style={{
                display: 'inline-block',
                width: 11,
                height: 11,
                borderRadius: 999,
                background: 'var(--osd-accent)',
                flexShrink: 0,
                transform: 'translateY(-3px)',
              }}
            />
            <a
              href={href}
              style={{
                fontSize: 34,
                color: 'var(--osd-accent)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                lineHeight: 1.25,
              }}
            >
              {text}
            </a>
            {note ? (
              <span style={{ fontSize: 24, color: muted, letterSpacing: '0.01em' }}>{note}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
        padding: '120px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 0.85fr) minmax(0, 1fr)',
        columnGap: 96,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            margin: 0,
          }}
        >
          Thanks<span style={{ color: 'var(--osd-accent)' }}>!</span>
        </h2>

        <a
          href="https://twitter.com/wallyqs"
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
            fontSize: 52,
            fontWeight: 600,
            color: 'var(--osd-accent)',
            textDecoration: 'none',
            letterSpacing: '0.01em',
            marginTop: 48,
          }}
        >
          @wallyqs
        </a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <Section
          label="DSPy.rb"
          links={[
            { href: 'https://github.com/vicentereig/dspy.rb', text: 'github.com/vicentereig/dspy.rb' },
            {
              href: 'https://github.com/vicentereig/dspy.rb/tree/main/examples',
              text: 'github.com/vicentereig/dspy.rb/tree/main/examples',
            },
            { href: 'https://oss.vicente.services/dspy.rb', text: 'oss.vicente.services/dspy.rb' },
          ]}
        />
        <Section
          label="DSPy"
          links={[
            { href: 'https://dspy.ai', text: 'dspy.ai' },
            { href: 'https://github.com/stanfordnlp/dspy', text: 'github.com/stanfordnlp/dspy' },
            { href: 'https://arxiv.org/abs/2310.03714', text: 'arxiv.org/abs/2310.03714', note: 'paper' },
          ]}
        />
        <Section
          label="Reading"
          links={[
            {
              href: 'https://www.dbreunig.com/2025/06/10/let-the-model-write-the-prompt.html',
              text: 'dbreunig.com — Let the model write the prompt',
            },
          ]}
        />
      </div>
    </div>
  );
};

export const meta: SlideMeta = { title: 'Building Agents with DSPy in Ruby', theme: 'corporate' };

export default [Intro, LetsTalkRuby, WhatIsDspy, DspyPaper, DspyAcronym, OhPython, DspyRb100, GemInstall, Desiru, FoxesDspy, WhyDspy, ProblemWithPrompting, DspyFeatures, DspyPredict, DspyChainOfThought, DspyReAct, WhatIsCodingAgent, Demo, DspyOptimizers, Gepa, OptimizersInPractice, Thanks] satisfies Page[];
