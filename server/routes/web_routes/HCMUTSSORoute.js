import { response, Router } from 'express';
const router = Router();
import {
    adminRegister,
    register,
    deleteAccount,
    updateProfile,
    getUserProfileById,
    getUserProfileByEmail,
    getUserIdByEmail,
    uploadPicture,
    getPictureByUserId,
    getPicture,
    deletePicture,
    createResetPasswordLink,
    createEmailVertificationLink,
    getDocIdList,
    updateLoginCount,
    updateLastLogin,
    getAllUserProfiles
} from '../../controllers/web_controllers/HCMUT_SSO.js';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload_file = multer({ dest: 'file-uploads' });

// Input:
    // form-data: email, password, userName
// Output: user information as JSON
router.post('/admin-register', upload.single(''), async (req, res) => {
    console.log('Received a admin register request!');

    const body = req.body;
    console.log('body: ', body);
    if (!body || !body.email || !body.password || !body.userName) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await adminRegister(body);

    res.status(result.status).json(result.body);
})

// Input:
    // form-data: email, password, name
// Output: user information as JSON
router.post('/register', upload.single(''), async (req, res) => {
    console.log('Received a register request!');

    const body = req.body;
    console.log('body: ', body);
    if (!body || !body.email || !body.password || !body.userName) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await register(body);

    res.status(result.status).json(result.body);
})

// Input:
    // query: userId
router.delete('/delete-account', async (req, res) => {
    console.log('Received a delete account request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.userId || !query.userRole) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await deleteAccount(query.userId, query.userRole);

    res.status(result.status).json(result.body);
})

// Input:
    // form-data: updateInfo
    // query: userId
router.patch('/update-profile', upload.single(''), async (req, res) => {
    console.log('Received a update profile request!');

    const body = req.body;
    const query = req.query;
    console.log('body: ', body, 'query: ', query);
    if (!body || Object.keys(body).length === 0 || !query || !query.userId || !query.userRole) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await updateProfile(query.userId, query.userRole, body);

    res.status(result.status).json(result.body);
})

// Input:
    // query: userId
// Output: user information as JSON
router.get('/get-user-profile-by-id', async (req, res) => {
    console.log('Received a get user profile by id request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.userId) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await getUserProfileById(query.userId);

    res.status(result.status).json(result.body);
})

// Input:
    // query: email
// Output: user information as JSON
router.get('/get-user-profile-by-email', async (req, res) => {
    console.log('Received a get user profile by email request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.email) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await getUserProfileByEmail(query.email);

    res.status(result.status).json(result.body);
})

// Input:
    // query: email
// Output: userId
router.get('/get-user-id-by-email', async (req, res) => {
    console.log('Received a get user id by email request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.email) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await getUserIdByEmail(query.email);

    res.status(result.status).json(result.body);
})

// Input:
    // form-data {fileBlob: file avatar}
    // query: userId
    // query: type (avatar or coverPhoto)
// Output: fileId
router.post('/upload-picture', upload.single('file'), async (req, res) => {
    console.log('Received a update picture request!');

    const file = req.file;
    const query = req.query;
    console.log('file: ', file, 'query: ', query);
    if (!file || !query || !query.userId || !query.type) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await uploadPicture(file, query.userId, query.type);

    res.status(result.status).json(result.body);
})

// Input:
    // query: userId
    // query: type (avatar or coverPhoto)
// Output: file as a blod object
router.get('/get-picture-by-user-id', async (req, res) => {
    console.log('Received a get picture by userId request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.userId || !query.type) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await getPictureByUserId(query.userId, query.type);

    if (result.status !== 200) {
        res.status(result.status).json(result.body);
        return;
    }
    
    res.set({
        'Content-Type': result.body.data.contentType,
        'Content-Disposition': `attachment; filename="${result.body.data.fileId}"`
    });

    result.body.file
        .on('end', () => {
            console.log('File downloaded successfully.');
        })
        .on('error', (error) => {
            console.log('Error pipe: ', error);
            res.status(500).json({ message: error.message });
        })
        .pipe(res);
})

router.get('/get-picture', async (req, res) => {
    console.log('Received a get picture request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.pictureId) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await getPicture(query.pictureId);

    if (result.status !== 200) {
        res.status(result.status).json(result.body);
        return;
    }
    
    res.set({
        'Content-Type': result.body.data.contentType,
        'Content-Disposition': `attachment; filename="${result.body.data.fileId}"`
    });

    result.body.file
        .on('end', () => {
            console.log('File downloaded successfully.');
        })
        .on('error', (error) => {
            console.log('Error pipe: ', error);
            res.status(500).json({ message: error.message });
        })
        .pipe(res);
})

router.delete('/delete-picture', async (req, res) => {
    console.log('Received a delete picture request!');

    const query = req.query;
    if (!query || !query.pictureId) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await deletePicture(query.pictureId);

    res.status(result.status).json(result.body);
})


// Input:
    // query: email
// Output: reset password link
router.get('/get-reset-password-link', async (req, res) => {
    console.log('Received a get reset password link request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.email) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await createResetPasswordLink(query.email);

    res.status(result.status).json(result.body);
})

// Input:
    // query: email
// Output: email verification link
router.get('/get-email-verification-link', async (req, res) => {
    console.log('Received a get email verification link request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.email) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await createEmailVertificationLink(query.email);

    res.status(result.status).json(result.body);
})


// Input:
    // query: userId
// Output: docIdList
router.get('/get-doc-id-list', async (req, res) => {
    console.log('Received a get doc id list request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.userId) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await getDocIdList(query.userId);

    res.status(result.status).json(result.body);
})


router.patch('/login-count', async (req, res) => {
    console.log('Received a login count request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.userId || !query.userRole) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await updateLoginCount(query.userId, query.userRole);

    res.status(result.status).json(result.body);
})

router.patch('/last-login', async (req, res) => {
    console.log('Received a last login request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.userId) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await updateLastLogin(query.userId);

    res.status(result.status).json(result.body);
})

router.get('/get-all-user-profiles', async (req, res) => {
    console.log('Received a get all user profiles request!');

    const query = req.query;
    console.log('query: ', query);
    if (!query || !query.userType) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const result = await getAllUserProfiles(query.userType);

    res.status(result.status).json(result.body);
})

export default router;