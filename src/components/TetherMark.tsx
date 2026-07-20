interface TetherMarkProps {
  className?: string;
}

/** Glyphe USDT (Tether) inline — pas de dépendance réseau. */
const TetherMark = ({ className }: TetherMarkProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-label="USDT">
    <circle cx="12" cy="12" r="12" fill="#26A17B" />
    <path
      fill="#fff"
      d="M13.5 10.4v-1.3h3V7H7.5v2.1h3v1.3c-2.4.1-4.2.6-4.2 1.2 0 .6 1.8 1.1 4.2 1.2v4.1h3v-4.1c2.4-.1 4.2-.6 4.2-1.2 0-.6-1.8-1.1-4.2-1.2zm0 2v-1c-.1 0-.7.1-1.5.1-.7 0-1.2 0-1.5-.1v1c-2-.1-3.4-.5-3.4-.9 0-.4 1.4-.8 3.4-.9v1.2c.3 0 .8.1 1.5.1.8 0 1.4-.1 1.5-.1v-1.2c2 .1 3.4.5 3.4.9 0 .4-1.4.8-3.4.9z"
    />
  </svg>
);

export default TetherMark;
