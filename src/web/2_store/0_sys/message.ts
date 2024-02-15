import { atom, useRecoilState } from "recoil";

type MessageType = "error" | "warn" | "sucsess" | "info";

export interface Message {
  id: string;
  time: number;
  type: MessageType;
  title: string;
  text?: string;
}

export const messagesState = atom<Message[]>({
  key: "messages",
  default: [],
});

export const useMessage = () => {
  const [messages, setMessages] = useRecoilState(messagesState);
  const createMessage = (type: MessageType, title: string, text?: string) => {
    const id = crypto.randomUUID();
    const time = Date.now();
    setMessages([...messages, { id, time, type, title, text }]);
    return id;
  };
  const deleteMessage = (id: string) => {
    setMessages(messages.filter((item) => item.id !== id));
  };
  const clearMessage = () => {
    setMessages([]);
  };
  return { messages, createMessage, deleteMessage, clearMessage };
};
