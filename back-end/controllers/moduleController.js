export class ModuleController {
    constructor(moduleService) {
        this.moduleService = moduleService;
    }

    create = async (req, res, next) => {
        try {
            const { title, isFinal, completionMessage } = req.body;
            const { courseId } = req.params;

            // Guard: title is required
            if (!title || !String(title).trim()) {
                return res.status(400).json({ message: 'Module title is required' });
            }

            const module = await this.moduleService.createModule(
                courseId,
                { title: String(title).trim(), isFinal: Boolean(isFinal), completionMessage: completionMessage || null },
                req.user.id,
                req.user.role
            );
            res.status(201).json(module);
        } catch (err) { next(err); }
    };

    getByCourse = async (req, res, next) => {
        try {
            const modules = await this.moduleService.getModulesByCourse(req.params.courseId);
            res.json(modules);
        } catch (err) { next(err); }
    };

    update = async (req, res, next) => {
        try {
            const { title, orderIndex, isFinal, completionMessage } = req.body;
            const module = await this.moduleService.updateModule(
                req.params.moduleId,
                { title, orderIndex, isFinal, completionMessage },
                req.user.id,
                req.user.role
            );
            res.json(module);
        } catch (err) { next(err); }
    };

    delete = async (req, res, next) => {
        try {
            await this.moduleService.deleteModule(req.params.moduleId, req.user.id, req.user.role);
            res.status(204).send();
        } catch (err) { next(err); }
    };
}