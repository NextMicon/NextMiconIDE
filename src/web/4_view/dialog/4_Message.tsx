import { Check, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { FC, useState } from "react";
import { Message, useColor, useMessage } from "~/web/2_store";
import { Center, IconButton, layout } from "../atom";

export const MessageList: FC = () => {
  const color = useColor();
  const { messages } = useMessage();

  if (messages.length === 0) return <></>;

  return (
    <div
      style={{
        pointerEvents: "all",
        borderTopLeftRadius: 20,

        background: "gray",

        position: "absolute",
        right: 0,
        bottom: 0,

        width: "auto",
        height: "auto",
        maxHeight: "100%",
        overflow: "scroll",

        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "flex-end",
        padding: "10px",
      }}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};

const MessageItem: FC<{ message: Message }> = ({ message }) => {
  const color = useColor();
  const [open, setOpen] = useState(false);
  const { deleteMessage } = useMessage();

  return (
    <div style={{ height: "auto", borderRadius: 20, marginBottom: 10, background: color.dialog.msg[message.type], width: "400px" }}>
      <div style={{ ...layout.colGrid({ column: [50, null, 50] }), height: 50 }}>
        <Center>
          <IconButton color={color.dialog.btn} onClick={() => setOpen(!open)} size={40}>
            {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </IconButton>
        </Center>
        <Center>
          <span style={{ fontSize: 20, fontWeight: "bold", height: "auto" }}> {message.title}</span>
        </Center>
        <Center>
          <IconButton color={color.dialog.btn} onClick={() => deleteMessage(message.id)} size={40}>
            <Check />
          </IconButton>
        </Center>
      </div>
      {open && (
        <div style={{ whiteSpace: "break-spaces", height: "auto", padding: "0 20px 20px 20px", overflowX: "scroll" }}>{message.text}</div>
      )}
    </div>
  );
};
