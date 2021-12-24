import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() {}
  OccuredEnterance=(sessionStorage.getItem("surf")!=null&&JSON.parse(sessionStorage.getItem("surf")).Code!=0)?true:false;
  OccuredArea=false;
  display = false;
  showTitle=true;
  Titles = ['""'];
}