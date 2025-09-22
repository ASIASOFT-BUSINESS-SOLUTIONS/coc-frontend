export const rules = {
    required: (value) => !!value || "Field is required",
    confirmPassword: (password) => (value) => value === password || "Passwords do not match",
    maxLength: (number) => (value) => !value || value.length <= number || `Field must be ${number} characters or fewer`,
};
