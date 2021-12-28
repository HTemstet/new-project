import { Component, OnInit,ViewEncapsulation, ViewChildren, QueryList, ViewChild, OnDestroy, HostListener} from '@angular/core';
import { CriterionsofAreas } from 'src/app/Classes/CriterionsofAreas';
import { RequestService, TypesEnum } from 'src/app/Services/request.service';
import { AreaService } from 'src/app/Services/area.service';
import { PeopleService } from 'src/app/Services/people.service';
import { SimpleObject } from 'src/app/Classes/SimpleObject';
import { GlobalService } from 'src/app/Services/global.service';
import {MenuItem, MessageService} from 'primeng/api';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/Services/validation.service';
import { NgForm } from '@angular/forms';
import { myRequest } from 'src/app/Classes/myRequest';
import { ComponentCanDeactivate } from 'src/app/OtherPages/pending-changes';
import { Observable } from 'rxjs/Observable';
// import * as $ from "jquery";
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RequestComponent implements OnInit ,ComponentCanDeactivate {
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if(this.finish)
      return true;
    return false;
  }


    
  constructor(private GlobalServ:GlobalService,
    private AreaServ:AreaService,
    private PeopleServ:PeopleService,
    private RequestServ:RequestService,
    private ValidationServ:ValidationService,
    private messageService:MessageService,
    private myrouter:Router,
    private activatedRoute:ActivatedRoute ) {


  }
  CriterionsofAreaListSmall=new Array<CriterionsofAreas>();
  showprophilbutton=false;
  showspecificpeopleprophil=false;
  ValueofListCode=0;
  DisplayLivingPlace=false;
  DisplayWorkingPlace=false;
  DisplayLearningPlaces=false;
  DisplayExperiencese=false;
  DisplayFavoritePeople=false;
  DisplayTimes=false;
  value: number = 100;
  items: MenuItem[];
  TypeofNewCriterion=0;
  ShowTypes=true;
  activeIndex=0;
  EnumTypes=TypesEnum;
  TitlesList:Array<SimpleObject>;
  SendingJobOffers=false;
  modelV=false;
  rightChoice=1;
  modelVText = "מייד יוצגו עבורך ההצעות המתאימות";
  finish=false;
  Title=new SimpleObject();
  FormValidations=new Array<CriterionsofAreas>(); 
  @ViewChild("CriterionsForm",{static:false}) CriterionsForm:NgForm;
  requestId:number=0
  ngOnInit() 
  {
  this.requestId= +this.activatedRoute.snapshot.params["id"];
  if(this.requestId!=0&&this.RequestServ.Request.RequestCode!=this.requestId)
  {
    this.RequestServ.GetRequestByRequestId(this.requestId).subscribe(data=>{

      this.RequestServ.Request=data;
      this.getTitles();
      this.ChooseEmployeeFunc();
    });
  }
  else
  {
  this.RequestServ.Request.CriterionsofRequests=new Array<CriterionsofAreas>(); 
  this.getTitles();
  this.ChooseEmployeeFunc();
  }
  } 
  ChooseEmployeeFunc()
    {
      this.RequestServ.getAllCriterionsByArea().subscribe(
        data=>{
         if(this.RequestServ.Request.CriterionsofRequests.length == 0||this.RequestServ.Request.CriterionsofRequests[0].AreaCode!= this.AreaServ.FullArea.Code)
          this.RequestServ.Request.CriterionsofRequests=data;
         this.TypesFunc();
         this.ChooseTitle(this.TitlesList[0]);
        },
        error=>console.log(error.message),
        ()=>console.log('finished')
      );
    }
  getTitles()
  {
    this.RequestServ.getTitles().subscribe(
      data=>{
        this.TitlesList=data;
        this.items = [];
        for(let i=0;i<this.TitlesList.length;i++)
        {
          this.items.push(
            {label: this.TitlesList[i].Name,
          command: (event: any) => {
            this.activeIndex = this.TitlesList[i].Code-1;
            this.ChooseTitle(this.TitlesList[i])
        }}  ); }
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
  }
  saveRequiredValidations(CriterionsList:Array<CriterionsofAreas>)
  {
    for(let i=0;i<CriterionsList.length;i++)
    {
      if(CriterionsList[i].FeildValidation!=null&&
        CriterionsList[i].FeildValidation.indexOf('required')>-1&&CriterionsList[i].ValueofCriterion == null)
      {
        this.FormValidations.push(CriterionsList[i]);
        CriterionsList[i].required='*';
      }
    }
  }
  ChooseTitle(event:SimpleObject,validate=true)
  {
    if(this.FormValidations.length>0&&validate)
  {
    this.messageService.clear();
    this.messageService.add({key: 'a', severity:'error', summary:'שגיאה', detail:'טופס שגוי'});

    return;
  }
    if(this.CriterionsForm.invalid&&validate)
    {
      this.messageService.clear();
      this.messageService.add({key: 'a', severity:'error', summary:'שגיאה', detail:this.CriterionsForm.errors.toString()});
      return;
    }
      this.Title=event;
      this.CriterionsofAreaListSmall=this.RequestServ.Request.CriterionsofRequests.filter(x=>
        x.CriterionsTitleCode==event.Code); 
     if(this.CriterionsofAreaListSmall==null)
     this.CriterionsofAreaListSmall=new Array<CriterionsofAreas>();
     this.saveRequiredValidations(this.CriterionsofAreaListSmall);
  }
  changeIndex()
  {
    this.activeIndex++;
  }
    TypesFunc(List=this.RequestServ.Request.CriterionsofRequests)
    {
      for(let i=0;i<List.length;i++)
      {
   // הערה: אם בכל מקרה עושים המרה לאי נום בשרת, עדיף כבר להחזיר רק את ערכי האינום בלי טיפוס מספרי 
   // אולי לחשוב על שימוש במספרים באינום- ואלו יהיו המספרים במסד
   switch(List[i].CriterionsType)
   {
    case 0: List[i].TypeEnum=this.EnumTypes.List;;break;
    case 1: List[i].TypeEnum=this.EnumTypes.Number;break;
    case 2: List[i].TypeEnum=this.EnumTypes.Boolean;break;
    case 3: List[i].TypeEnum=this.EnumTypes.Date;break;
    case 4: List[i].TypeEnum=this.EnumTypes.Hour;break;
    case 5: List[i].TypeEnum=this.EnumTypes.PartOfaList;break;
   }
   if(List[i].CriterionsofAreasTree.length>0) 
   this.TypesFunc(List[i].CriterionsofAreasTree) 
      }
    }
    
    // ChoosePeople(Code:number)
    // {
    //   this.showprophilbutton=true;
    //   this.ChosenFavoritePeople.Code=Code;
    // }
    ShowSpecificProphil()
    {   
      this.showspecificpeopleprophil=true;
    }
    SubmitChosenPeople()
    {
    }
    ShowLivingPlace()
    {
     this.DisplayLivingPlace=!this.DisplayLivingPlace
    }
    ShowWorkingPlace()
    {
      this.DisplayWorkingPlace=!this.DisplayWorkingPlace
    }
    
    ShowLearningPlaces()
    {
      this.DisplayLearningPlaces=!this.DisplayLearningPlaces
    }
    ShowExperiencese()
    {
      this.DisplayExperiencese=!this.DisplayExperiencese
    }
    ShowFavoritePeople()
    {
      this.DisplayFavoritePeople=!this.DisplayFavoritePeople
    }
    ShowTimes()
    {
      this.DisplayTimes=!this.DisplayTimes
    }
  ChooseType(Type:number)
  {
   this.TypeofNewCriterion=Type
  }
  OpenList()
  {
   this.ShowTypes=!this.ShowTypes;
  }
  @ViewChildren('myform') components:QueryList<any>;
 RemoveHiddenTitles(event:any,AddOrRemove:boolean)
  {for(let i=0;i<this.components.length;i++)
    {
      if(event.innerText!=this.components.toArray()[i].nativeElement.innerText)
      {
        if(AddOrRemove)
        {
          this.components.toArray()[i].nativeElement.hidden=true;
        }
        else
        {
          this.components.toArray()[i].nativeElement.hidden=false;
        }
      }       
    }     
  }
  FormFunc(event)
  {
    for(let i=0;i<this.components.toArray().length;i++)
      if(event.srcElement.innerText!=this.components.toArray()[i].nativeElement.innerText)
      {      
       if(event.srcElement.getAttribute('class').search('active')==-1)
       {
        event.srcElement.active=false;
        this.RemoveHiddenTitles(event.srcElement,true)
        console.log('khhjjh')
       }
         else
         {
          event.srcElement.active=true;
          this.RemoveHiddenTitles(event.srcElement,false)
         }
      }
  }
  SendEmailRadioChangeevent()
  {
    if(this.PeopleServ.surf.Code==0)
    {
      this.onReject();
      this.PeopleServ.backtoemloyee=true;
      this.GlobalServ.display = true;
      this.ValidationServ.sendingTempPass=false;
    }
  }
  OkFunc()
  {
    this.SendingJobOffers=false;
    if(this.PeopleServ.surf.Code==0&&this.rightChoice!=1)
      this.SendEmailRadioChangeevent();
   else{
    if(this.rightChoice==1)
    {
      this.RequestServ.Request.SendingJobOffersOnceaDay=false;
      this.RequestServ.Request.SendingJobOffersWheneverThereIsaSuitableOffer=false;
    }
    else if(this.rightChoice==2)
    {
      this.RequestServ.Request.SendingJobOffersWheneverThereIsaSuitableOffer=false;
      this.RequestServ.Request.SendingJobOffersOnceaDay=true;
    }
    else
      {
        this.RequestServ.Request.SendingJobOffersWheneverThereIsaSuitableOffer=true;
        this.RequestServ.Request.SendingJobOffersOnceaDay=false;
      }
      if(this.requestId==0)
    this.RequestServ.sendRequest().subscribe(
      data=>{
        this.modelV=true;
        this.RequestServ.JobOffers=data;
        if(this.RequestServ.JobOffers.length>0)
        {
          this.myrouter.navigate(['joboffers']);
        }
       else
       {
          this.modelVText = 'אין הצעות מתאימות כרגע, חכה להצעות מתאימות או שנה את הגדרות הסוכן ';
       }
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
      }
  }
  cancel()
  {
    this.myrouter.navigate(['freeorbyrareaserach']);
  }
  model()
  {
    if(this.RequestServ.Request.Employee==false)
    {
      this.RequestServ.Request.SendingJobOffersOnceaDay=false;
      this.RequestServ.Request.SendingJobOffersWheneverThereIsaSuitableOffer=false;
      this.RequestServ.sendRequest().subscribe(
      data=>{
        
          this.modelV=true;
          this.modelVText = 'מועמדים רלוונטיים יצרו איתך קשר';
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
    }
    else
    {
            if(this.requestId==0)
                this.SendingJobOffers=true;
            else{
              this.RequestServ.sendRequest().subscribe(
                data=>{
                  this.modelV=true;
                  this.RequestServ.JobOffers=data;
                  if(this.RequestServ.JobOffers.length>0)
                  {
                    this.myrouter.navigate(['joboffers']);
                  }
                 else
                 {
                    this.modelVText = 'אין הצעות מתאימות כרגע, חכה להצעות מתאימות או שנה את הגדרות הסוכן ';
                 }
                },
                error=>console.log(error.message),
                ()=>console.log('finished')
              );
            }
    }
  }
  updateEmailsStatus()
  {
    this.SendingJobOffers=true;
  }
  Previos(e:any)
  {
    this.FormValidations= new Array<CriterionsofAreas>();
        if(this.activeIndex==0)
        {
          e.disabled ="disabled";
        }
        else{
          this.activeIndex--;
          this.ChooseTitle(this.TitlesList[this.activeIndex],false);  
        }
  }
  Next(e:any)
  {
    if(this.FormValidations.length>0)
    {
      this.messageService.clear();
      this.messageService.add({key: 'a', severity:'error', summary:'שגיאה', detail:'טופס שגוי'});  
      return;
    }
      if(this.CriterionsForm.invalid)
      {
        this.messageService.clear();
        this.messageService.add({key: 'a', severity:'error', summary:'שגיאה', detail:this.CriterionsForm.errors.toString()});  
        return;
      }
        if(this.activeIndex!=this.TitlesList[this.TitlesList.length-1].Code-1)
        {
          this.changeIndex();
          this.ChooseTitle(this.TitlesList[this.activeIndex]);
        }
        else
          e.disabled ="disabled";
  }
  showConfirm() {
  if(this.FormValidations.length>0)
  {
    this.messageService.clear();
    this.messageService.add({key: 'a', severity:'error', summary:'שגיאה', detail:'טופס שגוי'});
    return;
  }
   if(this.CriterionsForm.invalid)
   {
    this.messageService.clear();
    this.messageService.add({key: 'a', severity:'error', summary:'שגיאה', detail:this.CriterionsForm.errors.toString()});
    return;
   }
    this.finish=true;
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Are you sure?', detail:'Confirm to proceed'});
}
removeRequest()
{
  this.RequestServ.deleteRequest(this.requestId).subscribe(data=>{ 
   this.messageService.add({severity:'success', summary: 'אישור', detail:'הבקשה נמחקה בהצלחה'});
    setTimeout( () => { 
      this.finish=true;
      this.myrouter.navigateByUrl('freeorbyrareaserach');
    }, 3000 );
  })
}
InValid(i:CriterionsofAreas)
{
  if(!this.FormValidations.find(x=>x==i))
  {
    this.FormValidations.push(i);
  }
}
Valid(i:CriterionsofAreas)
{
 if(this.FormValidations.find(x=>x==i))
  this.FormValidations=this.FormValidations.filter(x=>x!=i);
  if(i.TypeEnum==TypesEnum.List)
  { 
   for(let j=0;j<i.CriterionsofAreasTree.length;j++)
   {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
     if(i.ValueofCriterion!=null&&i.ValueofCriterion.length)
      if(i.ValueofCriterion.split(",").length>0&&i.ValueofCriterion.split(",").find(x=>x==i.CriterionsofAreasTree[j].CriterionofAreaCode))
       {
        this.saveRequiredValidations(i.CriterionsofAreasTree[j].CriterionsofAreasTree);
       }
   } 
  }
}
onConfirm() {
  this.messageService.clear('c');
}

onReject() {
  this.messageService.clear('c');
}

clear() {
  this.messageService.clear();
}
underline(eve)
{
  eve.srcElement.style.textDecoration = "underline";
}
ununderline(eve)
{
  eve.srcElement.style.textDecoration='';
}
goToBasicSearch()
{
  this.myrouter.navigate(['freeorbyrareaserach/prof']);
}
}

  
