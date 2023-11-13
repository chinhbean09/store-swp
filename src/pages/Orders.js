import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { } from "../features/auth/authSlice";
import { config } from "../utils/axiosconfig";

const URL = "https://magpie-aware-lark.ngrok-free.app/api/v1/store/order/all";
function renderComponent(params) {
  return (
    <div>
      {(() => {
        switch (params) {
          case 1:
            return (
              <Tag color="orange" key={1}>
                Đang chờ xác nhận
              </Tag>

            );



          case 2:
            return (<Tag color="orange" key={1}>
              Đang chờ xác nhận
            </Tag>);





          case 3:
            return (<Tag color="blue" key={3}>
              Đang vận chuyển
            </Tag>);



          case 4:
            return (<Tag color="green" key={4}>
              Đã hoàn thành
            </Tag>);


          case 0:
            return (<Tag color="red" key={0}>
              Đã hủy
            </Tag>);



          default:
            return null;
        }
      })()}
    </div>
  )
}

function generateCurrency(params) {
  return params.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}

function getDate(params) {
  const data = params?.split(".");
  return data[0];

}


const columns = [
  {
    title: "No",
    dataIndex: "key",
  },
  {
    title: "Ngày Đặt Hàng",
    dataIndex: "date",
    //sorter: (a, b) => a.name.length - b.title.name,
  },
  {
    title: "Khách hàng",
    dataIndex: "name",
    //sorter: (a, b) => a.name.length - b.title.name,
  },
  {
    title: "Trạng Thái",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <>
        {renderComponent(status)}

      </>

    )
  },
  {
    title: "Tổng Giá",
    dataIndex: "total",
    sorter: (a, b) => a.total - b.total,
  },
  {
    title: "Hành Động",
    dataIndex: "action",
  },
];

const Orders = () => {
  const { userInfoDTO } = useSelector((state) => state.auth);

  const [state, setState] = useState([]);

  useEffect(() => {
    getHistoryOrders(userInfoDTO.id);
  }, []);

  const getHistoryOrders = async (id) => {
    const res = await axios.get(`${URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        'ngrok-skip-browser-warning': 'true'

      },
    });
    if (res.status === 200) {
      setState(res.data);
    }
  }

  //const orderState = useSelector((state) => state.auth.orders);
  console.log(state)
  const data1 = [];
  for (let i = 0; i < state.length; i++) {
    data1.push({
      key: i + 1,
      date: getDate(state[i].orderDate),
      name: state[i].user.fullName,
      status: state[i].status,




      total: generateCurrency(state[i].total),

      action: (
        <>
          <Link to={`/admin/order/${state[i].id}`} className=" fs-3 text-danger">
            <BiEdit />
          </Link>
          {/* <Link className="ms-3 fs-3 text-danger" to="/">
            <AiFillDelete />
          </Link> */}
        </>
      ),
    });
  }
  return (
    <div>
      <h3 className="mb-4 title">Quản lý đơn hàng</h3>
      <div>{<Table columns={columns} dataSource={data1} />}</div>
    </div>
  );
};

export default Orders;
