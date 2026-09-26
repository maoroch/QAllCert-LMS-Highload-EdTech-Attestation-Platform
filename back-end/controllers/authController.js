export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res, next) => {
        try {
            const { email, password, role, fullName, locale = 'ru' } = req.body;
            const result = await this.authService.register(email, password, role, fullName, locale);
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    };
    forgotPassword = async (req, res, next) => {
        try {
            const { email, locale = 'ru' } = req.body;
            await this.authService.forgotPassword(email, locale);
            res.json({ message: 'Reset link sent' });
        } catch (err) {
            next(err);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            const { token, password } = req.body;
            await this.authService.resetPassword(token, password);
            res.json({ message: 'Password reset successfully' });
        } catch (err) {
            next(err);
        }
    };
    verifyEmail = async (req, res, next) => {
        try {
            const { token } = req.body;
            await this.authService.verifyEmail(token);
            res.json({ message: 'Email verified successfully' });
        } catch (err) {
            next(err);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (err) {
            next(err);
        }
    };
    logout = async (req, res, next) => {
        try {
            const refreshToken = req.body.refreshToken;
            const accessToken = req.headers.authorization?.split(' ')[1];
            await this.authService.logout(refreshToken, accessToken);
            res.json({ message: 'Logged out' });
        } catch (err) {
            next(err);
        }
    };
    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.authService.refresh(refreshToken);
            res.json(tokens);
        } catch (err) {
            next(err);
        }
    };
    me = async (req, res, next) => {
        try {
            const user = await this.authService.userModel.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            next(err);
        }
    };
}