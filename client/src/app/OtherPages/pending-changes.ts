import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  // הודעת אזהרה בעת עזיבת קומפוננטות הזנת ערכי הקריטריונים ללא שמירה
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate() ?
      true :
      confirm('אזהרה! בעמוד זה ישנם שינויים שטרם שמרת. יציאה מהעמוד תבטל אותם. האם אתה בטוח שברצונך לצאת?');
  }
} ;