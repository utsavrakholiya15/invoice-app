import react from "react";
import "./common-components.scss";
import { FaCircle } from "react-icons/fa";

export const Paid = () => {
  return (
    <div className="paid">
      <FaCircle />
      Paid
    </div>
  );
};

export const Pending = () => {
  return (
    <div className="pending">
      <FaCircle />
      Pending
    </div>
  );
};
