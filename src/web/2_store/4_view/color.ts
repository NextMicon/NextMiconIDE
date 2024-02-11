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
        _: { bg: string };
        item: {
          _: { bg: string; text: string; icon: string };
          btn: { _: { bg: string; icon: string; text: string }; hov: { bg: string; icon: string; text: string } };
          sel: { bg: string; text: string; icon: string };
          hov: { bg: string; text: string; icon: string };
        };
      };
    };
    sw: {
      text: {};
      list: {
        _: { bg: string };
        inst: {
          _: { bg: string; text: string; icon: string };
          hov: { bg: string; text: string; icon: string };
        };
        func: {
          _: { bg: string; text: string; comment: string; embtype: string; objtype: string; funcname: string; varname: string };
          hov: { bg: string; text: string; comment: string; embtype: string; objtype: string; funcname: string; varname: string };
        };
      };
    };
  };
}

export type ColorName = "dark_sakura";
// export type ColorName = "dark_monochrome" | "dark_sakura" | "dark_ai" | "light_monochrome" | "light_sakura" | "light_ai";
export const defaultColorName: ColorName = "dark_sakura";

// --------------------------------------------------------------------------------
// Collor pallete

const C = {
  // Placeholder
  GREEN: "#00FF00",
  RED: "#FF0000",
  BLUE: "#0000FF",

  black: "#000",
  gray: { dark: "#333", middark: "#666", midlight: "#999", light: "#CCC" },
  white: "#FFF",

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
  dark_sakura: {
    home: {
      _: { bg: C.sakura.dark, text: C.white },
      btn: { _: { bg: C.white, icon: C.sakura.dark, text: C.black }, hov: { bg: C.sakura.light, icon: C.sakura.dark, text: C.black } },
    },
    dialog: {
      _: { bg: C.sakura.dark, text: C.white },
      btn: { _: { bg: C.RED, icon: C.BLUE, text: C.GREEN }, hov: { bg: C.BLUE, icon: C.RED, text: C.RED } },
      msg: { error: C.red, warn: C.yellow, info: C.blue, sucsess: C.green },
    },
    editor: {
      toolbar: {
        _: { bg: C.sakura.dark, text: C.white },
        btn: { _: { bg: C.white, icon: C.sakura.dark, text: C.black }, hov: { bg: C.sakura.light, icon: C.sakura.dark, text: C.black } },
      },

      hw: {
        graph: {
          canvas: { bg: C.navy.dark, grid: C.gray.midlight },
          select: { fill: C.gray.light, stroke: C.sakura.mid },
          wire: { _: C.white, hov: C.sakura.light },
          port: { _: C.white, hov: C.sakura.light },
          obj: {
            _: {
              border: C.sakura.mid,
              fill: C.sakura.dark,
              text: getTextColor(C.sakura.dark),
              port_bg: C.gray.light,
              port_icon: C.sakura.dark,
            },
            hov: {
              border: C.sakura.light,
              fill: C.sakura.mid,
              text: getTextColor(C.sakura.mid),
              port_bg: C.gray.light,
              port_icon: C.sakura.dark,
            },
          },
        },
        sidebar: {
          _: { bg: C.sakura.mid, text: C.white },
          btn: { _: { bg: C.white, icon: C.sakura.dark, text: C.black }, hov: { bg: C.sakura.light, icon: C.sakura.dark, text: C.black } },
        },
        list: {
          _: { bg: C.GREEN },
          item: {
            _: { bg: C.RED, icon: C.BLUE, text: C.GREEN },
            btn: {
              _: { bg: C.white, icon: C.sakura.dark, text: C.black },
              hov: { bg: C.sakura.light, icon: C.sakura.dark, text: C.black },
            },
            sel: { bg: C.RED, icon: C.BLUE, text: C.GREEN },
            hov: { bg: C.RED, icon: C.BLUE, text: C.GREEN },
          },
        },
      },
      sw: {
        text: {},
        list: {
          _: { bg: C.navy.dark },
          inst: {
            _: { bg: C.navy.dark, text: C.white, icon: C.white },
            hov: { bg: C.sakura.mid, text: C.white, icon: C.white },
          },
          func: {
            _: {
              bg: C.navy.dark,
              text: C.white,
              comment: "#6a9955",
              embtype: "#569cd6",
              objtype: "#4ec9b0",
              funcname: "#dcdcaa",
              varname: "#9cdcfe",
            },
            hov: {
              bg: C.sakura.mid,
              text: C.white,
              comment: "#6a9955",
              embtype: "#569cd6",
              objtype: "#4ec9b0",
              funcname: "#dcdcaa",
              varname: "#9cdcfe",
            },
          },
        },
      },
    },
  },
};
