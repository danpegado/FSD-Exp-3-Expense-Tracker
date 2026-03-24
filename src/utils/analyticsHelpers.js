export const filterByMonth = (transactions, monthYearStr) => {
  if (!monthYearStr) return transactions;
  return transactions.filter(t => t.date && t.date.startsWith(monthYearStr));
};

export const calculateTotals = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  return { income, expense, balance: income - expense };
};

export const generateCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => 
    `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
  );
  return [headers.join(','), ...rows].join('\n');
};

export const getTransactionStats = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Total transactions this month
  const totalCount = transactions.length;
  
  // Largest expense
  const largestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;
  
  // Most common category
  const categoryCounts = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});
  let mostCommonCategory = 'None';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) { maxCount = count; mostCommonCategory = cat; }
  }

  // Avg daily spending (Assuming current month length of 30 for simplicity)
  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const avgDaily = totalCount > 0 ? (totalExpenseAmount / 30) : 0;

  return { totalCount, largestExpense, mostCommonCategory, avgDaily };
};

export const getCategoryTotals = (transactions) => {
  return transactions.filter(t => t.type === 'expense').reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
};