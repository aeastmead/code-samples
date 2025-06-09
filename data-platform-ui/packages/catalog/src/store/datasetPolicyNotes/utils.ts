export default abstract class DatasetPolicyNoteStoreUtils {
  /**
   * Creates unique id to be used with batch fetch
   * @param {number} datasetId
   * @return {string}
   */
  public static datasetIdBatchStatusKey(datasetId: number): string {
    return `datasetId:${datasetId}`;
  }
}
