import { AccountType } from "./account-type";

export interface Account {
    id?: number;
    name: string;
    balance: number;
    accountType: AccountType;
}