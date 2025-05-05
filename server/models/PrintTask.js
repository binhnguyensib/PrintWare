class PrintTask {
  static STATES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    PRINTING: 'printing',
  };
  constructor({ taskId, docId, printerId, ownerId, date, state }) {
    this.taskId = taskId;
    this.docId = docId;
    this.printerId = printerId;
    this.ownerId = ownerId;
    this.date = date;
    this.state = state;
  }
    convertToJson() {
      return {
        taskId: this.taskId,
        docId: this.docId,
        printerId: this.printerId,
        ownerId: this.ownerId,
        date: this.date,
        state: this.state,
      };
    }
    setInfoFromJson(jsonData) {
      this.taskId = jsonData.taskId;
      this.docId = jsonData.docId;
      this.printerId = jsonData.printerId;
      this.ownerId = jsonData.ownerId;
      this.date = new Date(jsonData.date);
      this.state = jsonData.state;
    }

  }
export default PrintTask;
  