import React, { useState, useRef } from "react";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import NavBar from "../components/NavBar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import WelcomeMessages from "../components/WelcomeMessages";
import { DNA } from "react-loader-spinner";

const ChatPage = () => {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisibleWelcomeMessages, setIsVisibleWelcomeMessages] =
    useState(true);
  const [canStopTyping, setCanStopTyping] = useState(false);
  
  const typingInterval = useRef(null);

  const postGeminiResponse = async () => {
    try {
      const { data } = await axios.post(
        "https://gemini-integration-api.vercel.app/gemini",
        {
          prompt: chatInput,
        }
      );
      return data;
    } catch (error) {
      console.error("*********Error*********", error);
      setError("An error occurred while fetching the response.");
      setIsSending(false);
      return null;
    }
  };

  const handleInputChange = (e) => {
    setChatInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setIsSending(true);
    setIsVisibleWelcomeMessages(false);

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: chatInput.trim() },
    ]);

    setError("");

    const res = await postGeminiResponse();
    setIsSending(false);
    if (res) {
      setCanStopTyping(true);
      setIsLoading(true);
      await simulateTypingEffect(res.result);
    }

    setChatInput("");
  };

  const simulateTypingEffect = async (text) => {
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
        setCanStopTyping(false);
        setIsLoading(false);
      }
    }, 10);
  };

  const stopTyping = () => {
    clearInterval(typingInterval.current);
    setCanStopTyping(false);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mx-4 md:mx-10">
        <div className="fixed w-[90vw]">
          <NavBar />
        </div>
        <div>{isVisibleWelcomeMessages && <WelcomeMessages />}</div>
      </div>
      <div className="flex-grow p-4 mx-2 md:mx-[100px] lg:mx-[200px] xl:mx-[300px] 2xl:mx-[400px]">
        <div className="chat-area p-4 mb-10">
          <div className="mb-4 p-2 rounded">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 my-2 rounded mt-10 overflow-y-hidden ${
                  message.sender === "user" ? "text-right" : "mb-5 bg-base-200"
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
            {isSending && (
              <div className="flex justify-center translate-center">
                <div className="text-base-300">
                  <DNA />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="mb-4">
            <ChatInput
              handleInputChange={handleInputChange}
              chatInput={chatInput}
              canStopTyping={canStopTyping}
              stopTyping={stopTyping}
              disabled={isSending || isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
