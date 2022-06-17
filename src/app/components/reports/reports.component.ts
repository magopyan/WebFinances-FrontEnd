import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Transaction } from 'src/app/models/transaction';
import { StaticDataService } from 'src/app/services/static-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Category, Subcategory } from 'src/app/models/category';
import { TransactionService } from 'src/app/services/transaction.service';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  transactions!: Transaction[];
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  incomeVsExpenses = new Map<string, number>();
  incomeCategories = new Map<string, number>();
  expenseCategories = new Map<string, number>();

  income!: number;
  expenses!: number;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        }
      }
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  public pieChartData1: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartData2: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartData3: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };;

  constructor(private transactionService: TransactionService, public dialog: MatDialog, public snackBar: MatSnackBar,
    private staticDataService: StaticDataService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.getAllTransactions();
  }

  handleWindowSizeChange(e: any) {
    if (e.matches()) {
      console.log("<1080p");
    }
    else {
      console.log(">1080p");
    }
  }

  getAllTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (response: Transaction[]) => {
        this.resetValues();
        this.transactions = response;
        this.setIncomeVsExpenses();
        this.setIncomeCategories();
        this.setExpenseCategories();
        this.charts.forEach((child) => {
          child.chart?.update()
        });
      },
      error: (error: HttpErrorResponse) => {
        if (!this.snackBar._openedSnackBarRef) {
          this.snackBar.open("Server error when retrieving transactions. Please try to sign in again. ❌", "Dismiss");
        }
      }
    })
  }

  setIncomeVsExpenses() {
    for (let tran of this.transactions) {
      if (tran.subcategory.category.categoryType.coefficient == -1) {
        this.expenses += tran.amount;
      }
      else {
        this.income += tran.amount;
      }
    }
    this.incomeVsExpenses.set('Income', this.income);
    this.incomeVsExpenses.set('Expense', this.expenses);
    let index = 0;
    for (let [key, value] of this.incomeVsExpenses) {
      this.pieChartData1.labels?.push(key);
      this.pieChartData1.datasets[0].data[index++] = value;
    }
  }

  setIncomeCategories() {
    let incomeTransactions: Transaction[] = [];
    for (let tran of this.transactions) {
      if (tran.subcategory.category.categoryType.coefficient == 1) {
        incomeTransactions.push(tran);
      }
    }
    for (let tran of incomeTransactions) {
      let categoryName = tran.subcategory.category.name;
      if (this.incomeCategories.has(categoryName)) {
        let existingAmount = this.incomeCategories.get(categoryName);
        if (existingAmount != undefined) {
          this.incomeCategories.set(categoryName, existingAmount + tran.amount);
        }
      }
      else {
        this.incomeCategories.set(categoryName, tran.amount);
      }
    }
    let index = 0;
    for (let [key, value] of this.incomeCategories) {
      this.pieChartData2.labels?.push(key);
      this.pieChartData2.datasets[0].data[index++] = value;
    }
  }

  setExpenseCategories() {
    let expensesTransactions: Transaction[] = [];
    for (let tran of this.transactions) {
      if (tran.subcategory.category.categoryType.coefficient == -1) {
        expensesTransactions.push(tran);
      }
    }
    for (let tran of expensesTransactions) {
      let categoryName = tran.subcategory.category.name;
      if (this.expenseCategories.has(categoryName)) {
        let existingAmount = this.expenseCategories.get(categoryName);
        if (existingAmount != undefined) {
          this.expenseCategories.set(categoryName, existingAmount + tran.amount);
        }
      }
      else {
        this.expenseCategories.set(categoryName, tran.amount);
      }
    }
    let index = 0;
    for (let [key, value] of this.expenseCategories) {
      this.pieChartData3.labels?.push(key);
      this.pieChartData3.datasets[0].data[index++] = value;
    }
  }

  resetValues(): void {
    this.income = 0;
    this.expenses = 0;
  }
}
