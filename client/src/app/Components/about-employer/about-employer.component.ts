import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/Services/global.service';
import { RequestService } from 'src/app/Services/request.service';
import { Router } from '@angular/router';
import { AreaService } from 'src/app/Services/area.service';
import { PeopleService } from 'src/app/Services/people.service';
import { ValidationService } from 'src/app/Services/validation.service';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-about-employer',
  templateUrl: './about-employer.component.html',
  styleUrls: ['./about-employer.component.css']
})

export class AboutEmployerComponent implements OnInit {
  constructor(private RequestServ:RequestService,
    private AreaServ:AreaService,
    private PeopleServ:PeopleService,
    private ValidationServ:ValidationService,
    private myrouter:Router,
    private GlobalServ:GlobalService) { }

  ngOnInit() {
  }
  colorButtonOver()
  { 
    document.getElementById("b1").style.backgroundColor = "rgb(245, 20, 12)";
    document.getElementById("b1").style.color = "white";
    document.getElementById("b1").style.borderColor = "white";
   
    //document.querySelector("button").style.backgroundColor = "rgb(245, 20, 12)";
    //document.querySelector("button").style.color = "white";
    //document.querySelector("button").style.borderColor = "white";
  }
  colorButtonOut()
  {
    document.getElementById("b1").style.backgroundColor = "white";
    document.getElementById("b1").style.color = "#34495e";
    document.getElementById("b1").style.borderColor = "rgb(245, 20, 12)";
    
    //document.querySelector("button").style.backgroundColor = "white";
    //document.querySelector("button").style.color = "#34495e";
    //document.querySelector("button").style.borderColor = "rgb(245, 20, 12)";
  }
  colorButtonOver1(){
    document.getElementById("b2").style.backgroundColor = "rgb(245, 20, 12)";
    document.getElementById("b2").style.color = "white";
    document.getElementById("b2").style.borderColor = "white";
  }
  colorButtonOut1(){
    document.getElementById("b2").style.backgroundColor = "white";
    document.getElementById("b2").style.color = "#34495e";
    document.getElementById("b2").style.borderColor = "rgb(245, 20, 12)";
  }
  dispalyAreaselect()
  {
    this.myrouter.navigateByUrl('freeorbyrareaserach', {skipLocationChange: true}).then(()=>
    this.myrouter.navigate(["/offerdetails"]));  
  }
navigatetoJobsManagement()
{
  this.myrouter.navigateByUrl('freeorbyrareaserach', {skipLocationChange: true}).then(()=>
  this.myrouter.navigate(["/aboutbusiness"])); 
}
}
