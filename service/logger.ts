export interface Logger {
  info(message: string, args?: unknown): void;

  startProcessing(total: number): void;

  updateProcessing(actual: number): void;

  endProcessing(): void;
}

class ConsoleLogger implements Logger {
  private total = 0;

  info(message: string, args?: object): void {
    console.info(new Date().toLocaleString(), ":", message, args);
  }

  startProcessing(total: number): void {
    this.total = total;
    console.log(
      new Date().toLocaleString(),
      ":",
      `Processing total set to ${this.total}.`,
    );
  }

  updateProcessing(actual: number): void {
    console.log(
      new Date().toLocaleString(),
      ":",
      `Processing ${actual} out of ${this.total}.`,
    );
  }

  endProcessing(): void {
    // No action here.
  }
}

export const createConsoleLogger = () => new ConsoleLogger();

export const createNoOpLogger = () => ({
  info(message: string, args?: object): void {},
});
