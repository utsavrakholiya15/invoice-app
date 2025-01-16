import React from "react";
import "./header.scss";
import { FaInfo } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
export default function Header() {
  return (
    <header>
      <div className="header-icon">
        <FaInfo />
      </div>
      <div className="header-user">
        <FaRegUserCircle />
      </div>
    </header>
  );
}
