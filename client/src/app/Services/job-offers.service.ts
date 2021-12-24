import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobOfferEmail } from 'src/app/Classes/JobOfferEmail';
import { AreaService } from './area.service';
import { PeopleService } from './people.service';
@Injectable({
  providedIn: 'root'
})
export class JobOffersService {

  constructor(private myhttp:HttpClient,private AreaServ:AreaService,private PeopleServ:PeopleService) { }
  basicUrl='http://localhost:53939/api/JobOffers/';
  SendOfferEmail(RequestCode:number,JobOfferEmail:JobOfferEmail):Observable<any>
  {
    return this.myhttp.post<any>(this.basicUrl+'SendOfferEmail/'+this.AreaServ.FullArea.Name+"/"+this.PeopleServ.surf.Code+"/"+RequestCode ,JobOfferEmail); 
  }
  GetRequestByCode(RequestCode:number)
  {
    return this.myhttp.get<any>(this.basicUrl+'GetRequestByCode/'+RequestCode); 
  }
}
