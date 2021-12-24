import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { myRequest } from '../Classes/myRequest';
import { PeopleService } from './people.service';
import { CriterionsofAreas } from '../Classes/CriterionsofAreas';
import { AreaService } from './area.service';
import { People } from '../Classes/People';
import { SimpleObject } from '../Classes/SimpleObject';
export  enum TypesEnum {List,Number,Boolean,Date,Hour,PartOfaList}
@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private myhttp:HttpClient, private PeopleServ:PeopleService,private AreaServ:AreaService) { }
  basicUrl='http://localhost:53939/api/Request/';
  Request=new myRequest();
  JobOffers:Array<myRequest>;
  getTitles():Observable<Array<SimpleObject>>
  {
    return this.myhttp.get<Array<SimpleObject>>(this.basicUrl+'getAllCriterionsTitles'); 
  }
  getAllCriterionsByArea():Observable<Array<CriterionsofAreas>>
  {
    return this.myhttp.get<Array<CriterionsofAreas>>(this.basicUrl+'getCriterions/'+this.AreaServ.Area+"/"+this.Request.Employee);
  }
  GetFavoritePeople():Observable<Array<People>>
  {
    return this.myhttp.get<Array<People>>(this.basicUrl+'GetFavoritePeople/'+this.AreaServ.Area+'/'+this.PeopleServ.surf.Code);
  }
  sendRequest():Observable<Array<myRequest>>
  {
    this.Request.PeopleCode=this.PeopleServ.surf.Code;
    this.Request.AreaCode=this.AreaServ.Area,this.Request;
    return this.myhttp.post<Array<myRequest>>(this.basicUrl+'SavemyRequest',this.Request); 
  }
  QuickSearch(AreaCode:number, AreaTitleCode:string,
    Place:string,Minutes:number,FreeText:string):Observable<Array<myRequest>>
  {
    debugger;
    return this.myhttp.get<Array<myRequest>>(this.basicUrl+'QuickSearch/'+AreaCode+'/'+ AreaTitleCode+
    '/'+(Place==''?'""':Place)+'/'+Minutes+'/'+(FreeText==''?'""':FreeText));
  }
  CompanySearch(Company:string):Observable<Array<myRequest>>
  {
    return this.myhttp.get<Array<myRequest>>(this.basicUrl+'CompanySearch/'+Company);
  }
  //בדיקת מרחקים בגוגל
  GetTravelTime():Observable<any>
  {
    return this.myhttp.get<any>(this.basicUrl+'GetTravelTime'); 
  }
  GetFreeList()
  {
    return this.myhttp.get<any>(this.basicUrl+'GetFreeList'); 
  }
  GetRequestsByPeople(Employee:boolean)
  {
    return this.myhttp.get<any>(this.basicUrl+'GetRequestsByPeople/'+this.PeopleServ.surf.Code+"/"+Employee); 
  }
}
