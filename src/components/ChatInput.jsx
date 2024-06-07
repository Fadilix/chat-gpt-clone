import React from "react";
import send from "../assets/svgs/send.svg";

const ChatInput = ({ chatInput, handleInputChange }) => {
  return (
    <div className="flex items-center justify-between input input-bordered fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 w-full max-w-lg">
      <input
        type="text"
        className="w-full"
        value={chatInput}
        onChange={handleInputChange}
        placeholder="Message FadGPT"
      />
      <button type="submit">
        <img src={send} width={25} alt="alt" className="" />
      </button>
    </div>
  );
};

export default ChatInput;
