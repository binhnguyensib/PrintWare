import {firestore} from '../../services/FirebaseAdminSDK.js';
import PrintTask from '../../models/PrintTask.js';
import EnrollUser from '../../utils/EnrollUser.js';
import HistoryLog from '../../models/HistoryLog.js';


export async function updatePrinterInfo(printerId, newDetails) {
  if (!printerId || !newDetails) {
    throw new Error("Invalid input");
  }

  try {
    const printerRef = firestore.collection('Printers').doc(printerId);
    const docSnapshot = await printerRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Printer not found");
    }

    await printerRef.update(newDetails);
    return { success: true, message: "Printer updated successfully" };
  } catch (error) {
    console.error("Error updating printer info:", error);
    throw new Error("An error occurred while updating the printer");
  }
}

export async function takeDocList(printerId) {
  if (!printerId) {
    throw new Error("Printer ID is required");
  }

  const printerSnapshot = await firestore.collection('Printers').doc(printerId).get();
  if (!printerSnapshot.exists) {
    throw new Error("Printer not found");
  }

  const printerData = printerSnapshot.data();
  const jobQueue = printerData.jobQueue || [];
  const printTasksSnapshot = await firestore
    .collection('printTasks')
    .where('taskId', 'in', jobQueue)
    .get();

  return printTasksSnapshot.docs.map((doc) => doc.data().docId);
}

export async function addTask(printerId, taskId) {
  if (!printerId || !taskId) {
    throw new Error("Invalid input data");
  }

  try {

    if (!taskId.trim()) {
      throw new Error("taskId cannot be empty");
    }

    const printerRef = firestore.collection('Printers').doc(printerId);
    const printerSnapshot = await printerRef.get();

    if (!printerSnapshot.exists) {
      throw new Error("Printer not found");
    }

    const printerData = printerSnapshot.data();
    const updatedJobQueue = [...(printerData.jobQueue || []), taskId];
    await printerRef.update({ jobQueue: updatedJobQueue });


    return { success: true, message: `Task ${taskId} added successfully to Printer ${printerId}` };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error; 
  }
}


export async function removeTask(printerId, taskId) {
  if (!taskId || !printerId) {
    throw new Error("Invalid input data");
  }
  
  try {

    const printerRef = firestore.collection('Printers').doc(printerId);
    const printerSnapshot = await printerRef.get();

    if (!printerSnapshot.exists) {
      throw new Error("Printer not found");
    }

    const printerData = printerSnapshot.data();
    const jobQueue = printerData.jobQueue || [];


    if (!jobQueue.includes(taskId)) {
      throw new Error("Task not found in printer's job queue");
    }

    await firestore.collection('printTasks').doc(taskId).delete();
    const updatedJobQueue = jobQueue.filter((id) => id !== taskId);
    await printerRef.update({ jobQueue: updatedJobQueue });
    return { success: true, message: "Task removed successfully" };
  } catch (error) {
    console.error("Error removing task:", error);
    throw error;
  }
}


export async function print(taskId) {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const batch = firestore.batch();

  try {

    const taskRef = firestore.collection('printTasks').doc(taskId);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      throw new Error("Task not found");
    }

    const taskData = taskSnapshot.data();
    const printerRef = firestore.collection('Printers').doc(taskData.printerId);
    const printerSnapshot = await printerRef.get();

    if (!printerSnapshot.exists) {
      throw new Error("Printer not found");
    }

    const printerData = printerSnapshot.data();
    const jobQueue = printerData.jobQueue || [];
    if (!jobQueue.includes(taskId)) {
      throw new Error("Task is not in the printer's job queue");
    }

    batch.update(taskRef, { state: PrintTask.STATES.COMPLETED });
    const updatedJobQueue = jobQueue.filter((id) => id !== taskId);
    batch.update(printerRef, { jobQueue: updatedJobQueue });
    const updatedHistoryDocRepo = [...(printerData.historyDocRepo || []), taskData.docId];
    batch.update(printerRef, { historyDocRepo: updatedHistoryDocRepo });
    const historyLogCollection = firestore.collection('HistoryLogs');
    const historyLogQuerySnapshot = await historyLogCollection
      .where('ownerId', '==', taskData.ownerId)
      .get();

    if (historyLogQuerySnapshot.empty) {
      const newHistoryLog = new HistoryLog();
      newHistoryLog.hisLogId = taskData.ownerId; // Sử dụng ownerId làm ID
      newHistoryLog.ownerId = taskData.ownerId;
      newHistoryLog.paymentRepo = [];
      newHistoryLog.printedDocRepo = [taskData.docId];
      
      const newHistoryLogRef = historyLogCollection.doc(); 
      batch.set(newHistoryLogRef, newHistoryLog.toJson());
    } else {
      const existingHistoryLogDoc = historyLogQuerySnapshot.docs[0];
      const existingHistoryLogData = existingHistoryLogDoc.data();
      const updatedPrintedDocRepo = [...(existingHistoryLogData.printedDocRepo || []), taskData.docId];
      batch.update(existingHistoryLogDoc.ref, { printedDocRepo: updatedPrintedDocRepo });
    }
    await batch.commit();
    const userId = taskData.ownerId;
    const enrollUserInstance = EnrollUser.getInstance();
    const sseResult = enrollUserInstance.InvokeNewEvent(userId, "printTaskCompleted", { taskId: taskData.taskId });
    if (sseResult.ok) {
      return { success: true, message: `Task ${taskId} printed successfully` };
    }
    else {
      return { success: true, message: `Task ${taskId} printed successfully. But can not send SSE to user because ${sseResult.message}` }; 
    }
  } catch (error) {
    console.error("Error printing task:", error);
    throw new Error(error.message || "An error occurred while printing");
  }
}



