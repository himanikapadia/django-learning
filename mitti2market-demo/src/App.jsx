import React, { useState } from 'react';

// Mock registered farmers (Farmer Module)
const initialFarmers = [
  { id: 1, name: "Ramesh Patel", crop: "Wheat", availableQty: 60, location: "Zone 1 - North" },
  { id: 2, name: "Suresh Patel", crop: "Wheat", availableQty: 50, location: "Zone 1 - East" },
  { id: 3, name: "Dinesh Bhai", crop: "Wheat", availableQty: 40, location: "Zone 2 - South" },
  { id: 4, name: "Mahesh Bhai", crop: "Rice", availableQty: 100, location: "Zone 1 - West" },
];

export default function App() {
  const [crop, setCrop] = useState("Wheat");
  const [requiredQty, setRequiredQty] = useState(100);
  const [buyerLocation, setBuyerLocation] = useState("Zone 1");
  const [order, setOrder] = useState(null);

  // Core Engine & Matching Logic
  const handleProcessOrder = (e) => {
    e.preventDefault();

    // 1. Demand Management: Capture input
    // 2. Smart Matching & Supply Pooling: Find matching crop in vicinity
    const matchingFarmers = initialFarmers.filter(
      (f) => f.crop === crop && f.location.includes(buyerLocation)
    );

    // 3. Pool capacity
    let pooledQty = 0;
    const selectedFarmers = [];
    for (let farmer of matchingFarmers) {
      if (pooledQty < requiredQty) {
        selectedFarmers.push(farmer);
        pooledQty += farmer.availableQty;
      }
    }

    // 4. Order & Logistics generation
    setOrder({
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      crop,
      requestedQty: requiredQty,
      fulfilledQty: pooledQty,
      farmers: selectedFarmers,
      status: pooledQty >= requiredQty ? "Order Finalized & Dispatched" : "Partially Pooled",
      paymentStatus: "Escrow Locked (Buyer to Escrow)",
      logisticsRoute: `${buyerLocation} Consolidation Hub -> Delivery Drop`,
    });
  };

  return (
    <div style={{ fontFamily: "Segoe UI, Tahoma, sans-serif", maxWidth: 850, margin: "30px auto", padding: 24, background: "#f8fafc", borderRadius: 12 }}>
      <header style={{ borderBottom: "2px solid #e2e8f0", paddingBottom: 12, marginBottom: 20 }}>
        <h1 style={{ margin: 0, color: "#1e3a8a", fontSize: 24 }}>🌱 Mitti2Market — Core Engine Prototype</h1>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Event-driven Buyer Pooling, Farmer Matching & Order Lifecycle</p>
      </header>

      {/* Buyer & Demand Module */}
      <section style={{ background: "#ffffff", padding: 18, borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 12px", color: "#334155" }}>1. Buyer Module (Post Crop Demand)</h3>
        <form onSubmit={handleProcessOrder} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "#475569" }}>Crop</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1" }}>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "#475569" }}>Quantity (Quintals)</label>
            <input 
              type="number" 
              value={requiredQty} 
              onChange={(e) => setRequiredQty(Number(e.target.value))} 
              style={{ padding: 7, width: 100, borderRadius: 6, border: "1px solid #cbd5e1" }} 
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "#475569" }}>Target Hub / Zone</label>
            <select value={buyerLocation} onChange={(e) => setBuyerLocation(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1" }}>
              <option value="Zone 1">Zone 1</option>
              <option value="Zone 2">Zone 2</option>
            </select>
          </div>
          <button type="submit" style={{ padding: "8px 18px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
            Submit to Core Engine
          </button>
        </form>
      </section>

      {/* Core Engine Output */}
      {order && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Smart Matching & Supply Pooling */}
          <div style={{ background: "#ffffff", padding: 18, borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 16, color: "#0f766e" }}>2. Smart Matching & Pooling</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px" }}>Aggregating nearby micro-farmers to fulfill order:</p>
            {order.farmers.length === 0 ? (
              <p style={{ color: "#ef4444", fontSize: 14 }}>No local farmer inventory found for this zone.</p>
            ) : (
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14 }}>
                {order.farmers.map((f) => (
                  <li key={f.id} style={{ marginBottom: 6 }}>
                    <strong>{f.name}</strong>: {f.availableQty} Quintals ({f.location})
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: 12, padding: 8, background: "#f0fdf4", borderRadius: 6, fontSize: 13, color: "#166534" }}>
              Total Pooled: <strong>{order.fulfilledQty}</strong> / {order.requestedQty} Quintals
            </div>
          </div>

          {/* Order, Logistics & Settlement */}
          <div style={{ background: "#ffffff", padding: 18, borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 16, color: "#1e3a8a" }}>3. Order, Logistics & Escrow</h3>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <div><strong>Order ID:</strong> {order.id}</div>
              <div><strong>Lifecycle Status:</strong> <span style={{ color: "#16a34a", fontWeight: 600 }}>{order.status}</span></div>
              <div><strong>Quality & Quantity:</strong> Verified via Hub Specs</div>
              <div><strong>Payment Settlement:</strong> {order.paymentStatus}</div>
              <div><strong>Cluster Route:</strong> {order.logisticsRoute}</div>
              <div style={{ marginTop: 8, color: "#64748b" }}>
                <em>IVR/Exotel triggers dispatched to {order.farmers.length} pooled farmers.</em>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}