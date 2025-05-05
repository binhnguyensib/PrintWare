export default class Payment {
    constructor (
        transactionId,
        ownerId,
        amount,
        status,
        paymentMethod,
        createAt,
    ) {
        this.transactionId = transactionId;
        this.ownerId = ownerId;
        this.amount = amount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.createAt = createAt;
    }
    convertToJson() {
        return {
            transactionId: this.transactionId,
            ownerId: this.ownerId,
            amount: this.amount,
            status: this.status,
            paymentMethod: this.paymentMethod,
            createAt: this.createAt,
        };
    }
    setInfoFromJson(json) {
        this.transactionId = json.transactionId;
        this.ownerId = json.ownerId;
        this.amount = json.amount;
        this.status = json.status;
        this.paymentMethod = json.paymentMethod;
        this.createAt = json.createAt;
    }
}