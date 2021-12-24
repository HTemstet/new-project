import { Component, OnInit} from '@angular/core';
import { GlobalService } from 'src/app/Services/global.service';
import { PeopleService } from 'src/app/Services/people.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/Services/validation.service';
import { SimpleObject } from 'src/app/Classes/SimpleObject';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {
  constructor(private GlobalServ:GlobalService ,
    private PeopleServ:PeopleService,private ValidationServ:ValidationService,
    private messageService: MessageService, 
    private myrouter:Router) { }
  ValidationsList:Array<SimpleObject>=[]
  existsPeople=false;
  NotExistsValidation=false;
  Email='';
  ngOnInit() {
    if(this.ValidationServ.knownPeople)
     this.ValidationServ.GetRandomValidations()
.subscribe(
      data=>
      {
        this.ValidationsList=data
       this.ValidationServ.PeopleValidation= 
       new Array<SimpleObject>(data.length)
       for(let i=0;i<data.length;i++)
       { 
        this.ValidationServ.PeopleValidation[i]=new SimpleObject();
        this.ValidationServ.PeopleValidation[i].Code=
        data[i].Code
       }   
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
    else
    this.ValidationServ.GetAllValidations()
    .subscribe(
          data=>
          {
            this.ValidationsList=data
           this.ValidationServ.PeopleValidation= 
           new Array<SimpleObject>(data.length)
           for(let i=0;i<data.length;i++)
           { 
            this.ValidationServ.PeopleValidation[i]=new SimpleObject();
            this.ValidationServ.PeopleValidation[i].Code=
            data[i].Code
           }   
          },
          error=>console.log(error.message),
          ()=>console.log('finished')
        );
  }
  ChangeColor(i:number)
  {
    document.querySelectorAll("input")[i].style.borderColor = "rgb(245, 20, 12)";
  }
  ColorChange(i:number)
  {
    document.querySelectorAll("input")[i].style.borderColor = "gray";
  }
  OkFunc()
  {
   if(this.ValidationServ.knownPeople)
   {
    this.ValidationServ.checkpeopleValidation(this.Email).subscribe(
      data=>
           {
               if(data==true)
               {
                this.NotExistsValidation=false;
                this.ValidationServ.knownPeople=false;
                this.ValidationServ.sendingTempPass=true;
                this.myrouter.navigate(['/enter']);
               }
               else
               {
                this.NotExistsValidation=true;
                this.messageService.clear();
                this.messageService.add({severity:'error', summary: 'שגיאה', detail:'פרטים שגויים הכנס שוב'});
               }
          },
              error=>console.log(error.message),
              ()=>console.log('finished')
               );
   } 
  else 
  this.ValidationServ.AddNewPeople(this.Email).subscribe(
    data=>{
      if(data==true)
      {
        console.log('dddd');
        this.existsPeople=false;
        this.ValidationServ.sendingTempPass=true;
        this.myrouter.navigate(['/enter']);
      }
     else 
     {
      this.existsPeople=true;   
      this.messageService.clear();
      this.messageService.add({ severity:'warn', summary: 'שים לב', detail:'פרטיך רשומים אצלינו, לחץ על כניסה'});
     } 
     },
   error=>console.log(error.message),
   ()=>console.log('finished')
  );
 }



//  
display:boolean=false;
submitWork:boolean=false;
new:boolean;
edit:boolean;
// constructor(private ma:MakeActivitiesService) { }

// ngOnInit() {
// this.ma.copyMA = {...this.ma.currentMA};
// this.open.copyCamp = { ...this.open.camp };



// editPaymentDetails()
// {
// this.display=true;
// }
// saveForm()
// {debugger;
// if(this.ma.currentMA.tz=="")
//   this.ma.addMA(this.ma.copyMA).subscribe(data=>
//     {this.ma.allMakeActivities=data;},
//      err=>{alert(err.message)});
// else
//   this.ma.editMA(this.ma.copyMA).subscribe(data=>
//     {this.ma.allMakeActivities=data;},
//     err=>{alert(err.message)});
// }
// OK()
// {
// debugger;
// this.ma.copyMA.bankAccount=this.ma.copyMAP.bankAccount;
// this.ma.copyMA.bankAddress=this.ma.copyMAP.bankAddress;
// this.ma.copyMA.bankName=this.ma.copyMAP.bankName;
// this.ma.copyMA.numBank=this.ma.copyMAP.numBank;
// this.ma.copyMA.numBranch=this.ma.copyMAP.numBranch;

// this.display=false;
// }
// cancel()
// {
// this.display=false;
// }
}
