import { Component, Input, OnInit } from '@angular/core';
import { Subcategory } from 'src/app/models/category';
import { SelectedService } from 'src/app/services/selected.service';

@Component({
  selector: 'app-subcategory-view',
  templateUrl: './subcategory-view.component.html',
  styleUrls: ['./subcategory-view.component.scss']
})
export class SubcategoryViewComponent implements OnInit {

  @Input() subcategory!: Subcategory;
  chosenSubcategory: any;

  constructor(private selectedService: SelectedService) { }

  ngOnInit(): void {
    this.selectedService.getSubcategory().subscribe(
      (subcategory) => this.chosenSubcategory = subcategory);
  }

  onSelectSubcategory() {
    this.selectedService.setSubcategory(this.subcategory);
  }
}
