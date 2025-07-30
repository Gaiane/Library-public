import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempDataService {
  private storageKey = 'tempData';
  private readonly stored = sessionStorage.getItem(this.storageKey);
  private readonly _data = signal<any>(this.stored ? JSON.parse(this.stored) : null);

  public readonly data = this._data.asReadonly();

  public set(data: any): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(data));
    this._data.set(data);
  }

  public clear(): void {
    sessionStorage.removeItem(this.storageKey);
    this._data.set(null);
  }
}
