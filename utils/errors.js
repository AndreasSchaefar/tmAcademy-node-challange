class FileExtensionValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileExtensionValidationError';
  }
}

class InvalidPathError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidPathError';
  }
}

export { FileExtensionValidationError, InvalidPathError };
