import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeopleService } from 'src/app/Services/people.service';
import { GlobalService } from 'src/app/Services/global.service';
import { MessageService } from 'primeng/api';
import { ValidationService } from 'src/app/Services/validation.service';
import { SimpleObject } from 'src/app/Classes/SimpleObject';
import { People } from 'src/app/Classes/People';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
  constructor(private GlobalServ:GlobalService,private PeopleServ:PeopleService,
    private ValidationServ:ValidationService,private myrouter:Router,
    private messageService: MessageService) { }
    Validations = new Array<SimpleObject>();
  ngOnInit() {
     this.ValidationServ.GetPeopleValidation(this.PeopleServ.surf.Code);
     this.ValidationServ.GetAllValidations().subscribe(
      data=>this.Validations = data,
      error=>console.log(console.log(error.message)),
     ()=>console.log('finished')
 );
  }
  logOf()
{
this.GlobalServ.OccuredEnterance=false;
this.PeopleServ.surf=new People();
// document.querySelector("nav").style.width = "1250px";
this.myrouter.navigate(["/freeorbyrareaserach"]); 
}
GetAllVal(i:number)
{
  if(this.Validations.length == 0)
  this.ValidationServ.GetAllValidations().subscribe(
    data=>{this.Validations = data;
      return this.Validations.find(x=>x.Code == i).Name},
    error=>console.log(console.log(error.message)),
   ()=>console.log('finished')
);
else
 return this.Validations.find(x=>x.Code == i).Name
}
  OkFunc()
  {
    this.PeopleServ.updatepeople().subscribe(
      data=>
      //alert('השינויים נשמרו'),
      this.messageService.add({key:'mes', severity:'success', summary:'!מצוין', detail: 'השינויים נשמרו', sticky: true}),
      error=>console.log(console.log(error.message)),
     ()=>console.log('finished')
 );
  }
SaveValidations()
{
  this.ValidationServ.SavePeopleValidation().subscribe(
    data=>{console.log('success');
  //alert('עודכנו פרטי ההתחברות')},
  this.messageService.add({key:'mes', severity:'success', summary:'!יופי', detail: 'עודכנו פרטי ההתחברות', sticky: true})},
    error=>console.log(error.message),
    ()=>console.log('finished')
    );
}

 
  
AdministratorPart()
{
alert('כאן יהיה חלק עריכת התחומים והקריטריונים')
}
}