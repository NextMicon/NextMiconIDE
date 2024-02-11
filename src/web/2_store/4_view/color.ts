import { NoAdultContentOutlined } from "@mui/icons-material";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";

const colorNameState = atom<string>({
  key: "colorName",
  default: window.ipc.config.getColor(),
});

const colorState = selector<ColorTheme>({
  key: "color",
  get: ({ get }) => {
    const name = get(colorNameState);
    const color = colorThemes[name as ColorName];
    return color ? color : colorThemes[defaultColorName];
  },
});

export const useSetColorName = () => {
  const colorName = useRecoilValue(colorNameState);
  const setColorName = useSetRecoilState(colorNameState);
  return {
    colorName: colorName,
    setColorName: (colorName: string) => {
      setColorName(colorName);
      window.ipc.config.setColor(colorName);
    },
  };
};

export const useColor = () => useRecoilValue(colorState);

// ------------------------------------------------------------------------------------------------

export interface ColorTheme {
  home: { background: string; color: string };
  message_list: { background: string };
  message: { error: string; warn: string; sucsess: string; info: string };
  toolbar: { bg: string; text: string; icon: string };
  hw_list: {
    bg: string;
    item: { selected: string; hover: string; normal: string };
  };
  canvas: { bg: string; grid: string };
  select: { fill: string; stroke: string };
  obj: {
    border: { normal: string; highlight: string };
    fill: { normal: string; highlight: string };
    text: { normal: string; highlight: string };
    port_bg: { normal: string; highlight: string };
    port_icon: { normal: string; highlight: string };
  };
  wire: { normal: string; highlight: string };
  port: { normal: string; highlight: string };
}

export type ColorName = "dark_sakura";
// export type ColorName = "dark_sakura" | "dark_ai" | "light_sakura" | "light_ai";
export const defaultColorName: ColorName = "dark_sakura";

const C = {
  black: "#000000",
  sakura: { dark: "#E36D8D", mid: "#FFB3C8", light: "#FFDBED" },
  navy: { dark: "#282C34" },
  gray: { dark: "#000000", mid: "#BBBBBB", light: "#888888" },
  red: "#FFC3C3",
  yellow: "#ECEC78",
  green: "#8AC488",
  blue: "#71bbff",
} as const;

const getTextColor = (bg: string) => {
  return "#000000";
};

export const colorThemes: Record<ColorName, ColorTheme> = {
  dark_sakura: {
    home: { background: C.sakura.dark, color: "#000000" },
    message_list: { background: C.gray.dark },
    message: { error: C.red, warn: C.yellow, info: C.blue, sucsess: C.green },
    hw_list: {
      bg: C.navy.dark,
      item: { selected: C.sakura.dark, hover: C.sakura.light, normal: C.navy.dark },
    },
    toolbar: { bg: C.sakura.dark, text: C.gray.light, icon: C.sakura.dark },
    canvas: { bg: C.navy.dark, grid: C.gray.mid },
    select: { fill: C.gray.light, stroke: C.sakura.mid },
    obj: {
      border: { normal: C.sakura.mid, highlight: C.sakura.light },
      fill: { normal: C.sakura.dark, highlight: C.sakura.mid },
      text: { normal: getTextColor(C.sakura.dark), highlight: getTextColor(C.sakura.mid) },
      port_bg: { normal: C.gray.dark, highlight: C.gray.mid },
      port_icon: { normal: C.gray.dark, highlight: C.gray.mid },
    },
    wire: { normal: C.gray.mid, highlight: C.sakura.light },
    port: { normal: C.gray.light, highlight: C.sakura.light },
  },
};
