import React, { useEffect, useRef, useState } from "react";
import "./edit.scss";
import { BsCurrencyRupee } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getData, setData } from "../../common/utils/storage";
import { CiCirclePlus } from "react-icons/ci";

import { Bounce, toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

import { IoClose } from "react-icons/io5";

export default function Edit() {
  // states

  const data = getData("invoices") || [];
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const paramId = params.get("id");
  const inputRefs = useRef([]);
  const [refreshFlag, setrefreshFlag] = useState(false);
  const [indexOfdata, setindexOfData] = useState(0);
  const [ivAdderShow, setivAdderShow] = useState(false);
  const [pageHeight, setPageHeight] = useState(0);
  const [items, setitems] = useState(data[indexOfdata].items);
  const [bfData, setbfData] = useState({
    sAddress: data[indexOfdata].bfData.sAddress,
    city: data[indexOfdata].bfData.city,
    pCode: data[indexOfdata].bfData.pCode,
    country: data[indexOfdata].bfData.country,
  });
  // console.log(data[indexOfdata]);

  const [btData, setbtData] = useState({
    cName: data[indexOfdata].btData.cName,
    cEmail: data[indexOfdata].btData.cEmail,
    sAddress: data[indexOfdata].btData.sAddress,
    city: data[indexOfdata].btData.city,
    pCode: data[indexOfdata].btData.pCode,
    country: data[indexOfdata].btData.country,
    iDate: data[indexOfdata].btData.iDate,
    pTerms: data[indexOfdata].btData.pTerms,
    pDesc: data[indexOfdata].btData.pDesc,
  });
  //
  const updateHeight = () => {
    setPageHeight(document.documentElement.scrollHeight);
  };
  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == invoice.id) {
        setindexOfData(i);
      }
    }
    //
    updateHeight();

    window.addEventListener("resize", updateHeight);
    window.addEventListener("load", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("load", updateHeight);
    };
  }, [refreshFlag]);
  // functions
  const blankItem = {
    iName: "",
    qty: 0,
    price: 0,
  };
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
  const handleOnSave = () => {
    let newData = data;
    newData[indexOfdata] = {
      ...newData[indexOfdata],
      bfData: bfData,
      btData: btData,
      items: items,
    };
    setData("invoices",newData);
    setivAdderShow(false);
    // refresh();
  };
  const handleOnAddNew = () => {
    let data = [...items];
    data.push(blankItem);
    setitems(data);
    setTimeout(() => {
      inputRefs.current[items.length].focus();
    }, 0);
  };
  const handleOnChangeItem = (ev, i) => {
    let data = [...items];
    const name = ev.target.name;
    data[i] = {
      ...data[i],
      [name]: ev.target.value,
    };
    setitems(data);
  };
  const handleOnBfChange = (ev) => {
    let data = bfData;
    data = {
      ...bfData,
      [`${ev.target.name}`]: ev.target.value,
    };
    setbfData(data);
  };
  const handleOnBtChange = (ev) => {
    let data = btData;
    data = {
      ...btData,
      [`${ev.target.name}`]: ev.target.value,
    };
    setbtData(data);
  };
  const handleOnDelete = () => {
    const idOfData = data[indexOfdata].id;
    const newData = data.filter((el) => {
      return el.id != idOfData;
    });
    setData("invoices", newData);
    toastFun("Deleted");
    navigate("/");
  };
  const handleOnDeleteItem = (ev, i) => {
    const data = items.filter((el, index) => {
      return index != i;
    });
    setitems(data);
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
            onClick={() => setivAdderShow(true)}
            className="edit-title-buttons-edit"
          >
            Edit
          </button>
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
      {ivAdderShow && (
        <div style={{ height: `${pageHeight}px` }} className="iv-adder-parent">
          <div className="iv-adder">
            <div className="iv-adder-title">
              <h2>Add Invoice </h2>
              <div
                onClick={() => {
                  setivAdderShow((pre) => !pre);
                }}
                className="iv-adder-close"
              >
                <IoClose />
              </div>
            </div>
            <div className="iv-adder-billFrom">
              <h4>Bill From</h4>
              <div className="iv-adder-input">
                <label>Street Address</label>
                <input
                  autoComplete="off"
                  onChange={handleOnBfChange}
                  value={bfData.sAddress}
                  name="sAddress"
                  type="text"
                ></input>
              </div>
              <div className="iv-adder-grid-3">
                <div className="iv-adder-input">
                  <label>City</label>
                  <input
                    autoComplete="off"
                    onChange={handleOnBfChange}
                    value={bfData.city}
                    name="city"
                    type="text"
                  ></input>
                </div>
                <div className="iv-adder-input">
                  <label>Post Code</label>
                  <input
                    autoComplete="off"
                    onChange={handleOnBfChange}
                    value={bfData.pCode}
                    name="pCode"
                    type="text"
                  ></input>
                </div>
                <div className="iv-adder-input">
                  <label>Country</label>
                  <input
                    autoComplete="off"
                    onChange={handleOnBfChange}
                    value={bfData.country}
                    name="country"
                    type="text"
                  ></input>
                </div>
              </div>
            </div>
            <div className="iv-adder-billTo">
              <h4>Bill To</h4>
              <div className="iv-adder-input">
                <label>Clients Name</label>
                <input
                  autoComplete="off"
                  onChange={handleOnBtChange}
                  value={btData.cName}
                  name="cName"
                  type="text"
                ></input>
              </div>
              <div className="iv-adder-input">
                <label>Clients Email</label>
                <input
                  autoComplete="off"
                  onChange={handleOnBtChange}
                  value={btData.cEmail}
                  name="cEmail"
                  type="email"
                ></input>
              </div>
              <div className="iv-adder-input">
                <label>Street Address</label>
                <input
                  autoComplete="off"
                  onChange={handleOnBtChange}
                  value={btData.sAddress}
                  name="sAddress"
                  type="text"
                ></input>
              </div>
              <div className="iv-adder-grid-3">
                <div className="iv-adder-input">
                  <label>City</label>
                  <input
                    autoComplete="off"
                    onChange={handleOnBtChange}
                    value={btData.city}
                    name="city"
                    type="text"
                  ></input>
                </div>
                <div className="iv-adder-input">
                  <label>Postal Code</label>
                  <input
                    autoComplete="off"
                    onChange={handleOnBtChange}
                    value={btData.pCode}
                    name="pCode"
                    type="text"
                  ></input>
                </div>
                <div className="iv-adder-input">
                  <label>Country</label>
                  <input
                    autoComplete="off"
                    onChange={handleOnBtChange}
                    value={btData.country}
                    name="country"
                    type="text"
                  ></input>
                </div>
              </div>
              <div className="iv-adder-grid-2">
                <div className="iv-adder-input">
                  <label>Invoice Date</label>
                  <input
                    autoComplete="off"
                    name="iDate"
                    value={btData.iDate}
                    onChange={(ev) => {
                      // setSelectedDate(ev.target.value);
                      handleOnBtChange(ev);
                    }}
                    type="date"
                  ></input>
                </div>
                <div className="iv-adder-select">
                  <label>Payment Terms</label>
                  <select
                    value={btData.pTerms}
                    onChange={handleOnBtChange}
                    name="pTerms"
                  >
                    <option disabled>Select Days</option>
                    <option value={30}>Net 30 Days</option>
                    <option value={60}>Net 60 Days</option>
                    <option value={90}>Net 90 Days</option>
                    <option value={120}>Net 120 Days</option>
                    <option value={150}>Net 150 Days</option>
                  </select>
                </div>
              </div>
              <div className="iv-adder-input">
                <label>Project Description</label>
                <input
                  autoComplete="off"
                  onChange={handleOnBtChange}
                  value={btData.pDesc}
                  name="pDesc"
                  type="text"
                ></input>
              </div>
              <div className="input-list">
                <h4>Item List</h4>
                <div className="input-list-title-grid">
                  <div className="input-list-title">Item Name</div>
                  <div className="input-list-title">Qty.</div>
                  <div className="input-list-title">Price</div>
                  <div className="input-list-title flex-center">
                    <BsCurrencyRupee />
                    Total
                  </div>
                  <div className="input-list-title input-delete">Delete</div>
                </div>
                {items.length > 0 &&
                  items.map((el, i) => {
                    return (
                      <div key={i} className="input-list-items-grid">
                        <input
                          autoComplete="off"
                          value={el.iName}
                          ref={(el) => (inputRefs.current[i] = el)}
                          onChange={(ev) => {
                            handleOnChangeItem(ev, i);
                          }}
                          name="iName"
                          type="text"
                          className="input-list-item"
                        ></input>
                        <input
                          autoComplete="off"
                          value={el.qty}
                          onChange={(ev) => {
                            handleOnChangeItem(ev, i);
                          }}
                          name="qty"
                          type="number"
                          className="input-list-item"
                        ></input>
                        <input
                          autoComplete="off"
                          value={el.price}
                          onChange={(ev) => {
                            handleOnChangeItem(ev, i);
                          }}
                          type="number"
                          name="price"
                          className="input-list-item"
                        ></input>
                        <div className="input-list-item input-total">
                          {items[i].qty * items[i].price}
                        </div>
                        <div
                          onClick={(ev) => {
                            handleOnDeleteItem(ev, i);
                          }}
                          className="input-list-item input-delete"
                        >
                          <MdDelete />
                        </div>
                      </div>
                    );
                  })}
                <div className="input-list-btn">
                  <button onClick={handleOnAddNew}>
                    <CiCirclePlus /> Add new Item
                  </button>
                </div>
                <div className="iv-adder-bottom">
                  <button
                    onClick={() => {
                      setivAdderShow((pre) => !pre);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={
                      items.length == 0
                        ? { color: "#b3b4c7", cursor: "default" }
                        : null
                    }
                    disabled={items.length == 0}
                    onClick={handleOnSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
