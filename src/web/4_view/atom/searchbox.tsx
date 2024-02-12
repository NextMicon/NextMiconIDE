import { Check, Search } from "@mui/icons-material";
import { FC } from "react";

export const SearchBox: FC<{
  text: string;
  setText: (text: string) => void;
  onSubmit: () => void;
  inputColor: string;
  iconColor: string;
}> = ({ text, setText, onSubmit, inputColor, iconColor }) => {
  return (
    <div style={{ height: "48px", padding: "2px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "2px" }}>
        <form
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "30px 1fr",
            backgroundColor: inputColor,
            padding: "5px",
            borderRadius: "20px",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <button type="submit" style={{ height: 30, width: 30, borderRadius: "50%", border: "none" }}>
            <Search style={{ color: iconColor, height: "100%", width: "100%" }} />
          </button>
          <input
            style={{ display: "block", border: "none", backgroundColor: "rgba(0,0,0,0)", width: "100%" }}
            placeholder="Search Package"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export const InputBox: FC<{
  text: string;
  setText: (text: string) => void;
  onSubmit: () => void;
  inputColor: string;
  iconColor: string;
}> = ({ text, setText, onSubmit, inputColor, iconColor }) => {
  return (
    <div style={{ height: "48px", padding: "2px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "2px" }}>
        <form
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 30px",
            padding: "5px",
            borderRadius: "20px",
            background: inputColor,
          }}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <input
            style={{ display: "block", border: "none", backgroundColor: "rgba(0,0,0,0)", width: "100%" }}
            placeholder="Search Package"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" style={{ height: 30, width: 30, borderRadius: "50%", border: "none", cursor: "pointer" }}>
            <Check style={{ color: iconColor, height: "100%", width: "100%" }} />
          </button>
        </form>
      </div>
    </div>
  );
};
