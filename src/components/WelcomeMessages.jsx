import React from "react";
import Card from "./Card";
import Pen from "./Icons/Pen";
import Buble from "./Icons/Buble";
import Globe from "./Icons/Globe";
import Degree from "./Icons/Degree";
import ChatGPT from "./Icons/ChatGPT";

const messages = [
  { alt: "pen", Icon: Pen, text: "Thanking after an interview" },
  {
    alt: "bulb",
    Icon: Buble,
    text: "Write a short story",
  },
  { alt: "globe", Icon: Globe, text: "Plan a relaxing day" },
  { alt: "degree", Icon: Degree, text: "Quiz me on world capitals" },
];

const WelcomeMessages = () => {
  return (
    <div className="flex mt-[200px] md:mt-0 flex-col gap-8 items-center justify-center absolute left-1/2 top-[40%] transform translate-x-[-50%] translate-y-[-50%]">
      <ChatGPT />
      <div className="flex md:flex-row flex-col gap-4">
        {messages.map((message, index) => (
          <Card key={index} text={message.text} Icon={message.Icon} />
        ))}
      </div>
    </div>
  );
};

export default WelcomeMessages;
