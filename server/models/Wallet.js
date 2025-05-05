export default class Wallet {
    constructor
    (walletId, ownerId, availablePages, createAt, updateAt, lastSemesterUpdate) 
    {
        this.walletId = walletId;
        this.ownerId = ownerId;
        this.availablePages = availablePages;
        this.createAt = createAt;
        this.updateAt = updateAt;
        this.lastSemesterUpdate = lastSemesterUpdate;
    }
    convertToJson() {
        return {
            walletId: this.walletId,
            ownerId: this.ownerId,
            availablePages: this.availablePages,
            createAt: this.createAt,    
            updateAt: this.updateAt,
            lastSemesterUpdate: this.lastSemesterUpdate
        };
    }

    setInfoFromJson(json) {
        this.walletId = json.walletId;
        this.ownerId = json.ownerId;
        this.availablePages = json.availablePages;
        this.createAt = json.createAt;
        this.updateAt = json.updateAt;
        this.lastSemesterUpdate = json.lastSemesterUpdate;
    }
}