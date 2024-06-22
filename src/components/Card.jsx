import React from "react";

const Card = ({ text, Icon }) => {
  return (
    <div className="border border-gray-500 rounded-xl w-50 h-36 p-6">
      <Icon />
      <p>{text}</p>
    </div>
  );
};

export default Card;
