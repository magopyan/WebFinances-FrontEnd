import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { SelectedService } from 'src/app/services/selected.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

  @Input() category!: Category;
  chosenCategory: any;

  constructor(private selectedService: SelectedService) { }

  ngOnInit(): void {
    this.selectedService.getCategory().subscribe(
      (category) => this.chosenCategory = category);
  }

  onSelectCategory() {
    this.selectedService.setCategory(this.category);
  }
}
