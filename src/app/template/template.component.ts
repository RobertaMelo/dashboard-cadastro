import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  @Input() namePage : string;
  @Input() imgIcon: string;
  
  constructor() { }

  ngOnInit() {
  }

}
