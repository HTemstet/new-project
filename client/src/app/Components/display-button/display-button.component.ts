import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-button',
  templateUrl: './display-button.component.html',
  styleUrls: ['./display-button.component.css']
})
export class DisplayButtonComponent implements OnInit {

  constructor() { }
  @Input() changeCssEnter=false;
  @Input() Value='אישור'
  @Input() changeCssValidation=false;
  @Input() changeCssHome=false;
  ngOnInit() {
  }

}
