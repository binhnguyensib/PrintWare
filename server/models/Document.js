export default class Document {
    constructor(
        docId,
        ownerId,
        name,
        description,
        type,
        size,
        numPages,
        uploadDate,
        linkDoc
    ) {
        this.docId = docId || null;
        this.ownerId = ownerId || null;
        this.name = name || "";
        this.description = description || "";
        this.type = type || "";
        this.size = size || 0;
        this.numPages = numPages;
        this.uploadDate = uploadDate || new Date().toISOString();
        this.linkDoc = linkDoc || "";
    }

    convertToJson() {
        return {
        docId: this.docId,
        ownerId: this.ownerId,
        name: this.name,
        description: this.description,
        type: this.type,
        size: this.size,
        numPages: this.numPages,
        uploadDate: this.uploadDate,
        linkDoc: this.linkDoc,
        };
    }

    setInfoFromJson(json) {
        this.docId = json.docId;
        this.ownerId = json.ownerId;
        this.name = json.name;
        this.description = json.description;
        this.type = json.type;
        this.size = json.size;
        this.numPages = json.numPages;
        this.uploadDate = json.uploadDate;
        this.linkDoc = json.linkDoc;
    }
}