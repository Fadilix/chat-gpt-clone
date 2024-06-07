import React, { useState, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import NavBar from "../components/NavBar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import WelcomeMessages from "../components/WelcomeMessages";

const ChatPage = () => {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [typingIndex, setTypingIndex] = useState(null);
  const [isVisibleWelcomeMessages, setIsVisibleWelcomeMessages] =
    useState(true);

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
    setIsVisibleWelcomeMessages(false);
    const p = document.createElement("p");
    p.innerHTML = chatInput.trim();
    const chatArea = document.querySelector(".chat-area");
    chatArea.appendChild(p);

    setIsLoading(true);
    setError("");

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: "" },
    ]);

    const res = await postGeminiResponse();
    if (res) {
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
          if (newMessages[index]) {
            newMessages[index].text = currentText;
          } else {
            newMessages.push({ sender: "bot", text: currentText });
          }
          return newMessages;
        });
        i++;
      } else {
        clearInterval(interval);
      }
    }, 10);
  };

  return (
    <div>
      <div className="mx-10">
        <NavBar />
        <div>{isVisibleWelcomeMessages && <WelcomeMessages />}</div>
      </div>
      <div className="chat-area p-4 mx-[400px] mb-10">
        <div className="mb-4 overflow-y-auto p-2 rounded">
          {messages.map((message, index) => (
            <div key={index} className={`p-2 my-2 rounded`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </div>
          ))}
          {error && (
            <p className="mt-4 text-red-500 transition-opacity duration-300 ease-in-out opacity-100">
              {error}
            </p>
          )}
          {isLoading && (
            <div className="flex justify-center translate-center">
              <BeatLoader style={{ color: "white" }} />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="mb-4">
          <ChatInput
            handleInputChange={handleInputChange}
            chatInput={chatInput}
          />
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
