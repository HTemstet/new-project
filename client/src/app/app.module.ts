import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { EnterComponent } from './Components/enter/enter.component';
import { HomeComponent } from './Components/home/home.component';
import { PersonalDetailsComponent } from './Components/personal-details/personal-details.component';
import { RequestComponent } from './Components/request/request.component';
import { JobOffersComponent } from './Components/job-offers/job-offers.component';
import { DisplaySelectComponent } from './Components/display-select/display-select.component';
import { ValidationComponent } from './Components/validation/validation.component';
import { AboutComponent } from './Components/about/about.component';
import { routing } from 'src/app/OtherPages/RoutingFile';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { Ng5SliderModule } from 'ng5-slider';
import {MatSliderModule} from '@angular/material/slider';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
//גלריית תמונות
import { GalleriaModule } from 'primeng/galleria';
//כפתור כניסה
import { MatInputModule } from '@angular/material/input';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/components/common/messageservice';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import {RadioButtonModule} from 'primeng/radiobutton';
import { DialogModule} from 'primeng/dialog';
import { DisplayButtonComponent } from './Components/display-button/display-button.component';
import { LoadingComponent } from './Components/loading/loading.component';
import { StepsModule } from 'primeng/steps';
import { AboutEmployerComponent } from './Components/about-employer/about-employer.component';
import { FreeorbyrAreaSerachComponent } from './Components/freeorbyr-area-serach/freeorbyr-area-serach.component';
//לקומפ' request
import {MatTabsModule} from '@angular/material/tabs';
// job-offers
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TryComponent } from './Components/try/try.component';
import { BasicSearchComponent } from './Components/basic-search/basic-search.component';
import { CriterionsAccordionComponent } from './Components/criterions-accordion/criterions-accordion.component';
import { OfferDetailsComponent } from './Components/offer-details/offer-details.component';
import { AboutBusinessComponent } from './Components/about-business/about-business.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { JobManagementComponent } from './Components/job-management/job-management.component';
import { DatePipe } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { PendingChangesGuard } from './OtherPages/pending-changes';
@NgModule({
  declarations: [
    EnterComponent,
    HomeComponent,
    PersonalDetailsComponent,
    RequestComponent,
    JobOffersComponent,
    DisplaySelectComponent,
    ValidationComponent,
    AboutComponent,
    DisplayButtonComponent,
    LoadingComponent,
    AboutEmployerComponent,
    FreeorbyrAreaSerachComponent,
    TryComponent,
    BasicSearchComponent,
    CriterionsAccordionComponent,
    OfferDetailsComponent,
    AboutBusinessComponent,
    JobManagementComponent,
  ],
  imports: [HttpClientModule,FormsModule,GooglePlaceModule,Ng5SliderModule,MatSliderModule,
    ToastModule,ButtonModule,GalleriaModule,DialogModule,RadioButtonModule,    NgxMatSelectSearchModule,
    MatCheckboxModule,MatTreeModule,MatButtonModule,MatIconModule,MatSelectModule,MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,MatInputModule,MatTabsModule,MatExpansionModule,
    BrowserAnimationsModule,InputTextModule,StepsModule,
    BrowserModule,RouterModule.forRoot(routing),
    AgmCoreModule.forRoot({
      // apiKey:'AIzaSyAj13gY0dRy3LKgxfbOkCPaqq_twe8eR3k',
        apiKey:'AIzaSyB22ByLmqnURDUl36iyyIGCeTDNdNLgzW4',      
      // apiKey:'AIzaSyAcaVmSWH7ZwLmGmlR2BRwLswpjFZ0aBto‏',
       libraries: ['places','geometry']}),BrowserModule,
       FormsModule,
       ReactiveFormsModule
  //   RouterModule.forRoot(
  //   routing,
  //   {enableTracing: true } 
  // )
  ],
  providers: [MessageService,DatePipe,PendingChangesGuard],
  bootstrap: [HomeComponent]
})
export class AppModule { }
