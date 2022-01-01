import { AboutComponent } from '../Components/about/about.component';
import { EnterComponent } from '../Components/enter/enter.component';
import { PersonalDetailsComponent } from '../Components/personal-details/personal-details.component';
import { ValidationComponent } from '../Components/validation/validation.component';
import { DisplaySelectComponent } from '../Components/display-select/display-select.component';
import { RequestComponent } from '../Components/request/request.component';
import { JobOffersComponent } from '../Components/job-offers/job-offers.component';
import { AboutEmployerComponent } from '../Components/about-employer/about-employer.component';
import { FreeorbyrAreaSerachComponent } from '../Components/freeorbyr-area-serach/freeorbyr-area-serach.component';
import { Routes } from '@angular/router';
import { OfferDetailsComponent } from '../Components/offer-details/offer-details.component';
import { AboutBusinessComponent } from '../Components/about-business/about-business.component';
import { JobManagementComponent } from '../Components/job-management/job-management.component';
import { PendingChangesGuard } from './pending-changes';
import { BasicSearchComponent } from '../Components/basic-search/basic-search.component';

export const routing:Routes=[
    { path:'about',component:AboutComponent},
    { path:'aboutemployer',component:AboutEmployerComponent},
    { path:'enter',component:EnterComponent},
    { path:'validation',component:ValidationComponent},
    { path:'personaldetails',component:PersonalDetailsComponent},
    { path:'dispalyselect',component:DisplaySelectComponent},
    { path:'request',component:RequestComponent,canDeactivate: [PendingChangesGuard]},
    { path:'joboffers',component:JobOffersComponent},
    { path:'freeorbyrareaserach',component:FreeorbyrAreaSerachComponent},
    { path:'freeorbyrareaserach/prof',component:FreeorbyrAreaSerachComponent}, 
    { path:'offerdetails',component:OfferDetailsComponent},
    { path:'aboutbusiness',component:AboutBusinessComponent},
    { path:'jobmanagement',component:JobManagementComponent},
    { path:'basicsearch',component:BasicSearchComponent,children:
    [{path:'request/:id',component:RequestComponent,canDeactivate: [PendingChangesGuard]}]}

    // { path: '**', component: PageNotFoundComponent }
    // try_files $uri $uri/ /index.html =404;.
];