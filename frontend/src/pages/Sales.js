import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/layout/Layout";

const Sales = () => {
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    const res = await API.get("/sales");
    setSales(res.data);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <Layout>
      <h2>Sales History</h2>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.quantity}</td>
              <td>${Number(s.total_price).toFixed(2)}</td>
              <td>{new Date(s.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Sales;