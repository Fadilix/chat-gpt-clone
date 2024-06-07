import React from "react";

const ChatInput = ({ chatInput, handleInputChange }) => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 w-full max-w-lg">
      <input
        type="text"
        className="input input-bordered input-danger w-full"
        value={chatInput}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default ChatInput;