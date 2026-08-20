import React from 'react';
import { Frame, Row2x2, Seat, SIDE_MARGIN, TOP_MARGIN, SEAT_H, ROW_GAP, rowY, width2x2 } from './SeatPlanBase';

// Indicative layout for a 37-seat configuration of the Yutong C9 (9m coach):
// a single seat near the front door (a common arrangement on coaches this
// size) followed by nine 2+2 rows (36 seats). Not an official Yutong cabin
// diagram — Yutong does not publish a seat-by-seat plan for this model.
const COACH_ROWS = 9;
const TOTAL_ROW_SLOTS = COACH_ROWS + 1;

const YutongC9: React.FC = () => {
  const width = width2x2();
  const height = TOP_MARGIN + TOTAL_ROW_SLOTS * (SEAT_H + ROW_GAP) + 24;
  const doorX = width - SIDE_MARGIN - 30;

  return (
    <Frame width={width} height={height} frontDoorX={doorX}>
      <Seat x={SIDE_MARGIN} y={rowY(0)} label="0A" />
      {Array.from({ length: COACH_ROWS }).map((_, i) => (
        <Row2x2 key={i} row={i + 1} rowLabel={String(i + 1)} />
      ))}
    </Frame>
  );
};

export default YutongC9;
