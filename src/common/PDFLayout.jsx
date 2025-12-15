export const PDFLayout = ({ data }) => {
    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: 20, color: "#333", width: "100%" }}>
            <h1 style={{ textAlign: "center", fontSize: 24, marginBottom: 20 }}>
                Store Dashboard Report
            </h1>
            
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>Summary</h2>
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(4, 1fr)", 
                gap: 10, 
                marginBottom: 20,
                textAlign: "center"
            }}>
                <div style={{ border: "1px solid #ccc", padding: 10 }}>
                    <div style={{ fontWeight: "bold" }}>Total Revenue</div>
                    <div>₹{data?.summary?.totalRevenue || 0}</div>
                </div>
                <div style={{ border: "1px solid #ccc", padding: 10 }}>
                    <div style={{ fontWeight: "bold" }}>Total Orders</div>
                    <div>{data?.summary?.totalOrders || 0}</div>
                </div>
                <div style={{ border: "1px solid #ccc", padding: 10 }}>
                    <div style={{ fontWeight: "bold" }}>Active Products</div>
                    <div>{data?.summary?.activeProducts || 0}</div>
                </div>
                <div style={{ border: "1px solid #ccc", padding: 10 }}>
                    <div style={{ fontWeight: "bold" }}>Total Customers</div>
                    <div>{data?.summary?.totalCustomers || 0}</div>
                </div>
            </div>

            <h2 style={{ fontSize: 18, marginBottom: 10 }}>Best Selling Products</h2>
            <div style={{ marginBottom: 10 }}>Total Products Sold: {data?.bestSellingProducts?.length || 0}</div>
            <table width="100%" border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: 10 }}>
                <thead>
                    <tr>
                        <th width="50%" align="left">Sold</th>
                        <th width="50%" align="left">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.bestSellingProducts?.map((item) => (
                        <tr key={item._id}>
                            <td>{item.totalSold}</td>
                            <td>₹{item.revenue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};