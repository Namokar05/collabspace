export const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};

export const calculateDateDiff = (date1, date2) => {
    const diff = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const paginate = (array, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return {
        data: array.slice(offset, offset + limit),
        page,
        limit,
        total: array.length,
        totalPages: Math.ceil(array.length / limit)
    };
};

export const sanitizeUser = (user) => {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, __v, ...sanitized } = userObj;
    return sanitized;
};