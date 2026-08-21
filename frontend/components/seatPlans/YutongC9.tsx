import React from 'react';
import { Frame, Row2x2, Seat, SIDE_MARGIN, TOP_MARGIN, SEAT_H, ROW_GAP, rowY, width2x2 } from './SeatPlanBase';

// Layout for the Yutong C9 (9m coach): 37 passenger seats in a straight 2+2
// configuration (nine full rows = 36 seats) plus one extra seat in a
// slightly widened rear row, matching the "rangée arrière élargie" seen on
// the owner's on-site seating sketch. Two separate crew seats (driver +
// second crew member) sit at the front, apart from the 37 passenger seats,
// behind a single front door. Reconstructed from the sketch and the owner's
// description, not an official Yutong cabin diagram.
const COACH_ROWS = 9;
const REAR_EXTRA_ROW = COACH_ROWS;
const TOTAL_ROW_SLOTS = COACH_ROWS + 1;

const YutongC9: React.FC = () => {
  const width = width2x2();
  const height = TOP_MARGIN + TOTAL_ROW_SLOTS * (SEAT_H + ROW_GAP) + 24;
  const doorX = width - SIDE_MARGIN - 30;

  return (
    <Frame width={width} height={height} frontDoorX={doorX} driverSide="left" crewSide="right">
      {Array.from({ length: COACH_ROWS }).map((_, i) => (
        <Row2x2 key={i} row={i} rowLabel={String(i + 1)} />
      ))}
      <Seat x={SIDE_MARGIN} y={rowY(REAR_EXTRA_ROW)} label={`${REAR_EXTRA_ROW + 1}A`} />
    </Frame>
  );
};

export default YutongC9;
