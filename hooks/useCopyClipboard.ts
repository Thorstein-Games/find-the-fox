import { useCallback, useEffect, useState } from 'react';

/** Copy text to the clipboard; `isCopied` stays true for `resetMs`. (Replaces react-recipes' hook of the same name.) */
export default function useCopyClipboard(resetMs = 2000): [boolean, (text: string) => void] {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return undefined;
    const timer = setTimeout(() => setIsCopied(false), resetMs);
    return () => clearTimeout(timer);
  }, [isCopied, resetMs]);

  const copy = useCallback((text: string) => {
    const fallback = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(fallback);
    } else {
      fallback();
    }
    setIsCopied(true);
  }, []);

  return [isCopied, copy];
}
