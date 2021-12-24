import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimpleObject } from '../Classes/SimpleObject';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private myhttp:HttpClient, private messageService: MessageService) { }
  basicUrl='http://localhost:53939/api/PeopleValidation/';
  PeopleValidation=new Array<SimpleObject>();
  sendingTempPass=false;
  knownPeople=false;
  SurfValidations= new Array<SimpleObject>();
  alert()
  {
    this.messageService.add({severity:'error', summary: 'שגיאה', detail:'אופס, כנראה שחלק מהשדות לא מלאת או שהכנסת פרטים שגויים'});
  }
  GetRandomValidations():Observable<Array<SimpleObject>>
  {
    return this.myhttp.get<Array<SimpleObject>>(this.basicUrl+'getRandomValidations');
  }
  GetAllValidations():Observable<Array<SimpleObject>>
  {
    return this.myhttp.get<Array<SimpleObject>>(this.basicUrl+'getAllValidations');
  }
  checkpeopleValidation(Email:string):Observable<boolean>
  {
    return this.myhttp.post<boolean>(this.basicUrl+'ValidPeople',{Email:Email,PeopleValidation:this.PeopleValidation});
  }
  AddNewPeople(Email:string):Observable<boolean>
  {
    return this.myhttp.post<boolean>(this.basicUrl+'AddNewPeople',{Email:Email,PeopleValidation:this.PeopleValidation});
  }
  
GetPeopleValidation(PeopleCode:number)
{
this.myhttp.get<Array<SimpleObject>>(this.basicUrl+'getPeopleValidation/'+PeopleCode).subscribe(
data=>{
this.SurfValidations=data;
console.log('success');
},
error=>console.log(error.message),
()=>console.log('finished')
);
}
SavePeopleValidation():Observable<any>
{
  return this.myhttp.post<Array<any>>(this.basicUrl+'SavePeopleValidations',this.SurfValidations);
}
}
