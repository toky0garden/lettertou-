export interface BaseResponse {
  /**
   * Error reason
   * @nullable
   */
  reason?: string | null;
  /** Request status */
  success: boolean;
}
