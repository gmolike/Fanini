// apps/api/src/infrastructure/database/TransactionManager.ts
export type TransactionManager = {
  runInTransaction: <T>(callback: () => Promise<T>) => Promise<T>;
};

export const createTransactionManager = (db: any): TransactionManager => ({
  runInTransaction: async <T>(callback: () => Promise<T>): Promise<T> => {
    const connection = await db.getConnection();

    try {
      await connection.query("START TRANSACTION");
      const result = await callback();
      await connection.query("COMMIT");
      return result;
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      connection.release();
    }
  },
});
