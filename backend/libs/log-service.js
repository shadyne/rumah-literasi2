const { Log } = require('../models');

class LogService {
	static async createLog(
		action,
		userId = null,
		resourceType = null,
		resourceId = null,
		message = null,
		metadata = null,
		req = null
	) {
		try {
			await Log.create({
				action,
				user_id: userId,
				resource_type: resourceType,
				resource_id: resourceId,
				message,
				metadata,
				ip_address: req.ip || null,
				user_agent: req.get('User-Agent') || null,
			});
		} catch (error) {
			console.error('Failed to create log entry:', error);
		}
	}
}

module.exports = LogService;
