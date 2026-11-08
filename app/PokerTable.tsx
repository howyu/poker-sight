import Link from "next/link";

type PokerSeat = {
  position: string;
  name?: string;
  stack?: string;
  action: string;
  hero?: boolean;
  active?: boolean;
};

type PokerTableProps = {
  seats: readonly PokerSeat[];
  pot: string;
  seatHref?: string;
  className?: string;
};

export default function PokerTable({ seats, pot, seatHref, className }: PokerTableProps) {
  return (
    <div className={className ? `pokerStage ${className}` : "pokerStage"}>
      <div className="pokerRail">
        <div className="pokerFelt">
          <div className="feltMark">POKERSIGHT</div>
          <div className="potDisplay"><small>POT</small><strong>{pot}</strong><span>Preflop</span></div>
          <div className="boardGhost" aria-label="五张公共牌尚未发出">
            <i /><i /><i /><i /><i />
          </div>
        </div>
      </div>
      {seats.map((seat) => {
        const { position } = seat;
        const seatClass = `tableSeat seat-${position.toLowerCase()}${seat.hero ? " hero" : ""}`;
        const details = (
          <>
            <div className="avatar">{seat.hero ? "YOU" : position}</div>
            <div className="seatMeta">
              <div className="seatLine">
                <strong>{position}</strong>
                {position === "BTN" && <span className="dealerChip">D</span>}
                {(position === "SB" || position === "BB") && <span className="blindChip">{position}</span>}
              </div>
              {seat.name && <span>{seat.name}</span>}
              {seat.stack && <small>{seat.stack}</small>}
            </div>
            <em className={seat.active ? "actionTag active" : "actionTag"}>{seat.action}</em>
          </>
        );
        return seatHref ? (
          <Link href={seatHref} key={position} className={seatClass}>{details}</Link>
        ) : (
          <div key={position} className={seatClass}>{details}</div>
        );
      })}
    </div>
  );
}
