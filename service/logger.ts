export interface Logger {
  info(message: string, args?: unknown): void;
}

class ConsoleLogger implements Logger {
  info(message: string, args?: object): void {
    console.info(new Date().toLocaleString(), ":", message, args);
  }
}

export const createConsoleLogger = () => new ConsoleLogger();

export const createNoOpLogger = () => ({
  info(message: string, args?: object): void {},
});
