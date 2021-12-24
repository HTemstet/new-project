import { myRequest } from './myRequest';

export class JobsAppliedFor
{
    constructor(
        public SendingDate = new Date(1,1,1),
        public Request = new myRequest()
    ){}
}