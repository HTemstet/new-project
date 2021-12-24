import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobsAppliedFor } from '../Classes/JobsAppliedFor';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class JobManagementService {

  constructor(private myhttp:HttpClient) { }
  basicUrl='http://localhost:53939/api/JobsManagement/';
  getJobsAppliedbyPeople(PeopleCode:number):Observable<Array<JobsAppliedFor>>
  {
    return this.myhttp.get<Array<JobsAppliedFor>>(this.basicUrl+'getJobsAppliedbyPeople/'+PeopleCode);
  }
}
