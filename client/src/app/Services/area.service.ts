import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeopleService } from './people.service';
import { Area } from '../Classes/Area';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService{
  basicUrl='http://localhost:53939/api/Area/';
  Allareas:Array<Area>=null;
  Area:number=null;
  FullArea:Area=new Area();
  AreaSearch=null;
  showAreas=null;
  constructor(private myhttp:HttpClient,private PeopleServ:PeopleService) {}
  getAreas()
  {
    if(this.Allareas==null)
      this.myhttp.get<Array<Area>>(this.basicUrl+'getAllAreas').subscribe(
      data=>this.Allareas=data,
      error=>console.log(error.message),
      ()=>console.log('finished')
    );
    return this.Allareas;
  }
  getAreaswithoutSubscribe():Observable<any>
  {
   return this.myhttp.get<Array<Area>>(this.basicUrl+'getAllAreas')
  }
}
