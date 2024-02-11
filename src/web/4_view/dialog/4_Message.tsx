import { Check } from "@mui/icons-material";
import { FC, useState } from "react";
import { Message, useColor, useMessage } from "~/web/2_store";
import { IconButton, layout } from "../atom";

export const MessageList: FC = () => {
  const color = useColor();
  const { messages } = useMessage();

  // const instsErrors = useRecoilValueLoadable(instancesResolveErrorState);

  const msg = [...messages];

  if (msg.length === 0) return <></>;

  return (
    <div
      style={{
        ...color.message_list,

        pointerEvents: "all",
        borderTopLeftRadius: 20,

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
  const [width, setWidth] = useState(false);
  const { deleteMessage } = useMessage();
  return (
    <div
      style={{
        pointerEvents: "auto",
        background: color.message[message.type],
        height: "auto",
        borderRadius: 20,
        marginBottom: 10,
        width: width ? "100%" : "400px",
        cursor: "pointer",
      }}
      onClick={() => setWidth(!width)}
      onDoubleClick={() => deleteMessage(message.id)}
    >
      <div style={{ ...layout.grid({ column: ["1fr", "50px"] }), height: "50px" }}>
        <div style={layout.center}>
          <span style={{ fontSize: 20, fontWeight: "bold", height: "auto" }}> {message.title}</span>
        </div>
        <div style={layout.center}>
          <IconButton onClick={() => deleteMessage(message.id)} size={40} base={color.message_list.background}>
            <Check style={{ background: color.message[message.type] }} />
          </IconButton>
        </div>
      </div>
      <div style={{ whiteSpace: "break-spaces", height: "auto", padding: "0 20px 20px 20px", overflowX: "scroll" }}>{message.text}</div>
    </div>
  );
};
