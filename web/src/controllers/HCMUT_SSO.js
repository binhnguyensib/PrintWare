import { clientAuth, googleProvider, credentialFromResult } from '../services/FirebaseClientSDK.js';
import { signInWithEmailAndPassword, signOut, reauthenticateWithCredential, confirmPasswordReset, EmailAuthProvider, updatePassword, sendPasswordResetEmail, signInWithPopup } from 'firebase/auth';

export async function loginWithEmailAndPassword(email, password) {
    const result = await signInWithEmailAndPassword(clientAuth,email, password)
        .then( async (userCredential) => {
            const user = userCredential.user;

            const customToken = await user.getIdToken();
            return { message: 'Login successfully', data: { user, customToken } };
        })
        .catch((error) => {
            throw error;
        });

    return result;
}

export async function logout() {
    return await signOut(clientAuth).then(() => {
            return { message: 'Logout successfully' };
        })
        .catch((error) => {
            throw error;
        });
}

export async function changePassword(email, oldPassword, newPassword) {
    const user = clientAuth.currentUser;
    
    const credential = EmailAuthProvider.credential(email, oldPassword);
    return reauthenticateWithCredential(user, credential)
        .then(async () => {
            return await updatePassword(clientAuth.currentUser, newPassword)
                .then(() => {
                    return { message: 'Password changed successfully' };
                })
                .catch((error) => {
                    throw error;
                });
        })
        .catch((error) => {
            throw error;
        });
}

export async function sendCustomPasswordResetEmail(email) {
    return await sendPasswordResetEmail(clientAuth, email)
        .then(() => {
            return { message: 'Password reset email sent successfully' };
        })
        .catch((error) => {
            throw error;
        });
}

export async function resetPassword(oodcode, newPassword) {
    return await confirmPasswordReset(clientAuth, oodcode, newPassword)
        .then(() => {
            return { message: 'Password reset successfully' };
        })
        .catch((error) => {
            throw error;
        });
}

export async function loginWithGoogleAccount() {
    return await signInWithPopup(clientAuth, googleProvider).then(async (result) => {
        const user = result.user;
        const customToken = await user.getIdToken();

        const credential = credentialFromResult(result);
        const googleAccessToken = credential.accessToken;

        return { message: 'Login successfully', data: { user, customToken, googleAccessToken } };
    }).catch((error) => {
        throw error;
    })
}