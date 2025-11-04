export interface Expense {
  id: number;
  title: string;
  amount: number;
  type?: string;
  area?: string;
  expenseDate: string;
  isChecked: boolean;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  typeId?: number;
  area?: string;
  expenseDate?: string;
  tripPlanId: number;
}
