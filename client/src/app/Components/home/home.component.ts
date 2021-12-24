import { Component, OnInit} from '@angular/core';
import { Router, RouterModule, ROUTES, NavigationEnd, NavigationStart } from '@angular/router';
import { AreaService } from 'src/app/Services/area.service';
import { GlobalService } from 'src/app/Services/global.service';
import { ValidationService } from 'src/app/Services/validation.service';
import { RequestService } from 'src/app/Services/request.service';
import { PeopleService } from 'src/app/Services/people.service';
import { People } from 'src/app/Classes/People';
import {MessageService} from 'primeng/api';
import { myRequest } from 'src/app/Classes/myRequest';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  AreaCode=0;
  AreaSearch=null;
  LogosList =new Array<any>();
  LogosRandom = false;
  constructor(private GlobalServ:GlobalService, private messageService:MessageService,
    private AreaServ:AreaService,private PeopleServ:PeopleService,
    private ValidationServ:ValidationService, private RequestServ:RequestService ,private myrouter:Router) { }
    ngOnInit() {
    // RouterModule.forRoot(ROUTES,{ useHash: true })
    this.AreaServ.getAreas();
    this.dispalyAreaselect();
    this.getLogosAndSites();
  }  
  initRequest()
  {
    this.RequestServ.Request = new myRequest();
  } 
  onRejectb() {
    this.messageService.clear('b');
  }
  getLogosAndSites()
  {
    this.PeopleServ.GetLogosAndSites().subscribe(
      data=>{
        this.LogosRandom=true;
        this.LogosList= new Array<any>();
        console.log(data);
        for (let k in data) 
        {
          let obj={};
          obj[k]= data[k];
          this.LogosList.push(obj);
        }
      },
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
  }  
  GoToSite(url:string)
  {
    if(url!=null&& url!='')
      window.open(url)
  }
enter()
{
  this.GlobalServ.display = true;
  this.ValidationServ.sendingTempPass=false;
  this.myrouter.navigateByUrl('freeorbyrareaserach', {skipLocationChange: true}).then(()=>
  this.myrouter.navigate(["/enter"])); 
}
newUser()
{
  this.ValidationServ.knownPeople=false;
  this.myrouter.navigateByUrl('freeorbyrareaserach', {skipLocationChange: true}).then(()=>
  this.myrouter.navigate(["/validation"]));  
}
aboutEmployee()
{
  if(this.PeopleServ.surf.Code==0)
  {
    this.PeopleServ.backtojobmanagement=true;
    this.GlobalServ.display = true;
    this.ValidationServ.sendingTempPass=false;
    this.myrouter.navigateByUrl('freeorbyrareaserach', {skipLocationChange: true}).then(()=>
    this.myrouter.navigate(["/enter"])); 
  }
  else
  {
    this.RequestServ.Request.Employee=true;
    this.myrouter.navigateByUrl('freeorbyrareaserach', {skipLocationChange: true}).then(()=>
    this.myrouter.navigate(["/jobmanagement"]));  
  }
}
aboutEmployer()
{
  if(this.PeopleServ.surf.Code==0)
  {
    this.PeopleServ.backtoemployer=true;
    this.GlobalServ.display = true;
    this.ValidationServ.sendingTempPass=false;
    this.myrouter.navigateByUrl('freeorbyrareaserach', {skipLocationChange: true}).then(()=>
    this.myrouter.navigate(["/enter"])); 
  }
  else
  {
    this.RequestServ.Request.Employee=false;
    this.myrouter.navigateByUrl('freeorbyrareaserach', {skipLocationChange: true}).then(()=>
    this.myrouter.navigate(["/aboutemployer"]));  
  }
}
dispalyAreaselect(click=false)
{
  debugger;
  this.RequestServ.Request.Employee=true;
  if(window.location.href=="http://localhost:4200/"||click == true)
    this.myrouter.navigate(["/freeorbyrareaserach"]);  
}
CheckGoogleCSharpDistances()
{
  this.RequestServ.GetTravelTime().subscribe(
    data=>{
      alert(data);
    },
    error=>console.log(error.message),
    ()=>console.log('finished')
  );
}
try()
{
  this.myrouter.navigate(["/try"]); 
}
}
