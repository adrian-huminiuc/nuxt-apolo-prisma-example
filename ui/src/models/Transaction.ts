export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  date: string;
  currency: string;
  account: {
    name: string;
    bank: string;
  };
  category: {
    id: string;
    color: string;
    name: string;
  };
}
