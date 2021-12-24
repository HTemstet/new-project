import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit 
{  
  constructor(private messageService: MessageService,private myrouter:Router) { }
  ngOnInit() {
}
employee=true;
change()
{
  if(this.employee==false)
  {
    document.querySelector("p").style.color="rgb(245, 20, 12)";
    document.querySelector("h4").style.color="rgb(245, 20, 12)";
    document.querySelector("h1").style.color="#34495e";
    document.querySelector("i").style.color="#34495e";  
  }
}
gotoAboutEmployer()
{
  this.myrouter.navigate(['/aboutemployer'])
}
send()
{
  this.messageService.add({severity:'success', summary: 'אישור', detail:'תודה שפנית אלינו! בקשתך נשלחה'});
}
scrollToElement($element): void {
  console.log($element);
  $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}
} 






