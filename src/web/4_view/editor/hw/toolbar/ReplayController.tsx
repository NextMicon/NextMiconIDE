import { NavigateBefore, NavigateNext, PlayArrow } from "@mui/icons-material";
import { FC, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { useColor } from "~/web/2_store";

import { playTick } from "~/web/2_store/4_view/simulator";
import { Center, IconButton, css } from "~/web/4_view/atom";

export const ReplayController: FC<{ size: number }> = ({ size }) => {
  const [tick, setTick] = useRecoilState(playTick);
  const color = useColor().editor.toolbar;

  return (
    <div style={css.colGrid({ column: [size, size, size, null] })}>
      <Center>
        <IconButton color={color.btn} size={size - 10} onClick={() => setTick(tick - 1)}>
          <NavigateBefore />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={size - 10}>
          <PlayArrow />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={size - 10} onClick={() => setTick(tick + 1)}>
          <NavigateNext />
        </IconButton>
      </Center>
      <div style={{ padding: "5px", background: color._.bg }}>
        <Seekbar color={color._.bg} pos={tick} />
      </div>
    </div>
  );
};

const Seekbar: FC<{ color: string; pos: number }> = ({ color, pos }) => {
  const [tick, setTick] = useRecoilState(playTick);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entry) => {
      setContainerWidth(entry[0].contentRect.width);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const seekerRef = useRef<HTMLDivElement>(null);

  const seekRange = 10;

  return (
    <div
      ref={containerRef}
      style={{ overflow: "hidden", cursor: "pointer", background: color }}
      onClick={(e) => {
        const xo = containerRef.current?.getBoundingClientRect().left;
        if (xo) {
          const x = e.clientX - xo;
          setTick(x);
        }
      }}
    >
      <div
        ref={seekerRef}
        style={{
          cursor: "grab",
          position: "relative",
          top: 0,
          left: pos - seekRange / 2,
          width: `${seekRange}px`,
          height: "100%",
          background: color,
        }}
      ></div>
    </div>
  );
};
