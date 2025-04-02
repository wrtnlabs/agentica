import { useAgentica } from "../../hook/agentica";

import "./ChatMovie.scss";

export function AgenticaChatMovie() {
  const { messages, conversate, isError } = useAgentica();
  return (
    <div className="agentica-chat-movie-wrapper">
      <div style={{
        flex: 1,
        overflowY: "auto",
      }}
      >
      </div>

    </div>
  );
}
