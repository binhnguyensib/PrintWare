import { firestore } from '../services/FirebaseAdminSDK.js';
import SystemConfig from './SystemConfig.js';
export default class SPSO {
    constructor() {
        this.systemConfig = new SystemConfig();
        this.history = [];
        this.printers = [];
        this.rooms = [];
    } }
