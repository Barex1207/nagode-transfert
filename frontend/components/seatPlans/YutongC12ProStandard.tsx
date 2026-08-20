import React from 'react';
import { Frame, Row2x2, Seat, TOP_MARGIN, SEAT_H, SEAT_W, ROW_GAP, rowY, width2x2, SIDE_MARGIN } from './SeatPlanBase';

// Indicative layout for a 51-seat configuration of the Yutong C12 Pro
// (Standard, 12m coach): twelve 2+2 rows (48 seats) plus a 3-across rear
// bench (3 seats), a common way 12m coaches reach this total. Not an
// official Yutong cabin diagram, though the 51-seat total matches Yutong's
// published spec for this coach length.
const ROWS = 12;

const YutongC12ProStandard: React.FC = () => {
  const width = width2x2();
  const height = TOP_MARGIN + (ROWS + 1) * (SEAT_H + ROW_GAP) + 24;
  const doorX = width - SIDE_MARGIN - 30;

  const benchY = rowY(ROWS);
  const innerWidth = width - 2 * SIDE_MARGIN;
  const gap = (innerWidth - 3 * SEAT_W) / 4;
  const bx1 = SIDE_MARGIN + gap;
  const bx2 = bx1 + SEAT_W + gap;
  const bx3 = bx2 + SEAT_W + gap;

  return (
    <Frame width={width} height={height} frontDoorX={doorX}>
      {Array.from({ length: ROWS }).map((_, i) => (
        <Row2x2 key={i} row={i} rowLabel={String(i + 1)} />
      ))}
      <Seat x={bx1} y={benchY} label="13A" />
      <Seat x={bx2} y={benchY} label="13B" />
      <Seat x={bx3} y={benchY} label="13C" />
    </Frame>
  );
};

export default YutongC12ProStandard;
