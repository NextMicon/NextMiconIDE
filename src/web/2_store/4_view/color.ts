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
  primary: { dark: string; mid: string; light: string };
  gray: { black: string; dark: string; mid: string; light: string; white: string };
  note: { error: string; warn: string; sucsess: string; info: string };
}

export type ColorName = "sakura" | "ai" | "dark";

export const defaultColorName: ColorName = "sakura";

export const colorThemes: Record<ColorName, ColorTheme> = {
  sakura: {
    primary: { dark: "#E36D8D", mid: "#FFB3C8", light: "#FFDBED" },
    gray: { black: "#000000", dark: "#888888", mid: "#DDDDDD", light: "#EEEEEE", white: "#FFFFFF" },
    note: { error: "#FFC3C3", warn: "#ECEC78", sucsess: "#8AC488", info: "#71bbff" },
  },
  ai: {
    primary: { dark: "#004170", mid: "#004170", light: "#7EACCD" },
    gray: { black: "#000000", dark: "#888888", mid: "#DDDDDD", light: "#EEEEEE", white: "#FFFFFF" },
    note: { error: "#FFC3C3", warn: "#ECEC78", sucsess: "", info: "#8AC488" },
  },
  dark: {
    primary: { dark: "#7EACCD", mid: "#7EACCD", light: "#004170" },
    gray: { black: "#FFFFFF", dark: "#888888", mid: "#444444", light: "#222222", white: "#000000" },
    note: { error: "#FFC3C3", warn: "#ECEC78", sucsess: "", info: "#8AC488" },
  },
};
