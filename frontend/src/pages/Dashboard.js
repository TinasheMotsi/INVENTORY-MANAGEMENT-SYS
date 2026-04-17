import React, { useEffect, useState } from "react";
import styled from "styled-components";
import API from "../services/api";
import Layout from "../components/layout/Layout";
import StockChart from "../components/StockChart";

const CardContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  flex: 1;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Layout><h2>Loading dashboard...</h2></Layout>;
  }

  return (
    <Layout>
      <h2>Dashboard</h2>

      <CardContainer>
        <Card>
          <h3>Total Products</h3>
          <p>{data.totalProducts}</p>
        </Card>

        <Card>
          <h3>Total Stock</h3>
          <p>{data.totalStock}</p>
        </Card>
      </CardContainer>

      <h3 style={{ marginTop: "30px" }}>Low Stock</h3>

      {data.lowStock.length === 0 ? (
        <p>No low stock items ✅</p>
      ) : (
        data.lowStock.map((item) => (
          <Card key={item.id}>
            {item.name} - {item.quantity}
          </Card>
        ))
      )}

      <StockChart />
    </Layout>
  );
};

export default Dashboard;