import { ReqStatus } from 'src/shared/enums/enums';
import { UserHistoryType } from './user_history.enum';

export interface IUserHistory {
  historyType: UserHistoryType;
  amount: number;
  saved: number;
  transactionId?: string;
  historyStatus: ReqStatus;
  historyDate: Date;
}
