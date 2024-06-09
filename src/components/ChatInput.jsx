import React from "react";
import send from "../assets/svgs/send.svg";
import stop from "../assets/svgs/stop.svg";

const ChatInput = ({
  chatInput,
  handleInputChange,
  canStopTyping,
  stopTyping,
}) => {
  return (
    <div className="flex items-center justify-between input input-bordered fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 w-full max-w-lg">
      <input
        type="text"
        className="w-full"
        value={chatInput}
        onChange={handleInputChange}
        placeholder="Message FadGPT"
      />
      <div>
        {!canStopTyping ? (
          <button type="submit">
            <img src={send} width={25} alt="alt" className="" />
          </button>
        ) : (
          <button onClick={stopTyping} type="button">
            <img src={stop} width={25} alt="alt" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
