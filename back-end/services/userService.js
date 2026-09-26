export class UserService {
    constructor(studentProfileModel, teacherProfileModel) {
        this.studentProfileModel = studentProfileModel;
        this.teacherProfileModel = teacherProfileModel;
    }

    async getProfile(userId) {
        // We try to fetch from student profiles first, then teacher
        let profile = await this.studentProfileModel.findByUserId(userId);
        if (profile) return { ...profile, role: 'student' };

        profile = await this.teacherProfileModel.findByUserId(userId);
        if (profile) return { ...profile, role: 'teacher' };

        throw new Error('Profile not found');
    }

    async updateProfile(userId, updates) {
        // Map snake_case fields from frontend/API to camelCase expected by the models
        const mappedUpdates = {
            fullName:    updates.full_name,
            bio:         updates.bio,
            avatarUrl:   updates.avatar_url,
            metadata:    updates.metadata,
            phoneNumber: updates.phone_number,
        };

        let profile = await this.studentProfileModel.findByUserId(userId);
        if (profile) {
            return await this.studentProfileModel.update(userId, mappedUpdates);
        }

        profile = await this.teacherProfileModel.findByUserId(userId);
        if (profile) {
            return await this.teacherProfileModel.update(userId, mappedUpdates);
        }

        throw new Error('Profile not found');
    }
}
