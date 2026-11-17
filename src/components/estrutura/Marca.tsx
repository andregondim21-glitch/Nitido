import { useId } from "react";

/** Metade tinta, metade hachura: cor e textura dizendo a mesma coisa. */
export function Marca({ tamanho = 26 }: { tamanho?: number }) {
  const id = useId();
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 26 26" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="1.7" height="4" fill="currentColor" />
        </pattern>
      </defs>
      <path d="M13 2a11 11 0 0 0 0 22Z" fill="currentColor" />
      <path d="M13 2a11 11 0 0 1 0 22Z" fill={`url(#${id})`} />
      <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
