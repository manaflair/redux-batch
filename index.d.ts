declare module "@manaflair/redux-batch" {
  import { AnyAction, StoreEnhancer } from "redux";

  export const reduxBatch: StoreEnhancer<{
    dispatch: (actions: AnyAction[]) => AnyAction[],
  }>;
}
