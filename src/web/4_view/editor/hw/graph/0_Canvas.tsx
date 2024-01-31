import { CSSProperties, FC, MouseEvent, ReactNode, useEffect, useMemo, useRef, useState, WheelEvent } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { GRID } from "~/consts";
import { posAdd, Position, posMul, posSub } from "~/utils";
import { mousePositionState, svgOffsetStoreState, svgScaleStoreState, useColor } from "~/web/2_store";
import { useCanvasBackground, useCanvasForeground } from "~/web/3_facade";

export const Canvas: FC<{
  containerStyle?: CSSProperties;
  svgStyle?: CSSProperties;
  children?: ReactNode;
}> = ({ containerStyle, svgStyle, children }) => {
  // External states
  const fore = useCanvasForeground();
  const back = useCanvasBackground();
  const color = useColor();

  // Container
  const [containerSize, setContainerSize] = useState<Position>([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entry) => {
      setContainerSize([entry[0].contentRect.width, entry[0].contentRect.height]);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // SVG Viewbox
  const [svgOffset, setSvgOffset] = useState<Position>([0, 0]);
  const [svgOffsetStore, setSvgOffsetStore] = useRecoilState(svgOffsetStoreState);
  useEffect(() => setSvgOffsetStore(svgOffset), [svgOffset]); // Store
  useEffect(() => setSvgOffset(svgOffsetStore), []); // Load on Mounted

  const [svgScale, setSvgScale] = useState(1);
  const [svgScaleStore, setSvgScaleStore] = useRecoilState(svgScaleStoreState);
  useEffect(() => setSvgScaleStore(svgScale), [svgScale]); //Store
  useEffect(() => setSvgScale(svgScaleStore), []); // Load on Mounted

  const svgSize = useMemo<Position>(() => posMul(containerSize, svgScale), [containerSize, svgScale]);
  const svgViewBox = useMemo(() => [...svgOffset, ...svgSize].join(" "), [svgOffset, svgSize]);

  // Mouse Position
  const [globalMousePosition, setGlobalMousePosition] = useState<Position>([0, 0]);
  const updateMousePosition = (e: MouseEvent) => {
    const { x: containerX, y: containerY } = containerRef.current?.getBoundingClientRect() ?? { x: 0, y: 0 };
    const gpos: Position = [e.clientX - containerX, e.clientY - containerY];
    setGlobalMousePosition(gpos);
    if (isDragging) setSvgOffset(posAdd(posMul(posSub(startMousePositionGlobal, gpos), svgScale), startOffset));
  };
  const setMousePosition = useSetRecoilState(mousePositionState);
  useEffect(() => {
    setMousePosition(posAdd(posMul(globalMousePosition, svgScale), svgOffset));
  }, [svgScale, globalMousePosition, svgOffset]);

  // Drag
  const [isDragging, setIsDragging] = useState(false);
  const [startMousePositionGlobal, setStartMousePositionGlobal] = useState<Position>([0, 0]);
  const [startOffset, setStartOffset] = useState<Position>([0, 0]);
  const startDrag = () => {
    setStartMousePositionGlobal(globalMousePosition);
    setStartOffset(svgOffset);
    setIsDragging(true);
  };
  const endDrag = () => setIsDragging(false);

  // Scale Event
  const changeScale = (e: WheelEvent) => {
    const DELTA_SCALE = 0.1; //
    const deltaScale = e.deltaY > 0 ? DELTA_SCALE : svgScale > DELTA_SCALE + DELTA_SCALE / 2 ? -DELTA_SCALE : 0;
    setSvgOffset(posSub(svgOffset, posMul(globalMousePosition, deltaScale)));
    setSvgScale(svgScale + deltaScale);
  };

  return (
    <div ref={containerRef} style={{ overflow: "hidden", ...containerStyle }}>
      <svg
        style={{ background: color.gray.white, userSelect: "none", ...svgStyle }}
        viewBox={svgViewBox}
        onMouseMove={updateMousePosition}
        onMouseDown={(e) => {
          if (e.button === 1) startDrag();
        }}
        onMouseUp={(e) => {
          if (e.button === 1) endDrag();
          if (e.button === 0) fore.onMouseUp(e);
        }}
        onClick={(e) => {
          if (e.button === 0) fore.onClick(e);
        }}
        onWheel={changeScale}
      >
        <g
          onMouseDown={(e) => {
            if (e.button === 0) {
              back.onMouseDown();
            }
          }}
          onClick={(e) => {
            if (e.button === 0) {
              back.onClick();
            }
          }}
        >
          <Grid offset={svgOffset} />
        </g>
        {children}
      </svg>
    </div>
  );
};

const Grid: FC<{ offset: Position; interval?: [number, number]; strokeWidth?: [number, number] }> = ({
  offset,
  interval = [GRID * 5, GRID],
  strokeWidth = [1, 0.5],
}) => {
  const color = useColor();
  const [mainInterval, subInterval] = interval;
  const [mainLineWidth, subLineWidth] = strokeWidth;
  return (
    <>
      <defs>
        <pattern id="smallGrid" width={subInterval} height={subInterval} patternUnits="userSpaceOnUse">
          <path d={`M ${subInterval} 0 L 0 0 0 ${subInterval}`} fill="none" stroke={color.gray.mid} strokeWidth={subLineWidth} />
        </pattern>
        <pattern id="grid" width={mainInterval} height={mainInterval} patternUnits="userSpaceOnUse">
          <rect width={mainInterval} height={mainInterval} fill="url(#smallGrid)" />
          <path d={`M ${mainInterval} 0 L 0 0 0 ${mainInterval}`} fill="none" stroke={color.gray.mid} strokeWidth={mainLineWidth} />
        </pattern>
      </defs>
      <rect x={offset[0]} y={offset[1]} width="100%" height="100%" fill="url(#grid)" />
    </>
  );
};
