import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AreasTitles } from '../Classes/AreasTitles';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreasTitlesService {
  basicUrl='http://localhost:53939/api/AreasTitles/';
  constructor(private myhttp:HttpClient) { }
  AreasTitlesList=new Array<AreasTitles>();
  getAreasTitles(AreaCode:number):Observable<Array<AreasTitles>>
  {
     return this.myhttp.get<Array<AreasTitles>>(this.basicUrl+'getAreasTitles/'+AreaCode);
  }
}
