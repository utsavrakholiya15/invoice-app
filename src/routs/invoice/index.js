import React, { useEffect, useRef, useState } from "react";
import "./invoice.scss";
import { CiCirclePlus } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa6";
import { BsCurrencyRupee } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { FaAngleRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { getData, setData } from "../../common/utils/storage";
import { useNavigate } from "react-router-dom";
import { Paid, Pending } from "../../common/components";
export default function Invoice() {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  // states //

  const navigate = useNavigate();
  const [filterFlag, setFilterFlag] = useState(false);
  // const [filter, setFilter] = useState("");
  const [refreshFlag, setrefreshFlag] = useState(false);
  const [storedData, setStoredData] = useState(getData("invoices") || []);
  const inputRefs = useRef([]);
  const [ivAdderShow, setivAdderShow] = useState(false);
  const [pageHeight, setPageHeight] = useState(0);
  const [items, setitems] = useState([]);
  const [bfData, setbfData] = useState({
    sAddress: "",
    city: "",
    pCode: "",
    country: "",
  });
  const [btData, setbtData] = useState({
    cName: "",
    cEmail: "",
    sAddress: "",
    city: "",
    pCode: "",
    country: "",
    iDate: selectedDate,
    pTerms: "",
    pDesc: "",
  });
  // useEfects
  const updateHeight = () => {
    setPageHeight(document.documentElement.scrollHeight);
  };

  useEffect(() => {
    setStoredData(getData("invoices") || []);
    //
    updateHeight();

    window.addEventListener("resize", updateHeight);
    window.addEventListener("load", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("load", updateHeight);
    };
  }, [refreshFlag]);
  // functions and vars
  const refresh = () => {
    setrefreshFlag((pre) => !pre);
  };
  // vars
  const allData = {
    bfData: bfData,
    btData: btData,
    items: items,
    paid: false,
    id: uuidv4(),
  };
  const blankItem = {
    iName: "",
    qty: 0,
    price: 0,
  };
  //
  const dueDate = (date, days) => {
    const baseDate = new Date(date);

    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + parseInt(days, 10));

    return newDate.toISOString().slice(0, 10);
  };
  // console.log("output****",calculateFutureDate("2025-02-28",30));
  // const handleOnFilter = () => {};
  const clearForm = () => {
    setitems([]);
    setbfData({
      sAddress: "",
      city: "",
      pCode: "",
      country: "",
    });
    setbtData({
      cName: "",
      cEmail: "",
      sAddress: "",
      city: "",
      pCode: "",
      country: "",
      iDate: getTodayDate(),
      pTerms: "",
      pDesc: "",
    });
    setSelectedDate(getTodayDate);
  };
  const handleOnSave = () => {
    const data = getData("invoices") || [];
    data.push(allData);
    setData("invoices", data);
    clearForm();
    setivAdderShow(false);
    refresh();
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

  const handleOnDelete = (ev, i) => {
    const data = items.filter((el, index) => {
      return index != i;
    });
    setitems(data);
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
  const handleOnAddNew = () => {
    let data = [...items];
    data.push(blankItem);
    setitems(data);
    setTimeout(() => {
      inputRefs.current[items.length].focus();
    }, 0);
  };
  const grandTotal = (arr) => {
    let result = 0;
    for (let i of arr) {
      let mult = i.price * i.qty;
      result += mult;
    }
    return result;
  };
  // console.log("**stored", storedData);
  return (
    <div className="iv-parent">
      <div className="iv">
        <div className="iv-top">
          <div className="iv-title">
            <h2>Invoices</h2>
            <p>There are {storedData.length} total invoice</p>
          </div>
          <div className="iv-controls">
            <div
              onClick={() => {
                setFilterFlag((pre) => !pre);
              }}
              className="iv-filter"
            >
              Filter by status <FaAngleDown />
            </div>
            <button
              onClick={() => {
                setivAdderShow((pre) => !pre);
              }}
            >
              <CiCirclePlus />
              New Invoice
            </button>
          </div>
        </div>
        <div className="iv-bottom">
          {storedData.length > 0 &&
            storedData.map((el, i) => {
              return (
                <div
                  onClick={() => {
                    navigate(`/edit?id=${el.id}`);
                  }}
                  key={i}
                  className="iv-item"
                >
                  <div className="iv-item-number">{i + 1}</div>
                  <div className="iv-item-date">
                    Due {dueDate(el.btData.iDate, Number(el.btData.pTerms))}
                  </div>
                  <div className="iv-item-name">{el.btData.cName}</div>
                  <div className="iv-item-amount">
                    <BsCurrencyRupee />
                    {grandTotal(el.items)}
                  </div>
                  {el.paid ? <Paid /> : <Pending />}
                  <div className="iv-item-arrowRight">
                    <FaAngleRight />
                  </div>
                </div>
              );
            })}
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
                  clearForm();
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
                  name="cName"
                  type="text"
                ></input>
              </div>
              <div className="iv-adder-input">
                <label>Clients Email</label>
                <input
                  autoComplete="off"
                  onChange={handleOnBtChange}
                  name="cEmail"
                  type="email"
                ></input>
              </div>
              <div className="iv-adder-input">
                <label>Street Address</label>
                <input
                  autoComplete="off"
                  onChange={handleOnBtChange}
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
                    name="city"
                    type="text"
                  ></input>
                </div>
                <div className="iv-adder-input">
                  <label>Postal Code</label>
                  <input
                    autoComplete="off"
                    onChange={handleOnBtChange}
                    name="pCode"
                    type="text"
                  ></input>
                </div>
                <div className="iv-adder-input">
                  <label>Country</label>
                  <input
                    autoComplete="off"
                    onChange={handleOnBtChange}
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
                    value={selectedDate}
                    onChange={(ev) => {
                      setSelectedDate(ev.target.value);
                      handleOnBtChange(ev);
                    }}
                    type="date"
                  ></input>
                </div>
                <div className="iv-adder-select">
                  <label>Payment Terms</label>
                  <select onChange={handleOnBtChange} name="pTerms">
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
                {/* <div className="input-list-items-grid">
                  <input autoComplete="off" type="text" className="input-list-item"></input>
                  <input autoComplete="off" type="number" className="input-list-item"></input>
                  <input autoComplete="off" type="number" className="input-list-item"></input>
                  <div className="input-list-item input-total">Total</div>
                  <div className="input-list-item input-delete">D</div>
                </div> */}
                {items.length > 0 &&
                  items.map((el, i) => {
                    return (
                      <div key={i} className="input-list-items-grid">
                        <input
                          autoComplete="off"
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
                          onChange={(ev) => {
                            handleOnChangeItem(ev, i);
                          }}
                          name="qty"
                          type="number"
                          className="input-list-item"
                        ></input>
                        <input
                          autoComplete="off"
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
                            handleOnDelete(ev, i);
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
                      clearForm();
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
