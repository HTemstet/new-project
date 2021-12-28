import { Component, OnInit, ViewChild } from '@angular/core';
import { ValidationService } from 'src/app/Services/validation.service';
import { RequestService } from 'src/app/Services/request.service';
import { AreaService } from 'src/app/Services/area.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { SimpleObject } from 'src/app/Classes/SimpleObject';
import {OfferDetails} from 'src/app/Classes/OfferDetails'
import { MatSelect } from '@angular/material/select';
import { AreasTitlesService } from 'src/app/Services/areas-titles.service';
import { FormControl, AbstractControl } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';import { Area } from 'src/app/Classes/Area';
@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  Continue=false;
  p_dialog_display=false;
  TravetTime=0;
  ShowAreas=true;
  ShowEmployDetails=false;
  AreaCode=0;
  //#region בחירת תפקידים לתחום
  @ViewChild(MatSelect,{static:false}) AreaTitlesSelect: MatSelect;
  AreaTitlesToShow=false;
  Areas = new FormControl();
  AreaTitles = new FormControl();
  //#endregion
  constructor( private ValidationServ:ValidationService, private AreaServ:AreaService,
     private GlobalServ:GlobalService,private AreasTitlesServ:AreasTitlesService,
    private RequestServ:RequestService,private messageService: MessageService,private myrouter:Router) { }

  ngOnInit() {
    this.AreaServ.getAreaswithoutSubscribe().subscribe(
      data=>{this.AreaServ.Allareas=data;
        this.areaslist = data.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1);
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
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
      this.AreasTitlesServ.getAreasTitles(this.AreaCode).
      subscribe(
        data=>{this.AreasTitlesServ.AreasTitlesList =data
        this.areastitleslist = data.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1)},
        error=>console.log(error.message),
        ()=>console.log('finished')
      );
    this.ShowEmployDetails=true;
    this.AreaTitlesToShow=true;
    }
  }
  AreaTitlesSelectOpen(event = null)
  {
    if(event==null || event.target.tagName!='I')
    {
    if(this.AreaCodeofQuickSearch == null||this.AreaCodeofQuickSearch == undefined||this.AreaCodeofQuickSearch == 0)
      this.AreaTitlesSelect.open();
    this.areastitleslist =  this.AreasTitlesServ.AreasTitlesList.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1)
    }
  }
  popUpTravelTime()
  {
    this.p_dialog_display=true;
  }
  handleAddressChange(address:Address)
  {
    this.RequestServ.Request.Place=address.formatted_address;
  }
  SaveTravelTime()
  {
    this.p_dialog_display=false;
    this.RequestServ.Request.EmployTravelTime=this.TravetTime;
  }
placefocus(ev:any)
{
  if(ev.srcElement.value=="")
    ev.srcElement.placeholder = 'הזן מיקום'
}
placeblur(ev:any)
{
  ev.srcElement.placeholder = ''
}
  OfferDetails =new OfferDetails();
  ShowRequiredFeilds()
  {
 for(let i =0 ;i<document.getElementsByClassName('required').length;i++)
 if( document.getElementsByClassName('required')[i].getAttribute("value")==''||document.getElementsByClassName('required')[i].getAttribute("value")==''['""'])  
  document.getElementsByClassName('required')[i].setAttribute("style",document.getElementsByClassName('required')[i].getAttribute("style")+";border-color: red")
}
ReqFeilds(eve:any,AreaTitles = false)
{
  if(AreaTitles &&(this.AreaTitlesofQuickSearch!=null&&this.AreaTitlesofQuickSearch!=['""']))
  {
    if(eve.style!=null)
    eve.style.borderColor = 'black';
    else
     eve.srcElement.style.borderColor = 'black';
  }
 else
   if(!AreaTitles)
   {
    if(eve.style!=null)
    eve.style.borderColor = 'black';
    else
     eve.srcElement.style.borderColor = 'black';
   }
}
  OkFunc()
  {
    if(this.AreaCodeofQuickSearch == null||this.AreaCodeofQuickSearch==undefined||this.AreaCodeofQuickSearch==0)
    {
      this.messageService.add({severity:'error',summary:'אופס', detail:'רגע רגע, שכחת לבחור תחום'});
    }
    else if(this.AreaTitlesofQuickSearch==null||this.AreaTitlesofQuickSearch[0]=='""'||this.AreaTitlesofQuickSearch ==['""'])
    {
      this.messageService.add({severity:'error',summary:'אופס', detail:'רגע רגע, שכחת לבחור תפקיד/ים'});
    }
    else{
      this.RequestServ.RequestOfferDetails=this.OfferDetails;
      this.RequestServ.Request.Employee=false;
      this.GlobalServ.OccuredArea=true;
      // this.Continue=true;
      this.RequestServ.Request.AreaCode = this.AreaCodeofQuickSearch;
      this.OfferDetails.AreaCode=this.AreaCodeofQuickSearch;
      this.RequestServ.Request.AreaTitles=this.AreaTitlesofQuickSearch == null? ['""']: this.AreaTitlesofQuickSearch.toString();
      this.myrouter.navigateByUrl('/enter', {skipLocationChange: true}).then(()=>
      this.myrouter.navigate(["basicsearch/request/0"]));
      this.AreaServ.FullArea=this.AreaServ.Allareas.find(x=>x.Code==this.AreaServ.Area);  
    }
  }
  AreaCodeofQuickSearch=null;
  AreaTitlesofQuickSearch=null;
  ShowAreaTitles()
  {
    this.AreaServ.Area=this.AreaCodeofQuickSearch;
    this.AreaServ.FullArea=this.AreaServ.Allareas.find(x=>x.Code==this.AreaCodeofQuickSearch);
    this.AreasTitlesServ.getAreasTitles(this.AreaCodeofQuickSearch).
    subscribe(
      data=>{this.AreasTitlesServ.AreasTitlesList =data;
        this.areastitleslist = data.sort((a, b) => a.Name > b.Name ? 1 : a.Name === b.Name ? 0 : -1)
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
  }
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000);
    }
    return value;
  }

  // רשימת תחומים לתצוגה
  areaslist:Array<Area>;
  // רשימת כותרות תחומים לתצוגה
  areastitleslist:Array<Area>;
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
 ClearAreaTitlesofQuickSearch()
 {
   ;
  this.AreaTitlesofQuickSearch =['""'];
 }
 ClearAreaCodeofQuickSearch()
 {
   this.AreaCodeofQuickSearch =0;
   ;
   this.AreaTitlesofQuickSearch =['""'];
 }
areaTtlesSelected()
{
  if(this.AreaTitlesofQuickSearch!=null&&this.AreaTitlesofQuickSearch[0]!='""'&&this.AreaTitlesofQuickSearch!=['""'])
    return 1;
  return 0;
}
}
