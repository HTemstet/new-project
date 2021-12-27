import { CriterionsofAreas } from './CriterionsofAreas';
import {OfferDetails} from './OfferDetails'
import { People } from './People';
export class myRequest
{
    constructor(
        public RequestCode = 0,
        public PeopleCode=0,
        public PeopleOffer=new People(),
        public AreaCode=0,
        public AreaTitles='',
        public Place='',
        public EmployTravelTime=0,
        public Employee=false,
        public SendingJobOffersOnceaDay=false,
        public SendingJobOffersWheneverThereIsaSuitableOffer=false,
        public CriterionsofRequests=new Array<CriterionsofAreas>(),
        public RequestOfferDetails=new OfferDetails(),
        public AdjustmentPercentages=0,
        public backtojoboffers=false
    ){}
}