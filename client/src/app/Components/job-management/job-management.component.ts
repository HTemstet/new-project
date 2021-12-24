import { Component, OnInit,ViewChildren, QueryList, ElementRef} from '@angular/core';
import { JobManagementService } from 'src/app/Services/job-management.service';
import { PeopleService } from 'src/app/Services/people.service';
import { JobsAppliedFor } from 'src/app/Classes/JobsAppliedFor';
import { AreaService } from 'src/app/Services/area.service';
import { RequestService } from 'src/app/Services/request.service';
import { myRequest } from 'src/app/Classes/myRequest';
import { Router} from '@angular/router';
@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
export class JobManagementComponent implements OnInit {

  constructor(private AreaServ:AreaService,private RequestServ:RequestService,private myrouter:Router, 
    private JobManagementServ:JobManagementService,private PeopleServ:PeopleService) { }
  appliedJobsList = new Array<JobsAppliedFor>();
  searchesList = new Array<myRequest>();
  ngOnInit() {
 
}
searches = false;
searchesManager()
{ 
  this.step = 0;
   this.searches =true;
   this.RequestServ.GetRequestsByPeople(true).subscribe(
    data=>
   {
    this.searchesList = data;
   },
    error=>console.log(console.log(error.message)),
   ()=>console.log('finished')
   ); 
}
appliedJobsManager()
{
  this.step = 0;
  this.searches =false;
  this.JobManagementServ.getJobsAppliedbyPeople(this.PeopleServ.surf.Code).subscribe(
    data=>
   {
    this.appliedJobsList = data;
   },
    error=>console.log(console.log(error.message)),
   ()=>console.log('finished')
   ); 
}
// טיפול בקורות חים של עובד
  //#region משתני עזר לקו"ח וכו'
  ind='';
  ShowCV=false
  CV='';
  //#endregion
  GetCV()
  {
     this.PeopleServ.getCV().subscribe(
     data=>{this.CV=data;
     this.ShowCV=true},
     error=>console.log(console.log(error.message)),
    ()=>console.log('finished')
    );
  }
  GetProphilBySwitch()
  {
  this.GetCV()
  }
RemoveFile(FolderName:string)
 {
this.PeopleServ.RemoveFile(FolderName).subscribe(
  data=>{alert('הקובץ נמחק בהצלחה');this.GetProphilBySwitch()},
  error=>console.log(console.log(error.message)),
 ()=>console.log('finished')
 );
 }
 @ViewChildren("fileInput") fileInput: QueryList<ElementRef>;
 FileList:FileList;
  fileName='';
  fileChange(event)
  {
    this.FileList=event.target.files;
  }
  CancelationChangeFile()
  {
    this.FileList=null;
    this.fileInput.first.nativeElement.value = '';
  }
  SentToPlacing(FolderName:string)
  {
    debugger;
    if(this.FileList!=null&&this.FileList.length>0)
    {
      let File:File=this.FileList[0];
      this.fileName=File.name;
      this.PeopleServ.Placing(File,FolderName).subscribe(
        data=>{
          alert(FolderName)
          this.GetProphilBySwitch()
          this.FileList=null;
          this.fileInput.first.nativeElement.value = '';
        },
        error=>console.log(console.log(error.message)),
       ()=>console.log('finished')
    );
    }
  }
gettingOffersFrequency(i:myRequest)
{
if(i.SendingJobOffersOnceaDay)
  return 'אחת ליום';
if(i.SendingJobOffersWheneverThereIsaSuitableOffer)
  return 'בכל פעם שישנה משרה מתאימה';
else
  return 'צפיה בהצעות באתר בלבד';
}
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
getAreaNameByCode(AreaCode:number)
{
 return this.AreaServ.Allareas.find(x=>x.Code==AreaCode).Name;
}
}
