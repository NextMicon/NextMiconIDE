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
  home: {
    _: { bg: string; text: string };
    btn: { _: { bg: string; icon: string; text: string }; hov: { bg: string; icon: string; text: string } };
  };
  dialog: {
    _: { bg: string; text: string };
    btn: { _: { bg: string; icon: string; text: string }; hov: { bg: string; icon: string; text: string } };
    msg: { error: string; warn: string; sucsess: string; info: string };
  };
  editor: {
    toolbar: {
      _: { bg: string; text: string };
      btn: { _: { bg: string; icon: string; text: string }; hov: { bg: string; icon: string; text: string } };
    };
    hw: {
      graph: {
        canvas: { bg: string; grid: string };
        select: { fill: string; stroke: string };
        wire: { _: string; hov: string };
        port: { _: string; hov: string };
        obj: {
          _: { border: string; fill: string; text: string; port_bg: string; port_icon: string };
          hov: { border: string; fill: string; text: string; port_bg: string; port_icon: string };
        };
      };
      sidebar: {
        _: { bg: string; text: string };
        btn: { _: { bg: string; icon: string; text: string }; hov: { bg: string; icon: string; text: string } };
      };
      list: {
        bg: string;
        item: {
          _: { bg: string; text: string; icon: string };
          sel: { bg: string; text: string; icon: string };
          hov: { bg: string; text: string; icon: string };
        };
      };
    };
    sw: {
      list: { bg: string; comment: string; embtype: string; objtype: string; funcname: string; varname: string };
    };
  };
}

export type ColorName = "dbg";
// export type ColorName = "dark_sakura" | "dark_ai" | "light_sakura" | "light_ai";
export const defaultColorName: ColorName = "dbg";

// --------------------------------------------------------------------------------
// Collor pallete

const C = {
  // Placeholder
  GREEN: "#00FF00",
  RED: "#FF0000",
  BLUE: "#0000FF",

  black: "#000000",
  gray: { dark: "#222222", mid: "#888888", light: "#DDDDDD" },
  white: "#FFFFFF",

  sakura: { dark: "#E36D8D", mid: "#FFB3C8", light: "#FFDBED" },
  navy: { dark: "#282C34" },
  red: "#FFC3C3",
  yellow: "#ECEC78",
  green: "#8AC488",
  blue: "#71bbff",
} as const;

const getTextColor = (bg: string) => {
  return "#000000";
};

// --------------------------------------------------------------------------------

export const colorThemes: Record<ColorName, ColorTheme> = {
  dbg: {
    home: {
      _: { bg: C.GREEN, text: C.RED },
      btn: { _: { bg: C.RED, icon: C.BLUE, text: C.GREEN }, hov: { bg: C.BLUE, icon: C.RED, text: C.RED } },
    },
    dialog: {
      _: { bg: C.GREEN, text: C.RED },
      btn: { _: { bg: C.RED, icon: C.BLUE, text: C.GREEN }, hov: { bg: C.BLUE, icon: C.RED, text: C.RED } },
      msg: { error: C.red, warn: C.yellow, info: C.blue, sucsess: C.green },
    },
    editor: {
      toolbar: {
        _: { bg: C.GREEN, text: C.RED },
        btn: { _: { bg: C.RED, icon: C.BLUE, text: C.GREEN }, hov: { bg: C.BLUE, icon: C.RED, text: C.RED } },
      },

      hw: {
        graph: {
          canvas: { bg: C.navy.dark, grid: C.gray.mid },
          select: { fill: C.gray.light, stroke: C.sakura.mid },
          wire: { _: C.gray.mid, hov: C.sakura.light },
          port: { _: C.gray.light, hov: C.sakura.light },
          obj: {
            _: {
              border: C.sakura.mid,
              fill: C.sakura.dark,
              text: getTextColor(C.sakura.dark),
              port_bg: C.gray.dark,
              port_icon: C.gray.mid,
            },
            hov: {
              border: C.sakura.light,
              fill: C.sakura.mid,
              text: getTextColor(C.sakura.mid),
              port_bg: C.gray.mid,
              port_icon: C.gray.light,
            },
          },
        },
        sidebar: {
          _: { bg: C.GREEN, text: C.RED },
          btn: { _: { bg: C.RED, icon: C.BLUE, text: C.GREEN }, hov: { bg: C.BLUE, icon: C.RED, text: C.RED } },
        },
        list: {
          bg: C.GREEN,
          item: {
            _: { bg: C.RED, icon: C.BLUE, text: C.GREEN },
            sel: { bg: C.RED, icon: C.BLUE, text: C.GREEN },
            hov: { bg: C.RED, icon: C.BLUE, text: C.GREEN },
          },
        },
      },
      sw: {
        list: {
          bg: C.GREEN,
          comment: "#6a9955",
          embtype: "#569cd6",
          objtype: "#4ec9b0",
          funcname: "#dcdcaa",
          varname: "#9cdcfe",
        },
      },
    },
  },
};
