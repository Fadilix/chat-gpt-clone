import React, { useState, useRef } from "react";
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
  const [isVisibleWelcomeMessages, setIsVisibleWelcomeMessages] = useState(true);
  const typingInterval = useRef(null);
  const [canStopTyping, setCanStopTyping] = useState(false);

  const postGeminiResponse = async () => {
    try {
      const { data } = await axios.post("/gemini", {
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

    // Add the user's message to the state
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: chatInput.trim() },
    ]);

    setIsLoading(true);
    setError("");

    // Fetch the bot's response
    const res = await postGeminiResponse();
    if (res) {
      setCanStopTyping(true); // Allow stopping typing when response starts
      simulateTypingEffect(res.result);
    }

    setIsLoading(false);
    setChatInput("");
  };

  const simulateTypingEffect = (text) => {
    let currentText = "";
    let i = 0;
    typingInterval.current = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          if (newMessages[newMessages.length - 1]?.sender === "bot") {
            newMessages[newMessages.length - 1].text = currentText;
          } else {
            newMessages.push({ sender: "bot", text: currentText });
          }
          return newMessages;
        });
        i++;
      } else {
        clearInterval(typingInterval.current);
        setCanStopTyping(false); // Disable stopping when typing is done
      }
    }, 10);
  };

  const stopTyping = () => {
    clearInterval(typingInterval.current);
    setCanStopTyping(false); // Disable stopping immediately
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
            <div
              key={index}
              className={`p-2 my-2 rounded ${
                message.sender === "user" ? "text-right" : "mb-10 bg-base-200"
              }`}
            >
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
            canStopTyping={canStopTyping}
            stopTyping={stopTyping}
          />
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
