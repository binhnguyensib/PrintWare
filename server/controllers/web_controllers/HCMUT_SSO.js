import { Readable } from 'stream';

import { adminAuth, firestore } from '../../services/FirebaseAdminSDK.js';
import { FieldValue } from 'firebase-admin/firestore';
import { googleDrive } from '../../services/GoogleSDK.js';

import { Customer, SPSO } from '../../models/User.js';
import Wallet from '../../models/Wallet.js';

// Checked
export async function register(paramBody) {
    try {
        paramBody['userRole'] = 'customer';

        const checkUserQuery = firestore.collection(process.env.USERS_COLLECTION).where('email', '==', paramBody.email);
        checkUserQuery.get().then((checkUserSnapshot) => {
            if (!checkUserSnapshot.empty) {
                return { status: 409, body: { message: 'Email already exists.' } };
            }
        });

        const createRequest = {
            email: paramBody.email?? null,
            password: paramBody.password?? null,
            displayName: paramBody.userName?? null
        };
        if (paramBody.phoneNum) {
            createRequest.phoneNumber = paramBody.phoneNum;
        }
        
        const user = new Customer();
        const validFields = Object.keys(user).filter(key => key !== 'constructor');
        let invalidFields = Object.keys(paramBody).filter(key => !validFields.includes(key));
        invalidFields = invalidFields.filter(field => field !== 'password');
        if (invalidFields.length > 0) {
            return { status: 400, body: { ok: false, message: `The following fields are invalid: ${invalidFields.join(', ')}.` } };
        }

        const userRecord = await adminAuth.createUser(createRequest);

        user.setInfoFromJSON(paramBody);
        const wallet = new Wallet('', userRecord.uid, 0, FieldValue.serverTimestamp(), FieldValue.serverTimestamp(), FieldValue.serverTimestamp());

        const batch = firestore.batch();
        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(userRecord.uid);
        const walletRef = firestore.collection(process.env.WALLETS_COLLECTION).doc(userRecord.uid);

        batch.set(userRef, user.convertToJSON());
        batch.update(userRef, { userId: userRecord.uid })

        batch.set(walletRef, wallet.convertToJson());

        return await batch.commit().then(() => {
            user.userId = userRecord.uid;
            return { status: 201, body: { message: 'User created successfully.', data: user.convertToJSON() } };
        }).catch((error) => {
            console.log('Error updating database for new user:', error);
            return { status: 500, body: { message: error.message } };
        });
    }
    catch (error) {
        console.log('Error creating new user:', error);
        return { status: 500, body: { message: error.message } };
    }
}


// Checked
export async function adminRegister(paramBody) {
    try {
        paramBody['userRole'] = 'spso';
        paramBody['highestAuthority'] = false;

        const checkUserQuery = firestore.collection(process.env.USERS_COLLECTION).where('email', '==', paramBody.email);
        checkUserQuery.get().then((checkUserSnapshot) => {
            if (!checkUserSnapshot.empty) {
                return { status: 409, body: { message: 'Email already exists.' } };
            }
        });

        const createRequest = {
            email: paramBody.email?? null,
            password: paramBody.password?? null,
            displayName: paramBody.userName?? null
        };
        if (paramBody.phoneNum) {
            createRequest.phoneNumber = paramBody.phoneNum;
        }
        
        const admin = new SPSO();
        const validFields = Object.keys(admin).filter(key => key !== 'constructor');
        let invalidFields = Object.keys(paramBody).filter(key => !validFields.includes(key));
        invalidFields = invalidFields.filter(field => field !== 'password');
        if (invalidFields.length > 0) {
            return { status: 400, body: { message: `The following fields are invalid: ${invalidFields.join(', ')}.` } };
        }

        const userRecord = await adminAuth.createUser(createRequest);

        admin.setInfoFromJSON(paramBody);

        const batch = firestore.batch();
        const adminRef = firestore.collection(process.env.ADMINS_COLLECTION).doc(userRecord.uid);

        batch.set(adminRef, admin.convertToJSON());
        batch.update(adminRef, { userId: userRecord.uid })

        return await batch.commit().then(() => {
            admin.userId = userRecord.uid;
            return { status: 201, body: { message: 'Admin account created successfully.', data: admin.convertToJSON() } };
        }).catch((error) => {
            console.log('Error updating database for new user:', error);
            return { status: 500, body: { message: error.message } };
        })
    }
    catch (error) {
        console.log('Error creating new user:', error);
        return { status: 500, body: { message: error.message } };
    }
}

// Checked
export async function deleteAccount(paramUserId, paramUserRole) {
    if (paramUserRole != 'customer' && paramUserRole != 'spso') {
        return { status: 400, body: { message: 'Invalid user role.' } };
    }

    if (paramUserRole === 'customer') {
        return await adminAuth.deleteUser(paramUserId).then(async () => {
            const batch = firestore.batch();

            const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(paramUserId);
    
            const userSnapshot = await userRef.get();
            if (userSnapshot.data() === undefined) {
                return { status: 404, body: { message: 'User not found.' } };
            }
            
            batch.delete(userRef);
            
            const docs = userSnapshot.data().documents;
            for (const docId of docs) {
                const docSnapshot = await firestore.collection(process.env.DOCUMENTS_COLLECTION).doc(docId).get();
                if (docSnapshot.data() !== undefined) {
                    const printTaskQuery = firestore.collection(process.env.PRINT_TASKS_COLLECTION).where('docId', '==', docId);
                    const printTaskSnapshot = await printTaskQuery.get();
                    if (printTaskSnapshot.empty) {
                        batch.delete(docRef);
                    }
                }
            }
            
            const walletRef = firestore.collection(process.env.WALLETS_COLLECTION).doc(query.userId);
            const walletSnapshot = await walletRef.get();
            if (walletSnapshot.data() !== undefined) {
                batch.delete(walletRef);
            }

            return await batch.commit().then(() => {
                return { status: 200, body: { message: 'User deleted successfully.' } };
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
                return { status: 500, body: { message: error.message } };
            });
        })
        .catch((error) => {
            console.log('Error deleting user:', error);
            return { status: 500, body: { message: error.message } };
        });
    }
    else {
        return await adminAuth.deleteUser(paramUserId).then(async () => {
            const adminRef = firestore.collection(process.env.ADMINS_COLLECTION).doc(paramUserId);
    
            const adminSnapshot = await adminRef.get();
            if (adminSnapshot.data() === undefined) {
                return { status: 404, body: { message: 'Admin account not found.' } };
            }

            if (adminSnapshot.data().highestAuthority) {
                return { status: 400, body: { message: 'Cannot delete highest authority account.' } };
            }
    
            adminRef.delete();
    
            return { status: 200, body: { message: 'Admin account deleted successfully.' } };
        })
        .catch((error) => {
            console.log('Error deleting admin account:', error);
            return { status: 500, body: { message: error.message } };
        });
    }
}

// Checked
export async function updateProfile(paramUserId, paramUserRole, paramBody) {
    if (paramUserRole != 'customer' && paramUserRole != 'spso') {
        return { status: 400, body: { message: 'Invalid user role.' } };
    }
    
    try {
        if (paramUserRole === 'customer') {
            const CustomerInstance = new Customer();
            const validFields = Object.keys(CustomerInstance).filter(key => key !== 'constructor');
            
            const invalidFields = Object.keys(paramBody).filter(key => !validFields.includes(key));
            if (invalidFields.length > 0) {
                return { status: 400, body: { message: `The following fields are invalid: ${invalidFields.join(', ')}.` } };
            }

            const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(paramUserId);
            const userSnapshot = await userRef.get();
            if (userSnapshot.data() === undefined) {
                return { status: 404, body: { message: 'User not found.' } };
            }

            const batch = firestore.batch();

            batch.update(userRef, paramBody);

            return await batch.commit().then(() => {
                return { status: 200, body: { message: 'User updated successfully.' } };
            })
            .catch((error) => {
                console.log('Error updating user:', error);
                return { status: 500, body: { message: error.message } };
            });
        }
        else if (paramUserRole === 'spso') {
            const SPSOInstance = new SPSO();
            const validFields = Object.keys(SPSOInstance).filter(key => key !== 'constructor');
            
            const invalidFields = Object.keys(paramBody).filter(key => !validFields.includes(key));
            if (invalidFields.length > 0) {
                return { status: 400, body: { message: `The following fields are invalid: ${invalidFields.join(', ')}.` } };
            }

            const adminRef = firestore.collection(process.env.ADMINS_COLLECTION).doc(paramUserId);
            const adminSnapshot = await adminRef.get();
            if (adminSnapshot.data() === undefined) {
                return { status: 404, body: { message: 'Admin account not found.' } };
            }

            const batch = firestore.batch();

            batch.update(adminRef, paramBody);

            return await batch.commit().then(() => {
                return { status: 200, body: { message: 'Admin account updated successfully.' } };
            })
            .catch((error) => {
                console.log('Error updating admin account:', error);
                return { status: 500, body: { message: error.message } };
            })
        }
    }
    catch (error) {
        console.log('Error:', error);
        return { status: 500, body: { message: error.message } };
    }
}

// Checked
export async function getUserProfileById(paramUserId) {
    // Check for admin account first
    const adminRef = firestore.collection(process.env.ADMINS_COLLECTION).doc(paramUserId);

    const adminSnapshot = await adminRef.get();
    if (adminSnapshot.data() !== undefined) {
        return { status: 200, body: { message: 'Admin account found.', data: adminSnapshot.data() } };
    }

    const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(paramUserId);

    return await userRef.get().then((userSnapshot) => {
        if (userSnapshot.data() === undefined) {
            return { status: 404, body: { message: 'User not found.' } };
        }
        
        return { status: 200, body: { message: 'User found.', data: userSnapshot.data() } };
    })
    .catch((error) => {
        return { status: 500, body: { message: error.message } };
    })
}

// Checked
export async function getUserProfileByEmail(paramEmail) {
    const ftQuery = firestore.collection(process.env.USERS_COLLECTION).where('email', '==', paramEmail);

    return await ftQuery.get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            return { status: 404, body: { message: 'User not found.' } };
        }

        return { status: 200, body: { message: 'User found.', data: querySnapshot.docs[0].data() } };
    })
    .catch((error) => {
        return { status: 500, body: { message: error.message } };
    })
}

// Checked
export async function getUserIdByEmail(paramEmail) {
    return await adminAuth.getUserByEmail(paramEmail).then((userRecord) => {
        return { status: 200, body: { message: 'User found.', data: userRecord.uid } };
    })
    .catch((error) => {
        if (error.code === 'auth/user-not-found') {
            return { status: 404, body: { message: 'User not found.' } };
        }
        else if (error.code === 'auth/invalid-email') {
            return { status: 400, body: { message: 'Invalid email.' } };
        }
        else {
            return { status: 500, body: { message: error.message } };
        }
    });
}

// Checked
export async function uploadPicture(paramFile, paramUserId, paramType) {
    const workingType = paramType;
    if (workingType !== 'avatar' && workingType !== 'coverPhoto') {
        return { status: 400, body: { message: 'Invalid type.' } };
    }
    
    const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(paramUserId);

    const userSnapshot = await userRef.get();
    if (userSnapshot.data() === undefined) {
        return { status: 404, body: { message: 'User not found.' } };
    }

    if (workingType === 'avatar') {
        if (userSnapshot.data().avatar) {
            const avatarId = userSnapshot.data().avatar;

            const delResult = await googleDrive.files.delete({ fileId: avatarId }).then(() => {
                console.log('Avatar deleted successfully.');
                return { check: true };
            }).catch((error) => {
                console.log('Error deleting avatar: ', error);
                return { check: false, status: 500, message: error.message };
            });

            if (!delResult.check) {
                return { status: delResult.status, body: { message: delResult.message } };
            }
        }
    }
    else {
        if (userSnapshot.data().coverPhoto) {
            const coverPhotoId = userSnapshot.data().coverPhoto;
            
            const delResult = await googleDrive.files.delete({ fileId: coverPhotoId }).then(() => {
                console.log('Cover photo deleted successfully.');
                return { check: true };
            }).catch((error) => {
                console.log('Error deleting cover photo: ', error);
                return { check: false, status: 500, message: error.message };
            });

            if (!delResult.check) {
                return { status: delResult.status, body: { message: delResult.message } };
            }
        }
    }

    const fileBuffer = Buffer.from(paramFile.buffer, 'base64');
    const fileStream = new Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    const mimeType = paramFile.mimetype;
    const userID = paramUserId;
    const fileMetadata = {
        name: userID,
        parents: workingType === 'avatar' ? [process.env.AVATARS_FOLDER_ID] : [process.env.COVERPHOTOS_FOLDER_ID]
    };

    try {
        const response = await googleDrive.files.create({
            resource: fileMetadata,
            media: {
                body: fileStream,
                mimeType: mimeType
            },
            fields: 'id'
        });

        console.log('File ID: ', response.data.id);
        const updateData = workingType === 'avatar' ? { avatar: response.data.id } : { coverPhoto: response.data.id };

        return await userRef.update(updateData).then(() => {
            return { status: 201, body: { message: 'File uploaded successfully.', data: response.data.id } };
        }).catch((error) => {
            console.log('Error updating avatar: ', error);
            return { status: 500, body: { message: error.message } };
        });
    }
    catch (error) {
        console.log('Error uploading file: ', error);
        return { status: 500, body: { message: error.message } };
    }

}

// Check
export async function getPictureByUserId(paramUserId, paramType) {
    const workingType = paramType;

    if (workingType !== 'avatar' && workingType !== 'coverPhoto') {
        return { status: 400, body: { message: 'Invalid type.' } };
    }

    try {
        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(paramUserId);
        const userSnapshot = await userRef.get();
        if (userSnapshot.data() === undefined) {
            return { status: 404, body: { message: 'User not found.' } };
        }
        const user = userSnapshot.data();
        if (workingType === 'avatar' && !user.avatar) {
            return { status: 404, body: { message: 'Avatar not found.' } };
        }
        if (workingType === 'coverPhoto' && !user.coverPhoto) {
            return { status: 404, body: { message: 'Cover photo not found.' } };
        }

        const fileId = workingType === 'avatar' ? user.avatar : user.coverPhoto;
        const response = await googleDrive.files.get({
            fileId: fileId,
            alt: 'media'
        }, {
            responseType: 'stream'
        });

        if (response.data === undefined) {
            return { status: 404, body: { message: 'File not found.' } };
        }

        return { status: 200, body: { message: 'File found.', file: response.data, data: { fileId: fileId, contentType: response.headers['content-type'] } } };
    } catch (error) {
        console.log('Error getting avatar: ', error);
        return { status: 500, body: { message: error.message } };
    }
}

export async function getPicture(paramPicId) {
    try {
        const response = await googleDrive.files.get({
            fileId: paramPicId,
            alt: 'media'
        }, {
            responseType: 'stream'
        });

        if (response.data === undefined) {
            return { status: 404, body: { message: 'File not found.' } };
        }

        return { status: 200, body: { message: 'File found.', file: response.data, data: { fileId: fileId, contentType: response.headers['content-type'] } } };
    } catch (error) {
        console.log('Error getting picture: ', error);
        return { status: 500, body: { message: error.message } };
    }
}

export async function deletePicture(paramPicId) {
    return await googleDrive.files.delete({ fileId: paramPicId }).then(() => {
        console.log('Picture deleted successfully.');
        return { status: 200, body: { message: 'Picture deleted successfully.' } };
    }).catch((error) => {
        console.log('Error deleting picture: ', error);
        return { status: 500, body: { message: error.message } };
    });
}

export async function createResetPasswordLink(paramEmail) {
    try {
        const userRecord = await adminAuth.getUserByEmail(paramEmail);
        if (userRecord === undefined) {
            return { status: 404, body: { message: 'User not found.' } };
        }

        const link = await adminAuth.generatePasswordResetLink(paramEmail);
        if (link === undefined) {
            return { status: 500, body: { message: 'Error generating password reset link.' } };
        }

        return { status: 200, body: { message: 'Password reset link generated successfully.', data: link } };
    }
    catch (error) {
        console.log('Error generating password reset link: ', error);
        return { status: 500, body: { message: error.message } };
    }
}

export async function createEmailVertificationLink(paramEmail) {
    try {
        const userRecord = await adminAuth.getUserByEmail(paramEmail);
        if (userRecord === undefined) {
            return { status: 404, body: { message: 'User not found.' } };
        }

        const link = await adminAuth.generateEmailVerificationLink(paramEmail);
        if (link === undefined) {
            return { status: 500, body: { message: 'Error generating email vertification link.' } };
        }

        return { status: 200, body: { message: 'Email vertification link generated successfully.', data: link } };
    }
    catch (error) {
        console.log('Error generating email vertification link: ', error);
        return { status: 500, body: { message: error.message } };
    }
}

export async function getDocIdList(paramUserId) {
    try {
        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(paramUserId);
        const userSnapshot = await userRef.get();
        if (userSnapshot.data() === undefined) {
            return { status: 404, body: { message: 'User not found.' } };
        }
        
        const docIdList = userSnapshot.data().documents;

        var returnMessage;
        if (docIdList === undefined || docIdList.length === 0) {
            returnMessage = 'There are no documents found.';
        }
        else {
            returnMessage = 'Document ID list retrieved successfully.';
        }
        return { status: 200, body: { message: returnMessage, data: docIdList } };
    }
    catch (error) {
        console.log('Error getting docIdList: ', error);
        return { status: 500, body: { message: error.message } };
    }
}


export async function updateLoginCount(paramUserId, paramUserRole) {
    if (paramUserRole != 'customer' && paramUserRole != 'spso') {
        return { status: 400, body: { message: 'Invalid user role.' } };
    }

    try {
        if (paramUserRole === 'customer') {
            const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(paramUserId);

            const userSnapshot = await userRef.get();
            if (userSnapshot.data() === undefined) {
                return { status: 404, body: { message: 'Account not found.' } };
            }

            return await userRef.update({ loginCount: FieldValue.increment(1) })
                .then(() => {
                    return { status: 201, body: { message: "Update login count successfully." } };
                })
                .catch((error) => {
                    console.log('Error updating document:', error);
                    return { status: 500, body: { message: error.message } };
                });
        }
        else {
            const adminRef = firestore.collection(process.env.ADMINS_COLLECTION).doc(paramUserId);

            const adminSnapshot = await adminRef.get();
            if (adminSnapshot.data() === undefined) {
                return { status: 404, body: { message: 'Admin account not found.' } };
            }
            else {
                return await adminRef.update({ loginCount: FieldValue.increment(1) })
                    .then(() => {
                        return { status: 201, body: { message: "Update login count successfully." }};
                    })
                    .catch((error) => {
                        console.log('Error updating document:', error);
                        return { status: 500, body: { message: error.message } };
                    });
            }
        }
    }
    catch (error) {
        console.log('Error updating login count:', error);
        return { status: 500, body: { message: error.message } };
    }
}

export async function updateLastLogin(paramUserId) {
    try {
        const adminRef = firestore.collection(process.env.ADMINS_COLLECTION).doc(paramUserId);
        const adminSnapshot = await adminRef.get();
        if (adminSnapshot.data() === undefined) {
            return { status: 404, body: { message: 'Admin aacount not found.' } };
        }
        
        return await adminRef.update({ lastLogin: FieldValue.serverTimestamp() })
            .then(() => {
                return { status: 201, body: { message: "Update last login successfully." } };
            })
            .catch((error) => {
                console.log('Error updating document:', error);
                return { status: 500, body: { message: error.message } };
            })
    }
    catch (error) {
        console.log('Error updating last login:', error);
        return { status: 500, body: { message: error.message } };
    }
}

export async function getAllUserProfiles(paramUserType) {
    if (paramUserType !== 'spso' && paramUserType !== 'customer') {
        return { status: 400, body: { message: 'Invalid user type.' } };
    }

    try {
        if (paramUserType === 'customer') {
            const querySnapshot = await firestore.collection(process.env.USERS_COLLECTION).get();
            const userProfiles = querySnapshot.docs.map(doc => doc.data());
            
            return { status: 200, body: { message: 'All customer profiles retrieved successfully.', data: userProfiles } };
        }
        else {
            const querySnapshot = await firestore.collection(process.env.ADMINS_COLLECTION).where('highestAuthority', '==', false).get();
            const spsoProfiles = querySnapshot.docs.map(doc => doc.data());
            
            return { status: 200, body: { message: 'All spso profiles retrieved successfully.', data: spsoProfiles } };
        }
    }
    catch (error) {
        console.log('Error getting user profiles:', error);
        return { status: 500, body: { message: error.message } };
    }
}