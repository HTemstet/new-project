import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/Services/request.service';
import { Router } from '@angular/router';
import { JobOffersService } from 'src/app/Services/job-offers.service';
import { JobOfferEmail } from 'src/app/Classes/JobOfferEmail';
import { AreaService } from 'src/app/Services/area.service';
import { PeopleService } from 'src/app/Services/people.service';
import { GlobalService } from 'src/app/Services/global.service';
import { ValidationService } from 'src/app/Services/validation.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.css']
})
export class JobOffersComponent implements OnInit {
  constructor(private RequestServ:RequestService,
    private GlobalServ:GlobalService,
    private ValidationServ:ValidationService,
    private PeopleServ:PeopleService,
    private AreaServ:AreaService,
    private JobOffersServ:JobOffersService
    ,private myrouter:Router) { }

  ngOnInit() {

   if(document.location.href.indexOf('?')!=-1)
   {
    const httpParams = new HttpParams({ fromString: document.location.href.split('?')[1] });
    this.RequestServ.GetRequestByCode(+httpParams.get('JobID')).subscribe(
    data=>{
      if(data!=null)
      {
         this.RequestServ.JobOffers = data;
         this.adjustmentForHagasha();
         if(this.AreaServ.FullArea.Code==0)
         {
           this.AreaServ.getAreaswithoutSubscribe().subscribe(areas_data=>
             {
               this.AreaServ.Allareas=areas_data;
               this.AreaServ.FullArea=this.AreaServ.Allareas.find(a=>a.Code==data[0].AreaCode);
             })
         }
      }
      else
       alert('המשרה אוישה וירדה ממאגר המשרות')
    },
    error=>console.log(error.message),
    ()=>console.log('finished')
  );
   }
   this.adjustmentForHagasha();
  }
  adjustmentForHagasha()
  {
    let percent=75;
    if(this.RequestServ.JobOffers!=null&&this.RequestServ.JobOffers.length>0)
    {
      this.RequestServ.JobOffers.forEach(j=>{
        j.AdjustmentPercentages=percent;
        percent-=4;
      })
    }
  }
    //#region משתני עזר לקו"ח וכו'
    ind='';
    ShowCV=false
    CV='';
    ContactDetails=false;
    PreliminaryLetter='';

//  
ShowAboutMe=false;
step = 0;
setStep(index: number) {
  this.step = index;
}

nextStep() {
  this.step++;
}

prevStep() {
  this.step--;
}
OpenCriterions(requestId)
{
  this.myrouter.navigateByUrl('/enter', {skipLocationChange: true}).then(()=>
  this.myrouter.navigate(["/basicsearch/request/"+requestId+'/'+1]));

}
SendOfferEmail()
{
  if(this.PeopleServ.surf.Code==0)
  {
    this.PeopleServ.backtojoboffers=true;
    this.GlobalServ.display = true;
    this.ValidationServ.sendingTempPass=false;
  }
  else 
  {
    this.ContactDetails=true;
  }
}
SendEmail(RequestCode:number,Email:string)
{
  let jobofferemail=  new JobOfferEmail(Email,this.PreliminaryLetter,this.CV);
  this.JobOffersServ.SendOfferEmail(RequestCode,jobofferemail).subscribe(
    data=>{
      console.log('data',data);
      alert('נשלח בהצלחה!');
    },
    error=>console.log(error.message),
    ()=>console.log('finished')
  );
}
ContactanOffer(RequestCode:number,Email:string,AreaCode)
{
  if(this.AreaServ.FullArea==undefined)
   this.AreaServ.getAreaswithoutSubscribe().subscribe(
    data=>{this.AreaServ.Allareas=data,
    this.AreaServ.FullArea =this.AreaServ.Allareas.find(x=>x.Code==AreaCode),
    this.SendEmail(RequestCode,Email)},
    error=>console.log(error.message),
    ()=>console.log('finished')
  );
  else
    this.SendEmail(RequestCode,Email);
}
GetCV()
{
   this.PeopleServ.getCV().subscribe(
   data=>{this.CV=data;
   this.ShowCV=!this.ShowCV
   this.ShowAboutMe=false},
   error=>console.log(console.log(error.message)),
  ()=>console.log('finished')
  );
}
GetProphilBySwitch(Text:string)
{
this.GetCV()
}
RemoveFile(FolderName:string)
{
this.PeopleServ.RemoveFile(FolderName).subscribe(
 data=>{alert('הקובץ נמחק בהצלחה');this.GetProphilBySwitch(FolderName)},
 error=>console.log(console.log(error.message)),
()=>console.log('finished')
);
}
FileList:FileList;
 fileName='';
 fileChange(event)
 {
   this.FileList=event.target.files;
 }
 CancelationChangeFile()
 {
   this.FileList=null;
 }
 SentToPlacing(FolderName:string)
 {
   if(this.FileList!=null&&this.FileList.length>0)
   {
     let File:File=this.FileList[0];
     this.fileName=File.name;
     this.PeopleServ.Placing(File,FolderName).subscribe(
       data=>{
        //  alert(FolderName)
         this.GetProphilBySwitch(FolderName)
       },
       error=>console.log(console.log(error.message)),
      ()=>console.log('finished')
   );
   }
 }
 ShowAbout(){
   this.ShowCV=false;
   this.ShowAboutMe=!this.ShowAboutMe;
 }
}
