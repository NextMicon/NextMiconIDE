export const BOARD_DIR = "Board";
export const PACK_DIR = "Package";
export const PROJ_DIR = "Project";
export const CONFIG_FILE = "config.nm.yaml";
export const REGISTORY_FILE = "registory.nm.yaml";
export const PACK_FILE = "package.nm.yaml";
export const PROJ_FILE = "project.nm.yaml";
export const BOARD_FILE = "board.nm.yaml";
export const SW_DIR = "software";
export const SW_FILE = "main.cpp";
export const MK_FILE = "Makefile";

export const WIRE_WIDTH = 3;

export const GRID = 20;

export const URL_NEXT_MICON = "https://github.com/NextMicon";
export const URL_PACK_REPO = "https://raw.githubusercontent.com/NextMicon/Registory/main/Package";
export const URL_BOARD_REPO = "https://raw.githubusercontent.com/NextMicon/Registory/main/Board";

export const SW_INIT = `// main.cpp
#include "firmware.hpp"

void init(){
  // Code Here!
}

void loop(){
  // Code Here!
}
`;

export const COLORS = {
  hw_back: "#282c34",
  hw_grid: "",
  sw_back: "#282c34",
} as const;
