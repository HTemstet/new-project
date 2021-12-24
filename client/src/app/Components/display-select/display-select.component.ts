import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SimpleObject } from 'src/app/Classes/SimpleObject';
import { AreaService } from 'src/app/Services/area.service';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-display-select',
  templateUrl: './display-select.component.html',
  styleUrls: ['./display-select.component.css']
})
export class DisplaySelectComponent implements OnInit {
  links:any;
  ngOnInit() 
  {
    this.links = document.getElementsByClassName('link')
    for(let i = 0; i <= this.links.length; i++)
    this.addClass(i)}
  constructor(private GlobalServ:GlobalService) { }
  @Input() list:Array< any>=null;
  @Input() Title="בחר תחום";
  @Output() changedisplay:EventEmitter<SimpleObject>=new EventEmitter<SimpleObject>();
  @Output() CloseDisplay:EventEmitter<any>=new EventEmitter<any>();
  @Output() MouseOver:EventEmitter<SimpleObject>=new EventEmitter<SimpleObject>();
  Object=new SimpleObject();
  sendmotofather(i:SimpleObject)
  {
    this.Object=i;
    this.changedisplay.emit(this.Object);
  }
  Close()
  {
    this.CloseDisplay.emit();
  }
  SendMouseOver(i:SimpleObject)
  {
    this.MouseOver.emit(i);
  }
 addClass(id){
  setTimeout(()=>{
    if(id > 0) 
    {
     if(this.links[id-1]!=undefined) 
      this.links[id-1].classList.remove('hover')
      if(id<this.links.length) 
      this.links[id].classList.add('hover')
    }
 }, id*750);
  //  setTimeout(function(){
  //     if(id > 0) this.links[id-1].classList.remove('hover')
  //     this.links[id].classList.add('hover')
  //  }, id*750) 
}
}
