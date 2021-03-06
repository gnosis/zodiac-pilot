import { TransactionInput } from 'react-multisend'

import { Action } from './actions'

export interface TransactionState {
  input: TransactionInput
  transactionHash: string
}

const rootReducer = (
  state: TransactionState[],
  action: Action
): TransactionState[] => {
  switch (action.type) {
    case 'APPEND_CAPTURED_TX': {
      const { transactionHash, input } = action.payload
      return [
        ...state,
        {
          input,
          transactionHash,
        },
      ]
    }
  }
}

export default rootReducer
