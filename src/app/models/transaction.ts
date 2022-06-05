import { Account } from "./account";
import { Subcategory } from "./category";

export interface Transaction {
    id?: number;
    amount: number;
    note: string;
    date: any;
    subcategory: Subcategory;
    account: Account;
}