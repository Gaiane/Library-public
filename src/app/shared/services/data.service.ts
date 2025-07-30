import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {

    private dataSource = new BehaviorSubject<any>(null);
    public data$ = this.dataSource.asObservable();

    public sendData(data: any) {
        this.dataSource.next(data);
    }
}