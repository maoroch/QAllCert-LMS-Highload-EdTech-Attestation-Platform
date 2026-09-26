export class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    getProfile = async (req, res, next) => {
        try {
            const profile = await this.userService.getProfile(req.user.id);
            res.json(profile);
        } catch (err) {
            next(err);
        }
    };

    updateProfile = async (req, res, next) => {
        try {
            const updated = await this.userService.updateProfile(req.user.id, req.body);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    };
}