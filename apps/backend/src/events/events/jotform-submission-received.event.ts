
export class JotformSubmissionReceivedEvent{
    caseId: string;
    personId: string;
    

    constructor(caseId:string, personId: string){
        this.caseId = caseId;
        this.personId = personId;
    }
}