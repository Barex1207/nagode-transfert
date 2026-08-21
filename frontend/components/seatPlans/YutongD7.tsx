import React from 'react';
import { Frame, Row2x2, RearBench, TOP_MARGIN, SEAT_H, ROW_GAP, width2x2, SIDE_MARGIN } from './SeatPlanBase';

// Layout for the Yutong D7 midibus: 25 passenger seats — five 2+2 rows (20
// seats) plus a widened 5-across rear bench (no aisle gap), with the driver
// and the single front door both on the left, matching the owner's on-site
// seating sketch. Corrected from an earlier, less accurate 24-seat/right-door
// estimate. Reconstructed from the sketch and the owner's description, not
// an official Yutong cabin diagram.
const MID_ROWS = 5;
const BENCH_ROW = MID_ROWS;
const TOTAL_ROW_SLOTS = MID_ROWS + 1;

const YutongD7: React.FC = () => {
  const width = width2x2();
  const height = TOP_MARGIN + TOTAL_ROW_SLOTS * (SEAT_H + ROW_GAP) + 24;
  const doorX = SIDE_MARGIN;

  return (
    <Frame width={width} height={height} frontDoorX={doorX} driverSide="left">
      {Array.from({ length: MID_ROWS }).map((_, i) => (
        <Row2x2 key={i} row={i} rowLabel={String(i + 1)} />
      ))}
      <RearBench row={BENCH_ROW} width={width} count={5} rowLabel={String(BENCH_ROW + 1)} />
    </Frame>
  );
};

export default YutongD7;
