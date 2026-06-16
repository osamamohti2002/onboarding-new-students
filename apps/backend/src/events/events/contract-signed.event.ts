export class ContractSignedEvent{
    caseId: string;
    actorId: string;

    constructor(caseId: string, actorId: string){
        this.caseId = caseId;
        this.actorId = actorId;
    }
}