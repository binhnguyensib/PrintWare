class Printer {
  constructor(printerId, roomId, detail, config, jobQueue = [], historyDocRepo = []) {
    this.printerId = printerId;
    this.roomId = roomId;
    this.detail = detail;
    this.config = config;
    this.jobQueue = jobQueue;
    this.historyDocRepo = historyDocRepo;
    
  }

  convertToJson() {
    return {
      printerId: this.printerId,
      roomId: this.roomId,
      detail: this.detail,
      config: this.config,
      jobQueue: this.jobQueue,
      historyDocRepo: this.historyDocRepo,
      
    };
  }

  setInfoFromJson(json) {
    this.printerId = json.printerId;
    this.roomId = json.roomId;
    this.detail = json.detail || {};
    this.config = json.config || {};
    this.jobQueue = json.jobQueue || [];
    this.historyDocRepo = json.historyDocRepo || [];
    
  }
 
}

export default Printer;
