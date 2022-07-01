import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Transaction } from 'src/app/models/transaction';
import { StaticDataService } from 'src/app/services/static-data.service';
import { MatDialog } from '@angular/material/dialog';
import { TransactionService } from 'src/app/services/transaction.service';
import { AccountService } from 'src/app/services/account.service';
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

  startDate!: Date | string;
  endDate!: Date | string;
  dateRangeSet: boolean = false;

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
  };

  constructor(private transactionService: TransactionService, public dialog: MatDialog, public snackBar: MatSnackBar,
    private staticDataService: StaticDataService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.getAllTransactions();
  }

  getAllTransactions(): void {
    if (this.dateRangeSet) {
      this.transactionService.getAllTransactionsByDateRange(this.parseDate(this.startDate as Date), this.parseDate(this.endDate as Date)).subscribe({
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
    else {
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
  }

  filterByDateRange() {
    this.dateRangeSet = true;
    console.log("filter");
    this.getAllTransactions();
  }

  parseDate(date: Date): string {
    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  resetDateRange() {
    this.dateRangeSet = false;
    this.startDate = "";
    this.endDate = "";
    this.getAllTransactions();
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
    if (this.income > 0) {
      this.incomeVsExpenses.set('Income', this.income);
    }
    if (this.expenses > 0) {
      this.incomeVsExpenses.set('Expense', this.expenses);
    }
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

    this.incomeVsExpenses = new Map<string, number>();
    this.incomeCategories = new Map<string, number>();
    this.expenseCategories = new Map<string, number>();

    this.pieChartData1 = {
      labels: [],
      datasets: [{
        data: []
      }]
    };
    this.pieChartData2 = {
      labels: [],
      datasets: [{
        data: []
      }]
    };
    this.pieChartData3 = {
      labels: [],
      datasets: [{
        data: []
      }]
    };
  }

  downloadReport(): void {
    if(this.dateRangeSet) {
      this.transactionService.exportToExcelByDateRange(this.parseDate(this.startDate as Date), this.parseDate(this.endDate as Date)).subscribe({
        next: (response) => {
          console.log(response);
          let blob: Blob = response.body as Blob;
          let filename = response.headers.get('content-disposition')?.split(';')[1].split('=')[1];
          let downloadLink = document.createElement('a');
          downloadLink.download = filename!;
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.click();
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open("Server error when creating report. Please try to sign in again. ❌", "Dismiss");
        }
      })
    }
    else {
      this.transactionService.exportToExcel().subscribe({
        next: (response) => {
          console.log(response);
          let blob: Blob = response.body as Blob;
          let filename = response.headers.get('content-disposition')?.split(';')[1].split('=')[1];
          let downloadLink = document.createElement('a');
          downloadLink.download = filename!;
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.click();
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open("Server error when creating report. Please try to sign in again. ❌", "Dismiss");
        }
      })
    }
  }
}
