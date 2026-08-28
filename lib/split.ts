'use client';

/**
 * Hand-rolled character splitter, standing in for GSAP's club-only SplitText.
 *
 * Two things a naive implementation gets wrong:
 *
 *  1. Reading textContent and rebuilding it FLATTENS nested markup, so the
 *     <span class="accent-word"> that colours part of a heading disappears.
 *     This walks child nodes and replaces only text nodes in place.
 *  2. A screen reader hitting <span>W</span><span>E</span> announces letters
 *     individually. Setting aria-label on the root makes it override its own
 *     contents, so the heading is still read as a sentence.
 *
 * Each glyph gets a clipping mask parent, which is what allows a
 * y: 110% -> 0 reveal to look like the letter rising out of the baseline.
 */

export interface SplitResult {
  /** The inner span of each glyph. Animate THESE, not the masks. */
  chars: HTMLElement[];
  /** Restores the original markup. Call on unmount. */
  revert: () => void;
}

export function splitChars(root: HTMLElement): SplitResult {
  // Idempotent: React strict mode runs effects twice in development.
  if (root.dataset.split === 'true') {
    return {
      chars: Array.from(root.querySelectorAll<HTMLElement>('.split-char__inner')),
      revert: () => {},
    };
  }

  const original = root.innerHTML;
  const label = root.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const chars: HTMLElement[] = [];

  // Collect first: replacing nodes while walking a live tree skips siblings.
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.textContent && node.textContent.trim() !== '') textNodes.push(node as Text);
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const frag = document.createDocumentFragment();
    // Capturing split keeps the whitespace runs so words stay separated.
    for (const chunk of textNode.data.split(/(\s+)/)) {
      if (chunk === '') continue;
      if (/^\s+$/.test(chunk)) {
        frag.appendChild(document.createTextNode(chunk));
        continue;
      }
      // A word wrapper with nowrap stops a single word breaking mid-glyph
      // when each character becomes its own inline-block.
      const word = document.createElement('span');
      word.className = 'split-word';
      for (const ch of Array.from(chunk)) {
        const mask = document.createElement('span');
        mask.className = 'split-char';
        const inner = document.createElement('span');
        inner.className = 'split-char__inner';
        inner.textContent = ch;
        mask.appendChild(inner);
        word.appendChild(mask);
        chars.push(inner);
      }
      frag.appendChild(word);
    }
    textNode.replaceWith(frag);
  }

  root.setAttribute('aria-label', label);
  root.dataset.split = 'true';

  return {
    chars,
    revert: () => {
      root.innerHTML = original;
      root.removeAttribute('aria-label');
      delete root.dataset.split;
    },
  };
}
