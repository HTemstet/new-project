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
import { ComponentCanDeactivate } from 'src/app/OtherPages/pending-changes';
import { Observable } from 'rxjs/Observable';
import { delay } from 'q';
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
  // שימוש ב interface canDeactivate של אנגולר
  // לצורך אזהרה בעת יציאה מהקומפוננטה בלי שמירת ערכי הקריטריונים
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
  //טופס לקריטריונים המשוייכים לכותרת מסויימת
  @ViewChild("CriterionsForm",{static:false}) CriterionsForm:NgForm;
  //קוד בקשה
  requestId:number=0;
  enableDeleteRequest=true;
  ngOnInit() 
  {
    this.enableDeleteRequest= +this.activatedRoute.snapshot.params["disabled"]==1?false:true;

    //בדיקת האם מדובר בהצעה קיימת  - כלומר - הגיעו לקומפוננטה זו דרך עדכון בקשה וע"כ נשלח גם קוד בקשה בניווט
  this.requestId= +this.activatedRoute.snapshot.params["id"];
  if(this.requestId!=0&&this.RequestServ.Request.RequestCode!=this.requestId)
  {
    //שליפת בקשה קיימת
    this.RequestServ.GetRequestByRequestId(this.requestId).subscribe(data=>{
      if(data==null)
      {
        this.finish=true;
        this.messageService.clear();
        this.messageService.add({key: 'a', severity:'error', summary:'שגיאה', detail:'המשרה אוישה וירדה ממאגר המשרות'});
        setTimeout(() => 
        {
           //ניווט לדף הראשי
           this.myrouter.navigateByUrl('freeorbyrareaserach');  
        },
       2000);
      }
      this.RequestServ.Request=data;
      this.AreaServ.Area=this.RequestServ.Request.AreaCode;
      this.AreaServ.getAreaswithoutSubscribe().subscribe(areas=>{
        this.AreaServ.FullArea=areas.find(a=>a.Code==this.RequestServ.Request.AreaCode)
      })
      //שליפת כותרות
      this.getTitles();
      //שליפת הקריטריונים לבקשה
      this.ChooseEmployeeFunc();
    });
  }
  else
  {
    //בקשה חדשה
  this.RequestServ.Request.CriterionsofRequests=new Array<CriterionsofAreas>(); 
  //שליפת כותרות
  this.getTitles();
  //שליפת הקריטריונים לבקשה
  this.ChooseEmployeeFunc();
  }
  } 
  ChooseEmployeeFunc()
    {
      //שליפת עץ הקריטריונים
      this.RequestServ.getAllCriterionsByArea().subscribe(
        data=>{
          //אם לא מדובר בבקשה קיימת - יש להכניס את הקריטריונים לבקשה החדשה
         if(this.RequestServ.Request.CriterionsofRequests.length == 0||
          this.RequestServ.Request.CriterionsofRequests[0].AreaCode!= this.AreaServ.FullArea.Code)
          this.RequestServ.Request.CriterionsofRequests=data;
          //המרת טיפוסי הקריטריונים ממסד הנתונים לסוג השדות להזנה
         this.TypesFunc();
         //התחלה מהבלוקים של הכותרת הראשונה
         this.ChooseTitle(this.TitlesList[0]);
        },
        error=>console.log(error.message),
        ()=>console.log('finished')
      );
    }
    //שליפת כותרות הקריטריונים ממסד הנתונים
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
              //אירוע בחירת כותרת ב p-step
          command: (event: any) => {
            this.activeIndex = this.TitlesList[i].Code-1;
            //שליפת הקריטריונים לכותרת שנבחרה
            this.ChooseTitle(this.TitlesList[i])
        }}  ); }
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
  }

  //בחירת כותרת לתצוגת בלוקי הקריטריונים השייכים אליה
  ChooseTitle(event:SimpleObject,validate=true)
  {
    //אם הטופס של הכותרת הקודמת שגוי - לא ניתן לעבור לכותרת אחרת
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
    //שמירת הכותרת שנבחרה
      this.Title=event;
      //סינון הקריטריונים השייכים לכותרת זו בלבד
      //הקריטריונים האלו בלבד ישמרו בטופס הנוכי
      //בדיקות התקינות יחולוו על הטופס ולא ניתן יהיה לעבור כותרת אם הוא שגוי
      this.CriterionsofAreaListSmall=this.RequestServ.Request.CriterionsofRequests
      .filter(x=>x.CriterionsTitleCode==event.Code); 
     if(this.CriterionsofAreaListSmall==null)
     this.CriterionsofAreaListSmall=new Array<CriterionsofAreas>();
     //שמירת בדיקת תקינות של קריטריוני חובה
     this.saveRequiredValidations(this.CriterionsofAreaListSmall);
  }
  changeIndex()
  {
    this.activeIndex++;
  }
    //טיפוסי שדוך הקריטריונים
    TypesFunc(List=this.RequestServ.Request.CriterionsofRequests)
    {
      for(let i=0;i<List.length;i++)
      {
   // הערה: אם בכל מקרה עושים המרה ל enum  בשרת,
   // עדיף כבר להחזיר רק את ערכי האינום בלי טיפוס מספרי 
   switch(List[i].CriterionsType)
   {
     //רשימה
    case 0: List[i].TypeEnum=this.EnumTypes.List;;break;
    //מספר
    case 1: List[i].TypeEnum=this.EnumTypes.Number;break;
    //שדה בוליאני
    case 2: List[i].TypeEnum=this.EnumTypes.Boolean;break;
    //תאריך
    case 3: List[i].TypeEnum=this.EnumTypes.Date;break;
    //שעה
    case 4: List[i].TypeEnum=this.EnumTypes.Hour;break;
    //חלק מרשימה
    case 5: List[i].TypeEnum=this.EnumTypes.PartOfaList;break;
   }
   if(List[i].CriterionsofAreasTree.length>0) 
   //פניה רקורסיבית לשמירת טיפוסי שדות הקריטריונים התלויים
   this.TypesFunc(List[i].CriterionsofAreasTree) 
      }
    }
    
  //שמירת הבקשה לעובד
  OkFunc()
  {
    this.SendingJobOffers=false;
    //הפניה לקומפוננטת כניסה במידה והמשתמש לא רשום
    if(this.PeopleServ.surf.Code==0&&this.rightChoice!=1)
      this.SendEmailRadioChangeevent();
      //שמירת סטטוס קבלת הצעות לעובד
   else{
     //רק באתר
    if(this.rightChoice==1)
    {
      this.RequestServ.Request.SendingJobOffersOnceaDay=false;
      this.RequestServ.Request.SendingJobOffersWheneverThereIsaSuitableOffer=false;
    }
    //פעם ביום
    else if(this.rightChoice==2)
    {
      this.RequestServ.Request.SendingJobOffersWheneverThereIsaSuitableOffer=false;
      this.RequestServ.Request.SendingJobOffersOnceaDay=true;
    }
    //כל פעם שישנה הצעה מתאימה
    else
      {
        this.RequestServ.Request.SendingJobOffersWheneverThereIsaSuitableOffer=true;
        this.RequestServ.Request.SendingJobOffersOnceaDay=false;
      }
      //אם מדובר בבקשה חדשה
      if(this.requestId==0)
      //שמירת הבקשה
      this.RequestServ.Request.RequestCode=this.requestId
    this.RequestServ.sendRequest().subscribe(
      data=>{
        this.modelV=true;
        this.RequestServ.JobOffers=data;
        if(this.RequestServ.JobOffers.length>0)
        {
          //ניווט לקומפוננטת הצעות העבודה
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
  // סיום הזנת ערכי הקריטיונים:
  //שמירת הבקשה למעסיק  או בעת עדכון בקשה קיימת
  //פתיחת חלון תדירות שליחת הצעות לעובד
  model()
  {
    //שמירת הבקשה למעסיק
    if(this.RequestServ.Request.Employee==false)
    {
      this.RequestServ.Request.SendingJobOffersOnceaDay=false;
      this.RequestServ.Request.SendingJobOffersWheneverThereIsaSuitableOffer=false;
      //שמירת הבקשה
      this.RequestServ.Request.RequestCode=this.requestId
      this.RequestServ.sendRequest().subscribe(
      data=>{
        
          this.modelV=true;
          //למעסיק לא תהיה הפניה להצעות מתאימות
          //מועמדים רלוונטיים יצרו איתו קשר באמתעות המייל
          this.modelVText = 'מועמדים רלוונטיים יצרו איתך קשר';
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
    }
    else
    {
   //בקשה חדשה - פתיחת חלון סטטוס שליחת הצעות עבודה
            if(this.requestId==0)
                this.SendingJobOffers=true;
                //עדכון בקשה קיימת
            else{
              this.RequestServ.Request.RequestCode=this.requestId
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
  //מעבר לבלוקי הקריטריונים של הכותרת הקודמת
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
  //מעבר לבלוקי הקריטריונים של הכותרת הבאה
  Next(e:any)
  {
    //אם הטופס של הכותרת הנוכחית לא תקין
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
      //אם הטופס תקין
      //מעבר לכותרת הבאה
        if(this.activeIndex!=this.TitlesList[this.TitlesList.length-1].Code-1)
        {
          //מעבר לאינדקס הכותרת הבאה
          this.changeIndex();
          //בחירת הכותרת הבאה
          this.ChooseTitle(this.TitlesList[this.activeIndex]);
        }
        //אם מדובר בכותרת האחרונה
        else
          e.disabled ="disabled";
  }
//מחיקת בקשה, עם הקריטריונים שלה
removeRequest()
{
  this.RequestServ.deleteRequest(this.requestId).subscribe(data=>{ 
   this.messageService.add({severity:'success', summary: 'אישור', detail:'הבקשה נמחקה בהצלחה'});
    setTimeout( () => { 
      this.finish=true;
      //ניווט לדף הראשי
      this.myrouter.navigateByUrl('freeorbyrareaserach');
    }, 3000 );
  })
}
//אם התרחשה שגיאה בקומפוננטת הקריטריונים - זורקים את השגיאה לכאן, ומדווחים על טופס שגוי
InValid(i:CriterionsofAreas)
{
  if(!this.FormValidations.find(x=>x==i))
  {
    //שמירת הקריטריון שנזרק ברשימת הקריטריונים השגויים
    this.FormValidations.push(i);
  }
}
//אם התבטלה השגיאה בקומפוננטת הקריטריונים - זורקים את ההודעה לכאן ומדווחים על תקינות הקריטריון
Valid(i:CriterionsofAreas)
{
 if(this.FormValidations.find(x=>x==i))
 //מחיקת הקריטריון מרשימת הקריוריונים השגויים
  this.FormValidations=this.FormValidations.filter(x=>x!=i);
  if(i.TypeEnum==TypesEnum.List)
  { 
   for(let j=0;j<i.CriterionsofAreasTree.length;j++)
   {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
     if(i.ValueofCriterion!=null&&i.ValueofCriterion.length)
      if(i.ValueofCriterion.split(",").length>0&&i.ValueofCriterion.split(",").
      find(x=>x==i.CriterionsofAreasTree[j].CriterionofAreaCode))
       {
         //שמירת קריטריון חובה - אפילו אם עדיין לא נגגעו בשדה
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
updateEmailsStatus()
{
  this.SendingJobOffers=true;
}
cancel()
{
  this.myrouter.navigate(['freeorbyrareaserach']);
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

}

  
