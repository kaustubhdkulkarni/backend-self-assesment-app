// utils/nameMatching.js

/**
 * Normalize Arabic/Omani names by removing common prefixes/suffixes
 */
const normalizeArabicName = (text) => {
    if (!text) return '';
    
    let normalized = text
        .toLowerCase()
        .trim()
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ');

    const prefixesToRemove = [
        'al', 'al-', 'el', 'el-',
        'ibn', 'bin', 'ben', 'b.',
        'bint', 'binte', 'bt.', 'bte.',
        'abu', 'abou', 'abo',
        'umm', 'um', 'om',
        'abd', 'abdel', 'abdul', 'abdal', 'abdou',
        'sheikh', 'shaikh', 'sh.',
        'mr', 'mrs', 'miss', 'ms', 'dr', 'prof'
    ];

    const suffixesToRemove = ['al', 'el'];

    let tokens = normalized.split(' ').filter(t => t.length > 0);

    tokens = tokens.filter(token => {
        return !prefixesToRemove.some(prefix => 
            token === prefix || 
            token === prefix.replace('.', '') ||
            token === prefix.replace('-', '')
        );
    });

    tokens = tokens.filter(token => {
        return !suffixesToRemove.some(suffix => token === suffix);
    });

    return tokens.join(' ');
};

/**
 * Calculate Levenshtein distance between two strings
 */
const levenshteinDistance = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[len1][len2];
};

/**
 * Calculate similarity between two strings (0-1)
 */
const calculateSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1.0;
    
    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;
    return 1 - (distance / maxLength);
};

/**
 * Match user names with KYC full name using flexible Arabic-aware matching
 * @param {Object} params
 * @param {string} params.firstName - User's first name
 * @param {string} params.middleName - User's middle name (optional)
 * @param {string} params.lastName - User's last name
 * @param {string} params.kycFullName - Full name from KYC data
 * @param {number} params.similarityThreshold - Similarity threshold (default: 0.80)
 * @returns {Object} { isMatch: boolean, reason: string, matchedFields?: number }
 */
const matchNames = ({ firstName, middleName, lastName, kycFullName, similarityThreshold = 0.80 }) => {
    const normalizedKycName = normalizeArabicName(kycFullName);
    const normalizedFirstName = normalizeArabicName(firstName);
    const normalizedMiddleName = normalizeArabicName(middleName);
    const normalizedLastName = normalizeArabicName(lastName);

    const kycTokens = normalizedKycName.split(' ').filter(t => t.length > 0);
    
    const userNameParts = [];
    if (normalizedFirstName) {
        userNameParts.push({ 
            value: normalizedFirstName, 
            field: 'firstName',
            originalTokens: normalizedFirstName.split(' ').filter(t => t.length > 0)
        });
    }
    if (normalizedMiddleName) {
        userNameParts.push({ 
            value: normalizedMiddleName, 
            field: 'middleName',
            originalTokens: normalizedMiddleName.split(' ').filter(t => t.length > 0)
        });
    }
    if (normalizedLastName) {
        userNameParts.push({ 
            value: normalizedLastName, 
            field: 'lastName',
            originalTokens: normalizedLastName.split(' ').filter(t => t.length > 0)
        });
    }

    if (userNameParts.length === 0) {
        return { 
            isMatch: false, 
            reason: 'Please provide your name to continue with verification' 
        };
    }

    if (kycTokens.length === 0) {
        return {
            isMatch: false,
            reason: 'Unable to verify your identity. Please check your document and try again'
        };
    }

    let matchedCount = 0;
    let mismatchedField = null;

    for (const namePart of userNameParts) {
        const userTokens = namePart.originalTokens;
        
        const allTokensMatched = userTokens.every(userToken => {
            if (kycTokens.some(kycToken => kycToken === userToken)) {
                return true;
            }
            
            return kycTokens.some(kycToken => {
                const similarity = calculateSimilarity(userToken, kycToken);
                return similarity >= similarityThreshold;
            });
        });

        if (allTokensMatched) {
            matchedCount++;
        } else {
            mismatchedField = namePart.field;
        }
    }

    if (matchedCount === userNameParts.length) {
        return { 
            isMatch: true, 
            matchedFields: userNameParts.length,
            reason: 'Name verification successful' 
        };
    }

    // User-friendly field name mapping
    const fieldNameMap = {
        'firstName': 'first name',
        'middleName': 'middle name',
        'lastName': 'last name'
    };

    const friendlyFieldName = fieldNameMap[mismatchedField] || 'name';

    return { 
        isMatch: false, 
        reason: `Your ${friendlyFieldName} does not match with your Civil/Residence ID.` 
    };
};

module.exports = matchNames;
