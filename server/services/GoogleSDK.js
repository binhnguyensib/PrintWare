
import { google } from 'googleapis';
import pgk from 'jsonfile';
const { readFileSync } = pgk;
const GOOGLE_API_KEY = readFileSync('./services/google-api-key.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];

async function googleAuthorize(){
    const jwtClient = new google.auth.JWT(
        GOOGLE_API_KEY.client_email,
        null,
        GOOGLE_API_KEY.private_key,
        SCOPE
    );
    await jwtClient.authorize();

    return jwtClient;
}

const jwtAuth = await googleAuthorize().then((jwtClient) => jwtClient);

const googleDrive = google.drive({ version: 'v3', auth: jwtAuth });

export { googleDrive };