import React from 'react';
import { DoorMarker, Frame, Row1x1, TOP_MARGIN, SEAT_H, ROW_GAP, width1x1, SIDE_MARGIN } from './SeatPlanBase';

// Layout for the Yutong V6 minivan: 14 individual "captain's chair" passenger
// seats (one on each side of the aisle, 7 rows) and two doors both at the
// front, close together — matching the owner's on-site seating sketch and
// confirmed seat count (corrected from an earlier, less accurate 15/one-door
// estimate). Reconstructed from the sketch and the owner's description, not
// an official Yutong cabin diagram.
const ROWS = 7;

const YutongV6: React.FC = () => {
  const width = width1x1();
  const height = TOP_MARGIN + ROWS * (SEAT_H + ROW_GAP) + 24;
  const door1X = width - SIDE_MARGIN - 30;
  const door2X = door1X - 34;

  return (
    <Frame width={width} height={height} frontDoorX={door1X} driverSide="right">
      <DoorMarker x={door2X} y={44} />
      {Array.from({ length: ROWS }).map((_, i) => (
        <Row1x1 key={i} row={i} rowLabel={String(i + 1)} />
      ))}
    </Frame>
  );
};

export default YutongV6;
