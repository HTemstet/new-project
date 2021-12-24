import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { PeopleService } from 'src/app/Services/people.service';
import { ValidationService } from 'src/app/Services/validation.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { myRequest } from 'src/app/Classes/myRequest';
import { RequestService } from 'src/app/Services/request.service';
import { AreaService } from 'src/app/Services/area.service';

@Component({
  selector: 'app-about-business',
  templateUrl: './about-business.component.html',
  styleUrls: ['./about-business.component.css']
})
export class AboutBusinessComponent implements OnInit {

  constructor(private PeopleServ:PeopleService,private RequestServ:RequestService,private AreaServ:AreaService, private ValidationServ:ValidationService,
    private messageService: MessageService,private myrouter:Router) { }

  ngOnInit() {
  }
  searchesList = new Array<myRequest>();
  aboutbusiness = true;
searchesManager()
{ 
  this.aboutbusiness = false;
   this.RequestServ.GetRequestsByPeople(false).subscribe(
    data=>
   {
    this.searchesList = data;
   },
    error=>console.log(console.log(error.message)),
   ()=>console.log('finished')
   ); 
}
myBusiness()
{
  this.aboutbusiness = true;
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
      //#region משתני עזר ללוגו והמלצות'
      ind='';
      ShowLogo=false
      Logo='';
      AboutBusiness=this.PeopleServ.surf.About;
      SiteLink=this.PeopleServ.surf.SiteLink;
      //#endregion
  GetLogo()
 {
  this.PeopleServ.getLogo().subscribe(
  data=>{this.Logo=data;
  this.ShowLogo=true},
  error=>console.log(console.log(error.message)),
 ()=>console.log('finished')
 );
 }
 GetProphilBySwitch()
 {
 this.GetLogo();
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
          this.GetProphilBySwitch();
          this.FileList =null;
          this.fileInput.first.nativeElement.value = '';
        },
        error=>console.log(console.log(error.message)),
       ()=>console.log('finished')
    );
    }
  }
  urlfocus(ev:any)
{
  if(ev.srcElement.value=="")
    ev.srcElement.placeholder = 'צרף קישור כאן'
}
urlblur(ev:any)
{
  ev.srcElement.placeholder = ''
}
  OkFunc()
  {
    this.PeopleServ.surf.SiteLink=this.SiteLink;
    this.PeopleServ.surf.About=this.AboutBusiness;
    this.PeopleServ.SaveSiteLinkandAbout().subscribe(
    data=>{   
      this.messageService.add({severity:'success',summary:'עדכון בוצע', detail:'JOBBA הפרטים נשמרו, תודה שבחרת'});
    },
    error=>console.log(console.log(error.message)),
   ()=>console.log('finished')
   );
  }
  Navigatetoaboutemployer()
  {
    this.myrouter.navigate(["/aboutemployer"]);   
  }
}
