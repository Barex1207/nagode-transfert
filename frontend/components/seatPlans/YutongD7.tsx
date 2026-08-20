import React from 'react';
import { Frame, Row2x2, TOP_MARGIN, SEAT_H, ROW_GAP, width2x2, SIDE_MARGIN } from './SeatPlanBase';

// Indicative layout for a 24-seat configuration of the Yutong D7 (7.7m
// midibus): six 2+2 rows. Not an official Yutong cabin diagram.
const ROWS = 6;

const YutongD7: React.FC = () => {
  const width = width2x2();
  const height = TOP_MARGIN + ROWS * (SEAT_H + ROW_GAP) + 24;
  const doorX = width - SIDE_MARGIN - 30;

  return (
    <Frame width={width} height={height} frontDoorX={doorX}>
      {Array.from({ length: ROWS }).map((_, i) => (
        <Row2x2 key={i} row={i} rowLabel={String(i + 1)} />
      ))}
    </Frame>
  );
};

export default YutongD7;
