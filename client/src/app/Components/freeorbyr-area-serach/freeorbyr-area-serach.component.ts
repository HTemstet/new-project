  import { Component, OnInit, ViewChild, Input } from '@angular/core';
  import { SimpleObject } from 'src/app/Classes/SimpleObject';
  import { AreaService } from 'src/app/Services/area.service';
  import { GlobalService } from 'src/app/Services/global.service';
  import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { AreasTitlesService } from 'src/app/Services/areas-titles.service';
import { RequestService } from 'src/app/Services/request.service';
import { Area } from 'src/app/Classes/Area';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { MatSelect } from '@angular/material/select';
  
  @Component({
    selector: 'app-freeorbyr-area-serach',
    templateUrl: './freeorbyr-area-serach.component.html',
    styleUrls: ['./freeorbyr-area-serach.component.css']
  })
  export class FreeorbyrAreaSerachComponent implements OnInit {
    @ViewChild(MatSelect,{static:false}) AreaTitlesSelect: MatSelect;
    @ViewChild(MatSelect,{static:false}) AreaTitlesProfSelect: MatSelect;
    @Input() ProfSearch = false;
    p_dialog_display=false;
    //#region תחום
     AreaCodeofQuickSearch=0;
     Areas = new FormControl();
    //#endregion
     //#region בחירת תפקיד    
    AreaTitles = new FormControl();
    AreaTitlesofQuickSearch=['""']

    ShowProffesionalAreaTitles =false;
    AreaTitlesProf = new FormControl();
    AreaTitlesofProf=['']
    //#endregion
   //#region בחירת מיקום
        GoogleSearchInput="";
   //#endregion
   //#region בחירת זמן נסיעה רצוי
    TravetTime=0;
    TravetTimeToSsve=0;
    //#endregion
    //#region טקסט לחיפוש חופשי
    FreeSearchText=""
    //#endregion
    constructor(private GlobalServ:GlobalService, private RequestServ:RequestService,
      private AreaServ:AreaService, private AreasTitlesServ:AreasTitlesService,
      private messageService: MessageService,
      private myrouter:Router) { }
  
    ngOnInit() {
      this.AreaServ.showAreas=false;
      this.AreaServ.AreaSearch=false;
      this.GlobalServ.showTitle=false;
      if(window.location.href.indexOf('prof')>-1)
      {
      this.AreaServ.showAreas = true;
      this.AreaServ.AreaSearch = true;
      }
    }
    AreaCode=0;
    //#region חיפוש עפ"י חברה
    SearchByCompany=false;
    //#endregion
    SearchType(val:boolean)
    {
      if(val==true)  
        this.RequestServ.Request.Employee =true;
      if(val==null)
      {
        val=false;
        this.SearchByCompany=true;
      }
      else
        this.SearchByCompany=false; 
      this.AreaServ.showAreas=val;
      this.AreaServ.AreaSearch=val;
    }
    ShowAboutArea(Code:SimpleObject)
  {
    this.AreaCode=Code.Code;
  }
  ChooseArea()
  {
    if(this.AreaCode==0)
      //this.AreaServ.Area=1;
        this.messageService.add({severity:'error',summary:'אופס', detail:'רגע רגע, שכחת לבחור תחום'});
    else  
    {
    this.AreaServ.Area=this.AreaCode;
    this.AreaServ.FullArea=this.AreaServ.Allareas.find(x=>x.Code==this.AreaCode);
    this.GlobalServ.OccuredArea=true;
    this.RequestServ.Request.AreaCode=this.AreaCode;
    this.AreasTitlesServ.getAreasTitles(this.AreaCode).
    subscribe(
      data=>this.AreasTitlesServ.AreasTitlesList =data,
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
    this.ShowProffesionalAreaTitles =true;
    }
  }
  SaveAreaTitlesProf()
  {
    this.RequestServ.Request.AreaTitles=this.AreaTitlesofProf.toString();
    this.myrouter.navigateByUrl('/enter', {skipLocationChange: true}).then(()=>
    this.myrouter.navigate(["request"]));
    this.AreaServ.FullArea=this.AreaServ.Allareas.find(x=>x.Code==this.AreaServ.Area);
  }
  popUpTravelTime()
  {
    this.p_dialog_display=true;
  }
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000);
    }
    return value;
  }
  handleAddressChange(address:Address)
  {
    if(this.AreaServ.showAreas&&this.AreaServ.AreaSearch)
     this.RequestServ.Request.Place=address.formatted_address;
    else
    this.GoogleSearchInput=address.formatted_address;
  }
  SaveTravelTime()
  {
    this.p_dialog_display=false;
    if(this.AreaServ.showAreas&&this.AreaServ.AreaSearch)
      this.RequestServ.Request.EmployTravelTime=this.TravetTime;
   else
     this.TravetTimeToSsve=this.TravetTime;
  }
  ChooseAreaForQuickSearch()
  {
    this.AreaServ.getAreas();
  }
  AreaTitlesSelectOpen()
  {
   this.AreaTitlesSelect.open();
  }
  AreaTitlesProfSelectOpen()
  {
   this.AreaTitlesProfSelect.open();
  }
  ShowAreaTitles()
  {
    this.AreaServ.Area=this.AreaCodeofQuickSearch;
    this.AreaServ.FullArea=this.AreaServ.Allareas.find(x=>x.Code==this.AreaCodeofQuickSearch);
    this.AreasTitlesServ.getAreasTitles(this.AreaCodeofQuickSearch).
    subscribe(
      data=>this.AreasTitlesServ.AreasTitlesList =data,
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
  }
  QuickSearch(e:Array<any>)
  {
    if(e[0]==0)
    //this.AreaServ.Area=1;
      this.messageService.add({severity:'error',summary:'אופס', detail:'רגע רגע, שכחת לבחור תחום'});
    else{
  // this.RequestServ.QuickSearch(this.AreaCodeofQuickSearch, this.AreaTitlesofQuickSearch.toString(),
  //   this.GoogleSearchInput,this.TravetTimeToSsve,this.FreeSearchText).subscribe(
    this.RequestServ.QuickSearch(e[0], e[1],
    e[2],e[3],e[4]).subscribe(

    data=>{
      console.log('data',data);
      this.RequestServ.JobOffers=data;
      if(this.RequestServ.JobOffers.length>0)
        this.myrouter.navigate(['joboffers']);
      else
        alert('תוצאות החיפוש המהיר לא הניבו תוצאות, נסה למקד את החיפוש באמצעות חיפוש מקצועי')
   },
    error=>console.log(error.message),
    ()=>console.log('finished')
  );
}
  }
  SearchWithCompany(CompanyName:string)
  {
    if(CompanyName!=null&&CompanyName!='')
  this.RequestServ.CompanySearch(CompanyName).subscribe(
    data=>{
      console.log('data',data);
      this.RequestServ.JobOffers=data;
      if(this.RequestServ.JobOffers.length>0)
        this.myrouter.navigate(['joboffers']);
      else
        alert('לחברה זו אין כרגע משרות מתאימות')
   },
    error=>console.log(error.message),
    ()=>console.log('finished')
  );
  }
  goToRequest = false;
  basicSearchClick(e:any)
  {
    if(e[0]==0||e[0]==undefined||e[0]==null)
    {
      this.messageService.add({severity:'error',summary:'אופס', detail:'רגע רגע, שכחת לבחור תחום'});
    }
    else
      if(e[1]==['""']||e[1]==null||e[1][0]=='""')
    {
      this.messageService.add({severity:'error',summary:'אופס', detail:'רגע רגע, שכחת לבחור תפקיד/ים'});
    }
    else
    {
      console.log('e: ',e)
      if(this.AreaServ.showAreas&&this.AreaServ.AreaSearch)
      {
       this.RequestServ.Request.AreaCode=e[0];
       this.RequestServ.Request.AreaTitles=e[1];
       this.RequestServ.Request.Place=e[2];
       this.RequestServ.Request.EmployTravelTime=e[3];
       this.goToRequest = true;   
       this.myrouter.navigateByUrl('/enter', {skipLocationChange: true}).then(()=>
       this.myrouter.navigate(["/basicsearch/request"]));
       this.AreaServ.FullArea=this.AreaServ.Allareas.find(x=>x.Code==this.AreaServ.Area);
      }
      else
      {
       this.QuickSearch(e);
      }
    } 
  }
}
