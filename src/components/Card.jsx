import React from "react";

const Card = ({ src, alt, text }) => {
  return (
    <div className="border border-gray-500 rounded-xl w-50 h-36 p-6">
      <img src={src} alt={alt} width={20} />
      <p>{text}</p>
    </div>
  );
};

export default Card;
