import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit, HostListener } from '@angular/core';
import { AreaService } from 'src/app/Services/area.service';
import { SimpleObject } from 'src/app/Classes/SimpleObject';
import { GlobalService } from 'src/app/Services/global.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AreasTitlesService } from 'src/app/Services/areas-titles.service';
import { RequestService } from 'src/app/Services/request.service';
import { MatSelect } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Area } from 'src/app/Classes/Area';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/OtherPages/pending-changes';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.css']
})
export class BasicSearchComponent implements OnInit,AfterViewInit {

  ngAfterViewInit(): void {
    if(this.AreaServ.Allareas == null||this.AreaServ.Allareas.length ==0)
    this.AreaServ.getAreaswithoutSubscribe().subscribe(
      data=>{this.AreaServ.Allareas=data;
        this.areaslist = data.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1);
        this.ShowAreaTitles();
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
else
this.ShowAreaTitles();
  }

  constructor(private GlobalServ:GlobalService, private RequestServ:RequestService,
    private AreaServ:AreaService, private AreasTitlesServ:AreasTitlesService,
    private messageService: MessageService,
    private myrouter:Router) { }

  ngOnInit() {
    this.AreaServ.getAreaswithoutSubscribe().subscribe(
      data=>{this.AreaServ.Allareas=data;
        this.areaslist = data.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1);
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
   this.AreaCodeofQuickSearch =  this.RequestServ.Request.AreaCode;
   this.ChooseAreaForQuickSearch();
   this.AreaTitlesofQuickSearch = this.GlobalServ.Titles;
   this.GoogleSearchInput =  this.RequestServ.Request.Place;
   this.TravetTime =  this.RequestServ.Request.EmployTravelTime;
   if(this.Quick==true) 
   {
     this.RequestServ.GetFreeList().subscribe(
      data=> this.FreeList = data,
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
   }
  }
  @Input() Quick=false;
  @Input() Company=false;
  CompanyName='';
  @Output() CompToFather:EventEmitter<string>=new EventEmitter<string>();
  @Output() continue_event:EventEmitter<any>=new EventEmitter<any>();
  @ViewChild(MatSelect,{static:false}) AreaTitlesSelect: MatSelect;
  @ViewChild(MatSelect,{static:false}) AreasSelect: MatSelect;
  @ViewChild(MatSelect,{static:false}) AreaTitlesProfSelect: MatSelect;
  @ViewChild(MatSelect,{static:false}) Free: MatSelect;
  ShowProffesionalAreaTitles =false;
  AreaCode=0;
  AreaTitlesofProf=['']
  AreaTitlesofQuickSearch=['""']
  AreaTitlesProf = new FormControl();
  FreeText = new FormControl();
  FreeTextSearch = '';
  p_dialog_display=false;
  GoogleSearchInput="";
  AreaCodeofQuickSearch=0;
  TravetTime=0;
  TravetTimeToSsve=0;
  FreeSearchText="";
  Areas = new FormControl();
  AreaTitles = new FormControl();
  // רשימת תחומים לתצוגה
  areaslist:Array<Area>;
  // רשימת כותרות תחומים לתצוגה
  areastitleslist:Array<Area>;
  handleAddressChange(address:Address)
  {
    if(this.AreaServ.showAreas&&this.AreaServ.AreaSearch)
     this.RequestServ.Request.Place=address.formatted_address;
    this.GoogleSearchInput=address.formatted_address;
  }
  ShowAboutArea(Code:SimpleObject)
  {
    this.AreaCode=Code.Code;
  }
  AreaTitlesProfSelectOpen()
  {
   this.AreaTitlesProfSelect.open();
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
AreaTitlesSelectOpen(event = null)
{
  this.notshowMatSelect();
  if(event==null || event.target.tagName!='I')
  {
  this.areastitleslist =  this.AreasTitlesServ.AreasTitlesList.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1)
  this.AreaTitlesSelect.open();  
  }   
}
areaTtlesSelected()
{
  if(this.AreaTitlesofQuickSearch!=null&&this.AreaTitlesofQuickSearch[0]!='""'&&this.AreaTitlesofQuickSearch!=['""'])
    return 1;
  return 0;
}
ChooseAreaForQuickSearch(event = null)
{
this.notshowMatSelect();
if(event==null || event.target.tagName!='I')
{
  if(this.AreaServ.Allareas==null||this.AreaServ.Allareas.length == 0)
  this.AreaServ.getAreaswithoutSubscribe().subscribe(
    data=>{this.AreaServ.Allareas=data;
      this.areaslist = data.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1);
    },
    error=>console.log(error.message),
    ()=>console.log('finished')
  );
  else
   this.areaslist = this.AreaServ.Allareas.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1);
}
}
ShowAreaTitles()
{
  if(this.AreaCodeofQuickSearch!=undefined&&this.AreaCodeofQuickSearch!=0)
  {
    this.AreaServ.Area=this.AreaCodeofQuickSearch;
    this.AreaServ.FullArea=this.AreaServ.Allareas.find(x=>x.Code==this.AreaCodeofQuickSearch);
    this.AreasTitlesServ.getAreasTitles(this.AreaCodeofQuickSearch).
    subscribe(
      data=>{this.AreasTitlesServ.AreasTitlesList =data,
      this.areastitleslist = data.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1);
      if( this.AreaTitlesSelect)
        this.AreaTitlesSelect.open();
        this.AreaTitlesSelect.close();
    },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );  
  }
}
SaveTravelTime()
{
  debugger;
  this.p_dialog_display=false;
  if(this.AreaServ.showAreas&&this.AreaServ.AreaSearch)
    this.RequestServ.Request.EmployTravelTime=this.TravetTime;
   this.TravetTimeToSsve=this.TravetTime;
}
formatLabel(value: number) {
  if (value >= 1000) {
    return Math.round(value / 1000);
  }
  return value;
}
h()
{
  alert('hi')
}
SendToFather()
{
  this.GlobalServ.Titles = this.AreaTitlesofQuickSearch
    this.continue_event.emit([this.AreaCodeofQuickSearch, this.AreaTitlesofQuickSearch.toString(),
      this.GoogleSearchInput,this.TravetTimeToSsve,this.FreeSearchText]);  
}
  onKey1()
  {
    if(this.bankFilterCtrl.value !=null)
      this.areaslist = this.search(this.bankFilterCtrl.value);
  }
  
  search(value: string) { 
    let filter = value.toLowerCase();
    return this.AreaServ.Allareas.filter(option => option.Name.toLowerCase().startsWith(filter))
    .sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1);
  }
   
  onKeyTitles1() { 
    if(this.bankMultiFilterCtrl.value !=null)
      this.areastitleslist = this.searchTitles(this.bankMultiFilterCtrl.value);
    }
    
    searchTitles(value: string) { 
      let filter = value.toLowerCase();
      return this.AreasTitlesServ.AreasTitlesList.filter(option => option.Name.toLowerCase().startsWith(filter))
      .sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1);
    }

   /** control for the MatSelect filter keyword */
   public bankFilterCtrl: FormControl = new FormControl();


  /** control for the MatSelect filter keyword multi-selection */
 public bankMultiFilterCtrl: FormControl = new FormControl();

 CompanyToFather()
 {
   this.CompToFather.emit(this.CompanyName);
 }

 ClearAreaTitlesofQuickSearch()
 {
  this.AreaTitlesofQuickSearch =['""'];
 }
 ClearAreaCodeofQuickSearch()
 {
   this.AreaCodeofQuickSearch =0;
   this.AreaTitlesofQuickSearch =['""'];
 }
 FreeList = new Array<string>();
 FreeListSpecific = new Array<string>()
 matSelectShown = false;
 completeText()
 {
   if(this.FreeSearchText != '')
     this.Free.open();
  this.FreeListSpecific = this.FreeList.filter(x=>x.indexOf(this.FreeSearchText)>-1);
 }
 showMatSelect()
 {
  this.matSelectShown = true;
 }
 notshowMatSelect()
 {
  this.matSelectShown = false;
 }
}
