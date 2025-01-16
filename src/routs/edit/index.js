import React, { useEffect, useState } from "react";
import "./edit.scss";
import { BsCurrencyRupee } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getData, setData } from "../../common/utils/storage";
import { Bounce, toast } from "react-toastify";

export default function Edit() {
  // states
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [refreshFlag, setrefreshFlag] = useState(false);
  const [indexOfdata, setindexOfData] = useState(0);
  const [status, setStatus] = useState();
  const paramId = params.get("id");
  const data = getData("invoices") || [];

  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == invoice.id) {
        setindexOfData(i);
      }
    }
  }, [refreshFlag]);
  // functions
  const toastFun = (status) => {
    toast.success(`Marked as ${status}`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };
  const handleOnDelete = () => {
    const idOfData = data[indexOfdata].id;
    const newData = data.filter((el) => {
      return el.id != idOfData;
    });
    setData("invoices",newData);
    toastFun("Deleted"); 
    navigate("/");
  };
  const refresh = () => {
    setrefreshFlag((pre) => !pre);
  };
  const invoice = data.find((el) => {
    return el.id === paramId;
  });
  const handleOnPaid = () => {
    let modifiedData = data;
    const status = modifiedData[indexOfdata].paid;
    modifiedData[indexOfdata].paid = !status;
    setData("invoices", modifiedData);
    toastFun(status ? "Pending" : "Paid");
    navigate("/");
  };
  const grandTotal = (arr) => {
    let result = 0;
    for (let i of arr) {
      let mult = i.price * i.qty;
      result += mult;
    }
    return result;
  };
  return (
    <div className="edit">
      <div className="edit-title">
        Invoice
        <div className="edit-title-buttons">
          <button
            onClick={handleOnDelete}
            className="edit-title-buttons-delete"
          >
            Delete
          </button>
          <button onClick={handleOnPaid} className="paid-btn">
            Mark as {data[indexOfdata].paid ? "Pending" : "Paid"}
          </button>
        </div>
      </div>
      <div className="edit-data">
        <div className="edit-bf">
          <div className="edit-bf-row">
            <div>Street Address</div>
            <div>{invoice.bfData.sAddress}</div>
          </div>
          <div className="edit-bf-row">
            <div>City</div>
            <div>{invoice.bfData.city}</div>
          </div>
          <div className="edit-bf-row">
            <div>Postal Code</div>
            <div>{invoice.bfData.pCode}</div>
          </div>
          <div className="edit-bf-row">
            <div>Country</div>
            <div>{invoice.bfData.country}</div>
          </div>
        </div>
        <div className="edit-bt">
          <div className="edit-bt-grid">
            <div>
              <p>Client's Name</p>
              <p>{invoice.btData.cName}</p>
            </div>
            <div>
              <p>Client's Email</p>
              <p>{invoice.btData.cEmail}</p>
            </div>
            <div>
              <p>Street Address</p>
              <p>{invoice.btData.sAddress}</p>
            </div>
            <div>
              <p>City</p>
              <p>{invoice.btData.city}</p>
            </div>
            <div>
              <p>Postal Code</p>
              <p>{invoice.btData.pCode}</p>
            </div>
            <div>
              <p>Country</p>
              <p>{invoice.btData.country}</p>
            </div>
            <div>
              <p>Date</p>
              <p>{invoice.btData.iDate}</p>
            </div>
            <div>
              <p>Terms</p>
              <p>{invoice.btData.pTerms}</p>
            </div>
          </div>
          <div className="project-description">
            <p>Project Description</p>
            <p>{invoice.btData.pDesc}</p>
          </div>
        </div>
      </div>
      <div className="edit-items">
        <div className="edit-items-row edit-items-title">
          <div className="edit-item">Item name</div>
          <div className="edit-item">Qty</div>
          <div className="edit-item">Price</div>
          <div className="edit-item ">Total</div>
        </div>
        {invoice.items.length > 0 &&
          invoice.items.map((el, i) => {
            return (
              <div key={i} className="edit-items-row ">
                <div className="edit-item">{el.iName}</div>
                <div className="edit-item">{el.qty}</div>
                <div className="edit-item">{el.price}</div>
                <div className="edit-item flex-center">
                  <BsCurrencyRupee />
                  {el.qty * el.price}
                </div>
              </div>
            );
          })}
      </div>
      <div className="edit-items-total">
        <div>Total</div>
        <div>
          {" "}
          <BsCurrencyRupee />
          {grandTotal(invoice.items)}
        </div>
      </div>
    </div>
  );
}
