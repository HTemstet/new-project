import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PeopleService } from 'src/app/Services/people.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/Services/validation.service';
import { SimpleObject } from 'src/app/Classes/SimpleObject';
import {MessageService} from 'primeng/api';
import { AreaService } from 'src/app/Services/area.service';
@Component({
  selector: 'app-enter',
  templateUrl: './enter.component.html',
  styleUrls: ['./enter.component.css']
})
export class EnterComponent implements OnInit {
  @Output() LoginSuccess:EventEmitter<any>=new EventEmitter<any>();
  Email:string;
  PeoplePassword:string;
  ValidPassword:string;
  TempPass:number;
  iconeye=false;
  iconlock=false;
  iconemail=false;
  iconeyeval=false;
  useBr=true;
  constructor(private GlobalServ:GlobalService,
    private PeopleServ:PeopleService,
    private ValidationServ:ValidationService,
    private messageService: MessageService,
    private AreaServ:AreaService,
    private myrouter:Router) {};
  ngOnInit() {
    if(this.ValidationServ.sendingTempPass)
    {
      setTimeout(() => {
        this.messageService.add({key:'mes',severity:'success', summary: 'אישור', detail:'סיסמה זמנית תישלח לכתובת המייל שלך בעוד מס דקות'});
      })
      this.useBr=false;
    }
    this.Email='';
    this.PeoplePassword='';
  }
  ChangeColor(i:number)
  {
    switch(i)
{
  case 0:{this.iconemail=true;break;};
  case 1:{this.iconlock=true;break;};
  case 2:{this.iconeye=true;break;};
  case 3:{this.iconeyeval=true;break;};
}
if( document.querySelectorAll("input")[i]!=undefined)
    document.querySelectorAll("input")[i].style.borderColor = "rgb(245, 20, 12)";
  }
  ColorChange(i:number)
  {
    switch(i)
{
  case 0:{this.iconemail=false;break;};
  case 1:{this.iconlock=false;break;};
  case 2:{this.iconeye=false;break;};
  case 3:{this.iconeyeval=false;break;};
}
if( document.querySelectorAll("input")[i]!=undefined)
    document.querySelectorAll("input")[i].style.borderColor = "gray";
  }
 TextType(i:number)
  {
    if( document.querySelectorAll("input")[i]!=undefined)
    document.querySelectorAll("input")[i].type= "text";
  }
  PasswordType(i:number)
  {
    if( document.querySelectorAll("input")[i]!=undefined)
    document.querySelectorAll("input")[i].type= "password";
  }
  ClosePopUp()
  {
    if(!this.PeopleServ.backtojoboffers&&!this.PeopleServ.backtoemloyee)
    {
      this.myrouter.navigateByUrl('/enter', {skipLocationChange: true}).then(()=>
      this.myrouter.navigate(["freeorbyrareaserach"]));    
    }
  }
  goToHome()
  {
    this.LoginSuccess.emit();
    if(this.PeopleServ.backtoemployer)
    {
      this.PeopleServ.backtoemployer =false;
      this.myrouter.navigateByUrl('/enter', {skipLocationChange: true}).then(()=>
      this.myrouter.navigate(["aboutemployer"]));  
      return;
    }
    if(this.PeopleServ.backtojobmanagement)
    {
      this.PeopleServ.backtojobmanagement = false;
      this.myrouter.navigateByUrl('freeorbyrareaserach', {skipLocationChange: true}).then(()=>
      this.myrouter.navigate(["/jobmanagement"]));    
      return;
    }
     if(this.PeopleServ.backtoemloyee)
    {
      this.PeopleServ.backtoemloyee =false;
      return;
    } 
    if(this.PeopleServ.backtojoboffers)
    {
      this.PeopleServ.backtojoboffers=false;
      return;
    }
    this.myrouter.navigateByUrl('/enter', {skipLocationChange: true}).then(()=>
    this.myrouter.navigate(["freeorbyrareaserach"]));  
  }
  ForgotPassword()
  {
   this.ValidationServ.knownPeople=true;
   this.myrouter.navigate(['/validation'])
  }
  NewUser()
  {
   this.ValidationServ.knownPeople=false;
   this.myrouter.navigate(['/validation'])
  }
  OkFunc()
  { 
    // if(this.formEent.form.valid)
    // {
      if(this.ValidationServ.sendingTempPass)
      this.PeopleServ.changePassword( this.Email,this.TempPass,this.PeoplePassword).subscribe(
      data=>{
        if(data!=null)
        {
          this.ValidationServ.knownPeople=false;
          this.PeopleServ.surf=data;
          this.ValidationServ.sendingTempPass=false;
          this.GlobalServ.OccuredEnterance=true;
          this.GlobalServ.display=false;
          // document.querySelector("nav").style.width = "800px";
          this.goToHome()
          }
        else
          this.ValidationServ.knownPeople=true;
          this.messageService.add({key:'mes',severity:'error', summary: 'שגיאה', detail:'פרטים שגויים הכנס שוב'});
        },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
    else
      this.PeopleServ.checkpeoplePassword(this.Email,this.PeoplePassword).subscribe(
        data=>{
               if(data!=null)
               {
                this.PeopleServ.surf=data
                this.GlobalServ.OccuredEnterance=true;
                this.GlobalServ.display=false;
                // document.querySelector("nav").style.width = "800px";
                // this.PeopleAreaServ.getAllads()
                this.goToHome();
                this.ValidationServ.PeopleValidation=new Array<SimpleObject>();
                // this.myrouter.navigateByUrl('/about', {skipLocationChange: true}).then(()=>
                // this.myrouter.navigate(["ads"]));
               }
               else
                  this.PeopleServ.checkpeopleTempPassword(this.Email,this.PeoplePassword).subscribe(
                    data=>{
                     if(data)
                     {
                       this.useBr=false;
                      this.ValidationServ.sendingTempPass=true;
                      this.myrouter.navigateByUrl('/freeorbyrareaserach', {skipLocationChange: true}).then(()=>
                      this.myrouter.navigate(["enter"]));
                      this.PeoplePassword='';
                     }
                     else
                     {
                      this.ValidationServ.knownPeople=true;
                      this.messageService.add({key:'mes',severity:'error', summary: 'שגיאה', detail:'פרטים שגויים הכנס שוב'});
                     }
                    },
                    error=>console.log(error.message),
                    ()=>console.log('finished')
                  );
               console.log(data);  
              },
        error=>console.log(error.message),
        ()=>console.log('finished')
      ); 
  }
    // }
    showResponse(event) {
      this.messageService.add({severity:'info', summary:'Succees', detail: 'User Responded', sticky: true});
  }  
}
