  export const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount);
  };