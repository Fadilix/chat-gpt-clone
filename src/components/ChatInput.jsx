import React from "react";
import Send from "./Icons/Send";
import Stop from "./Icons/Stop";

const ChatInput = ({
  disabled,
  chatInput,
  handleInputChange,
  canStopTyping,
  stopTyping,
}) => {
  return (
    <div className="flex items-center justify-between input input-bordered fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 w-[80vw] md:w-full max-w-lg">
      <input
        autoFocus={true}
        type="text"
        className="w-full text-base-content"
        value={chatInput}
        onChange={handleInputChange}
        placeholder="Message FadGPT"
        disabled={disabled}
      />
      <div>
        {!canStopTyping ? (
          <button
            type="submit"
            disabled={disabled}
            className={`${disabled && "cursor-not-allowed disabled"}`}
          >
            <Send />
          </button>
        ) : (
          <button onClick={stopTyping} type="button">
            <Stop />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
