// Utility function to validate wallet balance input
export const validateWalletBalance = (currentBalance: number, change: number): boolean => {
    const newBalance = currentBalance + change;
    return newBalance >= 0;  // Ensure balance doesn't go negative
  };
  