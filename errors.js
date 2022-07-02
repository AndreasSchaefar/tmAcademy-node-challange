class FileExtensionValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "FileExtensionValidationError";
  }
}

export { FileExtensionValidationError };
