import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { People } from '../Classes/People';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private myhttp:HttpClient) { 
  }
  get surf()
  {
    if(this._surf.Code==0)
      this._surf=JSON.parse(sessionStorage.getItem("surf"))||new People();
    return this._surf;
  }
  set surf(value)
  {
    this._surf=value;
    sessionStorage.setItem("surf",JSON.stringify(this._surf));
  }
  _surf:People=new People();
  backtoemployer=false;
  backtoemloyee=false;
  backtojobmanagement=false;
  backtojoboffers=false;
  basicUrl='http://localhost:53939/api/People/';
  PictureNative="http://localhost:53939/Files/"
  checkpeoplePassword(Email:string,Pass:string):Observable<People>
  {
    return this.myhttp.post<People>(this.basicUrl+'ExistsPeoplePassword',{Email:Email,PeoplePassword:Pass});
  }
  checkpeopleTempPassword(Email:string,Pass:string):Observable<boolean>
  {
    return this.myhttp.post<boolean>(this.basicUrl+'ExistsPeopleTempPassword',{Email:Email,PeoplePassword:Pass});
  }
  changePassword(Email:string,TempPass:number,Pass:string):Observable<People>
  {
    return this.myhttp.post<People>(this.basicUrl+'ChangePassword',{Email:Email,TempPassword:TempPass,PeoplePassword:Pass});
  }
  updatepeople():Observable<any>
  {
    sessionStorage.setItem("surf",JSON.stringify(this._surf));
   return this.myhttp.put<any>(this.basicUrl+'PutPeopleDetails',this.surf);
  }
  GetLogosAndSites():Observable<any>
  {
    return this.myhttp.get<any>(this.basicUrl+'GetLogosAndSites')
  }
  getLogo():Observable<string>
  {
    return this.myhttp.get<string>(this.basicUrl+'GetPeopleLogo/'+this.surf.Code)
  }
  getCV():Observable<string>
  {
    return this.myhttp.get<string>(this.basicUrl+'GetCVByPeople/'+this.surf.Code)
  }
  FileName='';
  Placing(file:File,FolderName:string):Observable<any>
 {
this.FileName=file.name.split('.')[0]
let formData=new FormData();
formData.append('uploadFile',file,file.name);
return this.myhttp.post<any>(this.basicUrl+'PostFile/'+this.surf.Code+"/"+FolderName,formData);
 }
 RemoveFile(FolderName:string)
{
  return this.myhttp.delete<any>(this.basicUrl+'RemoveFile/'+this.surf.Code+"/"+FolderName);
}
SaveSiteLinkandAbout()

{
  sessionStorage.setItem("surf",JSON.stringify(this._surf));
  return this.myhttp.post<any>(this.basicUrl+'SaveSiteLinkandAbout',this.surf);
}
}
