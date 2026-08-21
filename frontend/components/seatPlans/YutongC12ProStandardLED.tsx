import React from 'react';
import {
  DoorMarker,
  Frame,
  Row2x2,
  RearBench,
  Seat,
  TOP_MARGIN,
  SEAT_H,
  SEAT_W,
  ROW_GAP,
  rowY,
  width2x2,
  SIDE_MARGIN,
} from './SeatPlanBase';

// Layout for the Yutong C12 Pro Standard — chassis ZK6129D (WITH ambient LED
// lighting): 52 passenger seats — the same base as the ZK6120D1 (twelve 2+2
// rows + a widened 3-seat rear bench = 51) plus one extra individual "mono
// place" seat near the front door, which is the one real physical
// difference the owner's sketch shows between the two chassis (beyond the
// lighting). Same crew seating and two-door layout as the ZK6120D1.
// Reconstructed from the sketch and the owner's description, not an
// official Yutong cabin diagram.
const ROWS = 12;
const EXTRA_SEAT_ROW = 0;
const BENCH_ROW = ROWS + 1;
const MID_DOOR_ROW = 7;

const YutongC12ProStandardLED: React.FC = () => {
  const width = width2x2();
  const height = TOP_MARGIN + (ROWS + 2) * (SEAT_H + ROW_GAP) + 24;
  const door1X = width - SIDE_MARGIN - 30;
  const extraSeatX = width - SIDE_MARGIN - SEAT_W;

  return (
    <Frame width={width} height={height} frontDoorX={door1X} driverSide="left" crewSide="right">
      <DoorMarker x={door1X} y={rowY(MID_DOOR_ROW) - 10} />
      <Seat x={extraSeatX} y={rowY(EXTRA_SEAT_ROW)} label="0A" />
      {Array.from({ length: ROWS }).map((_, i) => (
        <Row2x2 key={i} row={i + 1} rowLabel={String(i + 1)} />
      ))}
      <RearBench row={BENCH_ROW} width={width} count={3} rowLabel={String(ROWS + 1)} />
    </Frame>
  );
};

export default YutongC12ProStandardLED;
