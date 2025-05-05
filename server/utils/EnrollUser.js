export default class EnrollUser {
    static instance;
    constructor() {
        if (!EnrollUser.instance) {
            EnrollUser.instance = this;
            this.enrolledUsers = [];
        }
        return EnrollUser.instance;
    }

    static getInstance() {
        if (!EnrollUser.instance) {
            EnrollUser.instance = new EnrollUser();
        }
        return EnrollUser.instance;
    }

    AddEnrolledUser(userId, res) {
        this.enrolledUsers.push({ userId, res });
    }

    RemoveEnrolledUser(userId) {
        this.enrolledUsers = this.enrolledUsers.filter((user) => user.userId !== userId);
    }

    IsInEnrolledUsers(userId) {
        return this.enrolledUsers.some((user) => user.userId === userId);
    }

    GetEnrolledUser(userId) {
        return this.enrolledUsers.find((user) => user.userId === userId);
    }

    /**
     * Invoke a new event to a client with given user ID, event name and data.
     * If the client is not enrolled, return a 400 status code.
     * If the client is enrolled but the event can not be invoked, return a 401 status code.
     * If the event is invoked successfully, return a 200 status code.
     * @param {string} userId The user ID of the client.
     * @param {string} event The name of the event.
     * @param {any} data The data to be sent with the event.
     * @returns {Object} The result of invoking the event, with fields 'status' and 'body'.
     */
    InvokeNewEvent(userId, event, data) {
        console.log('InvokeNewEvent');

        if (!data || data.length === 0) {
            return { ok: false, message: 'Missing required parameters.' };
        }

        if (EnrollUser.getInstance().IsInEnrolledUsers(userId)) {
            const user = EnrollUser.getInstance().GetEnrolledUser(userId);
      
            if (user) {
                if (event) {
                    user.res.write(`event: ${event}\n`);
                }
                if (data) {
                    user.res.write(`data: ${JSON.stringify(data)}\n\n`);
                }

                return { ok: true, message: 'Invoked event successfully.' };
            }
            else {
                return { ok: false, message: 'Can not get enrolled user.' };
            }
        }
        else {
            return { ok: false, message: 'This user is not enrolled.' };
        }
    }
}

