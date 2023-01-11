import { Observable } from 'rxjs';

export interface IGrpcService {
  accumulate(arg0: { data: any }): unknown;
  findById(arg0: { id: string }): Observable<unknown>;
  findAllByUser(arg0: { id: string }): Observable<any>;
}
