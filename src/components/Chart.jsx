import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const Chart = ({ data }) => {
  // Use data directly if it is an array, or map values and frequency if it matches { values: [], frequency: [] } format
  let chartData = [];

  if (Array.isArray(data)) {
    chartData = data;
  } else if (data && data.values && data.frequency) {
    chartData = data.values.map((val, index) => ({
      name: String(val),
      value: data.frequency[index] || 0
    }));
  }
  
  if (!chartData || chartData.length === 0) {
    return <div className="text-muted">No chart data available for these results.</div>;
  }
  
  return (
    <div>
      <h2>Data Distribution</h2>
      <div className="text-muted">Values vs Frequency</div>
      
      <div style={{ marginTop: '2rem', height: '350px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-main)' }}
            />
            <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
