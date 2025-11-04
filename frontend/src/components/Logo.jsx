import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo component
 *
 * Usage notes:
 * - Place your logo image at `frontend/public/careerconnect-logo.png` (recommended ~240–360px wide)
 * - Optionally add a @2x for HiDPI: `frontend/public/careerconnect-logo@2x.png`
 * - This component renders an <img> with subtle shadow and hover treatment
 */
const Logo = ({ to = '/', className = '', heightClass = 'h-10 md:h-12', showTextFallback = false, iconOnly = false }) => {
  // Try several common filenames to reduce setup friction
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+/g, '/');
  const withBase = (p) => `${base}${p.replace(/^\//, '')}`;
  const candidates = React.useMemo(
    () => [
      { src: withBase('/careerconnect-logo.png'), srcSet: withBase('/careerconnect-logo@2x.png') + ' 2x' },
      { src: withBase('/careerconnect-logo.jpg') },
      { src: withBase('/careerconnect-logo.jpeg') },
      { src: withBase('/careerconnect-logo.webp') },
      { src: withBase('/logo.png') },
      { src: withBase('/logo.jpg') },
      { src: withBase('/logo.webp') },
    ],
    [base]
  );

  const [idx, setIdx] = React.useState(0);
  const [imgError, setImgError] = React.useState(false);

  const handleError = () => {
    if (idx < candidates.length - 1) {
      setIdx((i) => i + 1);
    } else {
      setImgError(true);
      // Helpful log so developers know what to do
      // Only warn in development to avoid noisy console messages in production/users' consoles
      if (import.meta.env && import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn(
          'Logo image not found. Add a logo to frontend/public (e.g. careerconnect-logo.png or careerconnect-logo.webp) to avoid this message.'
        );
      }
    }
  };

  const current = candidates[idx];

  const imgEl = (
    <img
      key={current.src}
      src={current.src}
      srcSet={current.srcSet}
      alt="CareerConnect — Your path to opportunity"
      className={
        iconOnly
          ? 'h-full w-full object-cover object-left select-none pointer-events-none'
          : `${heightClass} w-auto drop-shadow-sm dark:drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] select-none pointer-events-none`
      }
      onError={handleError}
      draggable={false}
    />
  );

  const img = iconOnly ? (
    <div className={`${heightClass} aspect-square overflow-hidden rounded-md drop-shadow-sm dark:drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] bg-transparent`}>{imgEl}</div>
  ) : (
    imgEl
  );

  const fallback = (
    <div className={`flex items-center ${heightClass}`} aria-label="CareerConnect">
      <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-400 dark:via-primary-500 dark:to-primary-600 bg-clip-text text-transparent tracking-tight">
        CareerConnect
      </div>
      {showTextFallback && (
        <span className="sr-only">CareerConnect — Your path to opportunity</span>
      )}
    </div>
  );

  const content = imgError ? fallback : img;

  return to ? (
    <Link to={to} className={`inline-flex items-center ${className}`} aria-label="CareerConnect Home">
      {content}
    </Link>
  ) : (
    <div className={`inline-flex items-center ${className}`}>{content}</div>
  );
};

export default Logo;
