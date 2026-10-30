/** Local sample todos – there is no todo API yet */
export interface TodoItem {
  title: string;
  id: number;
  /** "pending" | "done" – also used as the CSS class */
  status: string;
  isAddedToTask: boolean;
}
