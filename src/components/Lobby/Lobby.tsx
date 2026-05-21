import { LOBBY_GAMES, type GameId } from '../../lobby/games';
import './Lobby.css';

type LobbyProps = {
  onSelectGame: (id: GameId) => void;
};

export function Lobby({ onSelectGame }: LobbyProps) {
  return (
    <div className="lobby">
      <header className="lobby__header">
        <h1 className="lobby__title">Fraction Games</h1>
        <p className="lobby__sub">Pick a mission — each game teaches fractions a different way.</p>
      </header>

      <ul className="lobby__grid">
        {LOBBY_GAMES.map((game) => (
          <li key={game.id}>
            <button
              type="button"
              className="lobby__tile"
              data-theme={game.theme}
              style={{ '--tile-accent': game.accent } as React.CSSProperties}
              onClick={() => onSelectGame(game.id)}
            >
              <span className="lobby__tile-icon" aria-hidden>
                {game.icon}
              </span>
              <span className="lobby__tile-title">{game.title}</span>
              <span className="lobby__tile-sub">{game.subtitle}</span>
              <span className="lobby__tile-desc">{game.description}</span>
              {!game.available && (
                <span className="lobby__tile-badge">Coming soon</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
