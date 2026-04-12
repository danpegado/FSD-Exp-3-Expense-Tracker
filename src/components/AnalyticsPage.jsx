import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const COLORS = [
  'var(--primary)',
  'var(--secondary)',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
];

const getMonthKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const formatCurrency = (value) => `₹ ${Number(value || 0).toFixed(2)}`;

const AnalyticsPage = ({ transactions, activeTheme }) => {
  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const currentMonthTransactions = useMemo(
    () => transactions.filter((t) => getMonthKey(t.date) === currentMonthKey),
    [transactions, currentMonthKey]
  );

  const monthIncome = useMemo(
    () => currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [currentMonthTransactions]
  );

  const monthExpense = useMemo(
    () => currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [currentMonthTransactions]
  );

  const monthTrendData = useMemo(
    () => [{ name: currentMonthKey, Income: monthIncome, Expense: monthExpense }],
    [currentMonthKey, monthIncome, monthExpense]
  );

  const expenseBreakdown = useMemo(() => {
    const byCategory = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        const key = t.category || 'Other';
        acc[key] = (acc[key] || 0) + Number(t.amount || 0);
        return acc;
      }, {});

    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [currentMonthTransactions]);

  const insights = useMemo(() => {
    if (currentMonthTransactions.length === 0) {
      return [{
        fact: 'No transactions found for the current month yet.',
        advice: 'Advice: Start logging income and expenses to unlock personalized financial recommendations.',
      }];
    }

    const highestCategory = expenseBreakdown[0];
    const topCategoryShare = highestCategory && monthExpense > 0
      ? ((highestCategory.value / monthExpense) * 100).toFixed(1)
      : null;

    const savings = monthIncome - monthExpense;
    const savingsRate = monthIncome > 0 ? ((savings / monthIncome) * 100).toFixed(1) : null;

    const output = [];

    if (highestCategory) {
      output.push({
        fact: `Highest spending category: ${highestCategory.name} (${formatCurrency(highestCategory.value)}).`,
        advice: Number(topCategoryShare) > 50
          ? 'Advice: A significant portion of your budget is going here. Consider reviewing these expenses to see if cutbacks are possible.'
          : 'Advice: This category leads your spending. Track weekly spend here to keep it under control.',
      });
    }

    if (topCategoryShare) {
      output.push({
        fact: `${topCategoryShare}% of your monthly expenses went to ${highestCategory.name}.`,
        advice: Number(topCategoryShare) > 50
          ? 'Advice: Concentrated spending increases risk. Try setting a tighter category limit this month.'
          : 'Advice: Your spending mix is reasonably balanced. Keep monitoring category drift over time.',
      });
    }

    if (monthIncome > 0) {
      output.push({
        fact: savings >= 0
          ? `You are net positive by ${formatCurrency(savings)} this month (${savingsRate}% savings rate).`
          : `You are overspending by ${formatCurrency(Math.abs(savings))} this month.`,
        advice: savings >= 0
          ? 'Advice: Excellent savings rate! Consider allocating this surplus towards an emergency fund or investments.'
          : 'Advice: You are currently spending more than your income this month. Review your discretionary spending to avoid debt.',
      });
    } else {
      output.push({
        fact: `No income recorded this month; total expenses currently ${formatCurrency(monthExpense)}.`,
        advice: 'Advice: Add income entries for a complete monthly picture and better savings recommendations.',
      });
    }

    return output.slice(0, 3);
  }, [currentMonthTransactions, expenseBreakdown, monthExpense, monthIncome]);

  const tooltipStyle = {
    backgroundColor: '#1a1a24',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
  };

  return (
    <>
      <header className="top-header">
        <h1 className="page-title fade-in">Analytics</h1>
      </header>

      <div className="dashboard-body fade-in">
        <div className="analytics-page-grid">
          <div className="cyber-card">
            <h3 className="card-title">Monthly Trends (Current Month)</h3>
            <div style={{ background: 'transparent' }}>
              <ResponsiveContainer width="100%" height={340} style={{ background: 'transparent' }}>
              <BarChart key={`analytics-bars-${activeTheme}`} data={monthTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#a0a0a0" tickLine={false} />
                <YAxis stroke="#a0a0a0" tickFormatter={(value) => `${value}`} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="Income" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={90} />
                <Bar dataKey="Expense" fill="var(--secondary)" radius={[6, 6, 0, 0]} maxBarSize={90} />
              </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="cyber-card">
            <h3 className="card-title">Expense Breakdown (Current Month)</h3>
            <div style={{ background: 'transparent' }}>
              <ResponsiveContainer width="100%" height={340} style={{ background: 'transparent' }}>
              {expenseBreakdown.length > 0 ? (
                <PieChart key={`analytics-pie-${activeTheme}`}>
                  <Pie
                    data={expenseBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={125}
                    stroke="none"
                    paddingAngle={2}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} formatter={(value) => formatCurrency(value)} />
                </PieChart>
              ) : (
                <p className="empty-state">No expense categories recorded this month.</p>
              )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="cyber-card">
          <h3 className="card-title">Dynamic Insights</h3>
          <ul className="analytics-insights-list">
            {insights.map((insight, index) => (
              <li key={`insight-${index}`}>
                <p>{insight.fact}</p>
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>{insight.advice}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
