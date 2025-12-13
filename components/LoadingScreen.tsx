'use client';

export default function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-body)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        {/* Arvo Labs Text */}
        <h1
          style={{
            fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
            fontSize: '48px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          Arvo Labs
        </h1>

        {/* Loading Bar Container */}
        <div
          style={{
            width: '300px',
            height: '4px',
            background: 'var(--bg-surface)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Loading Bar */}
          <div
            className="loading-bar"
            style={{
              height: '100%',
              width: '30%',
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
              borderRadius: '2px',
              position: 'absolute',
              left: 0,
              top: 0,
              animation: 'loadingBarAnimation 1.5s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
