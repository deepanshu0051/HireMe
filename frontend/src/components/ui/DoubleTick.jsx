import React from "react";
import { CheckCheck } from "lucide-react";

const DoubleTick = ({ seen, size = 16 }) => {
  return (
    <CheckCheck 
      size={size} 
      className={seen ? "text-[#2563EB]" : "text-[#94A3B8]"} 
    />
  );
};

export default DoubleTick;
