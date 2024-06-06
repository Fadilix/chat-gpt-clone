import React, { useState, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import ChatInput from "../components/ChatInput";

const ChatPage = () => {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [typingIndex, setTypingIndex] = useState(null);

  const postGeminiResponse = async () => {
    try {
      const { data } = await axios.post("http://localhost:8081/gemini", {
        prompt: chatInput,
      });
      return data;
    } catch (error) {
      console.error("*********Error*********", error);
      setError("An error occurred while fetching the response.");
      setIsLoading(false);
      return null;
    }
  };

  const handleInputChange = (e) => {
    setChatInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsLoading(true);
    setError("");

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: chatInput },
    ]);

    const res = await postGeminiResponse();
    if (res) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "" },
      ]);
      setTypingIndex(messages.length);
      simulateTypingEffect(res.result, messages.length);
    }

    setIsLoading(false);
    setChatInput("");
  };

  const simulateTypingEffect = (text, index) => {
    let currentText = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index].text = currentText;
          return newMessages;
        });
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <div className="p-4 mx-[400px]">
      <div className="mb-4 overflow-y-auto h-80 p-2 rounded">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 my-2 rounded`}>
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center translate-center">
            <BeatLoader />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <ChatInput
          handleInputChange={handleInputChange}
          chatInput={chatInput}
        />
  
      </form>
      {error && (
        <p className="mt-4 text-red-500 transition-opacity duration-300 ease-in-out opacity-100">
          {error}
        </p>
      )}
    </div>
  );
};

export default ChatPage;
