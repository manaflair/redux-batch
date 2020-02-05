declare module "@manaflair/redux-batch" {
  import { Action, AnyAction, StoreEnhancer } from "redux";

  export type BatchEnhancer<A extends Action = AnyAction> = StoreEnhancer<{
    dispatch: (actions: A[]) => A[];
  }>;

  export const reduxBatch: BatchEnhancer;
}
