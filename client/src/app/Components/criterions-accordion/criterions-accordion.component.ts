import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { CriterionsofAreas } from 'src/app/Classes/CriterionsofAreas';
import { TypesEnum, RequestService } from 'src/app/Services/request.service';

@Component({
  selector: 'app-criterions-accordion',
  templateUrl: './criterions-accordion.component.html',
  styleUrls: ['./criterions-accordion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CriterionsAccordionComponent implements OnInit, AfterViewInit {
  constructor(public RequestServ: RequestService, public cdRef: ChangeDetectorRef) { }
d(i,event)
{
  debugger;
  i.LevelofImportance =event
}
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  @Input() list = new Array<CriterionsofAreas>();
  //מראה מתי להציג את רמות העדיפות ומתי לא - תלוי אם זה אב בלוק או לא
  @Input() ShowLevel = false;
  @Output() invalid: EventEmitter<any> = new EventEmitter<any>();
  @Output() valid: EventEmitter<any> = new EventEmitter<any>();
  //שליחת ערך בחור של select ע"מ להוסיף/ לעדכן את ערך קריטריון האב בערך שנבחר
  @Output() ListValue: EventEmitter<number> = new EventEmitter<number>();
  @Output() ResetListValue: EventEmitter<number> = new EventEmitter<number>();
  EnumTypes = TypesEnum;
  PartOfAListTree = new Array<CriterionsofAreas>();
  RegularTree = new Array<CriterionsofAreas>();
  changeCheckBox(event,i:CriterionsofAreas)
  {
if(i.ValueofCriterion==null||!i.ValueofCriterion)
   i.ValueofCriterion=true;
else
  i.ValueofCriterion=false;
  }
  requiredtag(i: CriterionsofAreas, ele = null) {
    if (ele != null) {
      let crit: CriterionsofAreas;
      if ((i.FeildValidation == null || i.FeildValidation == undefined))
        crit = null;
      else
        crit = ((i.FeildValidation.indexOf('required') > -1 && i.ValueofCriterion == null) ||
          (i.FeildValidation.indexOf('dynamically') > -1 && (i.ValueofCriterion == "true"))) ? i : null;
          if (crit != null) {
        let parent = ele._body.nativeElement.parentNode;
        while (parent != null && parent.tagName != undefined) {

          if (parent.tagName.toLocaleLowerCase() == 'mat-expansion-panel') {
            parent.setAttribute('nottoclose', 'true');
          }
          parent = parent.parentNode;
        }
        this.invalid.emit(i);
        if (i.TypeEnum != this.EnumTypes.List)
        {
          ele.close();
        }

      }
    }
    return i.required;
  }
  //רמת עדיפות
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000);
    }
    return value;
  }
  ngOnInit() {
    this.list.forEach(El => {
      if (El.TypeEnum == this.EnumTypes.PartOfaList) {
        this.PartOfAListTree.push(El);
      }
      else {
        this.RegularTree.push(El);
      }
    }
    )
  }
  InputValidations(i: CriterionsofAreas, ele) {
    if (i.FeildValidation != null && i.FeildValidation != '') {
      try {
        i.FeildValidation = i.FeildValidation.split("'").join('"');
        JSON.parse(i.FeildValidation, (key, value) => {
          if (key != '')
            try { ele.srcElement.setAttribute(key, value); }
            catch{ console.log('not fitting validation attribute'); }
        });
      }
      catch{
        console.log(i.Name + ' FeildValidation is not a json object');
      }
      if (i.FeildValidation != null && i.FeildValidation.indexOf('multiple') > -1)
        i.multipleselect = true;
      else
        i.multipleselect = false;
    }
    //המרת מחרוזת לאיבר ג'ייסון
  }
  headerclicked(event)
  {
   
  }
  ShowValidationMessage(ele, i: CriterionsofAreas, exp) {
    if (ele.srcElement.validity.patternMismatch == true)
      i.invalid_message = i.PatternErrorMessage;
    else
      i.invalid_message = ele.srcElement.validationMessage;
    if (ele.srcElement.validationMessage != "") {
      let parent = ele.srcElement.parentNode;
      while (parent != null && parent.tagName != undefined) {
        if (parent.tagName.toLocaleLowerCase() == 'mat-expansion-panel') {
          parent.setAttribute('nottoclose', 'true');
        }
        parent = parent.parentNode;
      }
      if (i.FeildValidation == null || i.FeildValidation == undefined || i.FeildValidation.indexOf('dynamically') == -1)
      {
             this.invalid.emit(i);
      }
      this.removeChildrenValues(i);
      if (i.TypeEnum != this.EnumTypes.List) {
        exp.close();
      }
    }
    else {
      let parent = ele.srcElement.parentNode;
      while (parent != null && parent.tagName != undefined) {
        if (parent.tagName.toLocaleLowerCase() == 'mat-expansion-panel') {
          parent.setAttribute('nottoclose', 'false');
        }
        parent = parent.parentNode;
      }
      if (i.FeildValidation == null || i.FeildValidation == undefined || i.FeildValidation.indexOf('dynamically') == -1)
        this.valid.emit(i)
      exp.open();
    }
  }
  InValid(i: CriterionsofAreas) {
    this.invalid.emit(i);
  }
  Valid(i: CriterionsofAreas) {
    this.valid.emit(i);
  }
  @ViewChild(ElementRef, { static: false }) df: ElementRef;
  @ViewChild('checkboxElement', { static: false }) private checkboxElement;
  removeSingleList(i: CriterionsofAreas, ele) {
    // כאן יש למחוק את הבחירה של האחים שהם בני רשימה
    if (i.FeildValidation != null && i.FeildValidation != undefined && i.FeildValidation.indexOf('multiple') > -1)
      return;
    let e = ele.parentElement.parentElement.parentElement.parentElement.parentElement.children;
    for (let x = 0; x < e.length; x++) {
      let y = e[x].children[0].children[0].children[0].children[0];
      if (y != ele)
        y.checked = false;
    }

  }
  CheckVariableValue(ele, i: CriterionsofAreas) {
    if (ele.checked || i.ValueofCriterion != null && i.ValueofCriterion.indexOf('true') > -1)
      i.Check = true;
    return i.Check;
  }
  checkedCheckBox(i, ele, exp) {
    if (ele.checked) {
      i.Check = true;
      i.ValueofCriterion = "true";
      if (i.FeildValidation != null && i.FeildValidation.indexOf('dynamically') > -1) {
      {
        this.invalid.emit(i);
      }
        this.removeChildrenValues(i);
        if (i.TypeEnum != this.EnumTypes.List) {
          exp.close();
        }
      }
      if (ele.checked == true) {
        this.removeSingleList(i, ele);
      }
    }
    else {
      i.Check = false;
      i.ValueofCriterion = "false";
      if (i.FeildValidation != null && i.FeildValidation.indexOf('dynamically') > -1)
        this.valid.emit(i);
      this.removeChildrenValues(i);
      if (i.TypeEnum != this.EnumTypes.List) {
        exp.close();
      }
    }

  }
  open(i: CriterionsofAreas, ele, checkboxElement = null) {
    if (i.FeildValidation != null && i.FeildValidation.indexOf('dynamically') != -1) {
      if (((i.ValueofCriterion == null || i.ValueofCriterion == "true" || i.ValueofCriterion == "false"))
        || (i.CriterionsofAreasTree.length == 0))
        try {
          ele.close();
        }
        catch{ }
      return;
    }
    if (checkboxElement != null && checkboxElement.checked) {
      if (i.CriterionsofAreasTree.length > 0) {
        try {
          ele.open();
        }
        catch{ }
        return;
      }
    }
    else if (checkboxElement != null) {
      try {
        ele.close();
      }
      catch{ }
      return;
    }
          if (i.CriterionsofAreasTree.length == 0) {
            ele.close()
          }
    else {
      try {
        ele.open();
      }
      catch{ }
    }
  }
  close(i: CriterionsofAreas, ele, checkboxElement = null) {
    if((event.srcElement as HTMLElement).nodeName=="INPUT")
    {
      try {     
        ele.close();
      }
      catch{ }
      return
    }
    if (checkboxElement != null && checkboxElement.checked == false) {
      try {     
        ele.close();
      }
      catch{ }
      return
    }
    if (i.CriterionsofAreasTree.length == 0) {
      try {
        ele.close();
      }
      catch{ }
      return;
    }
    if (ele._body.nativeElement.parentNode.getAttribute("nottoclose") == "true") {
      try {
        ele.open();
      }
      catch{ }
      return;
    }

  }
  removeChildrenValues(criterion: CriterionsofAreas) {
    for (let i = 0; i < criterion.CriterionsofAreasTree.length; i++) {
      criterion.CriterionsofAreasTree[i].ValueofCriterion = null;
      this.removeChildrenValues(criterion.CriterionsofAreasTree[i]);
    }
  }
  sendValueToFather(ele, i: CriterionsofAreas, CriterionofAreaCode: any, exp1, checkbox = null) {
    if (i.FeildValidation != null && i.FeildValidation != undefined && i.FeildValidation.indexOf('dynamically') > -1 && checkbox != null) {
      if (checkbox.checked)
        return;
    }
    if (i.FeildValidation != null && i.FeildValidation != undefined && i.FeildValidation.indexOf('dynamically') != -1) {
      console.log('document.activeElement', document.activeElement);
      if (ele.validationMessage != "" && i.ValueofCriterion != null && i.ValueofCriterion.indexOf('true') > -1) {
        let parent = exp1._body.nativeElement.parentNode;
        while (parent != null && parent.tagName != undefined) {
          if (parent.tagName.toLocaleLowerCase() == 'mat-expansion-panel') {
            parent.setAttribute('nottoclose', 'true');
          }
          parent = parent.parentNode;
        }
        this.invalid.emit(i)
        this.removeChildrenValues(i);
        if (i.TypeEnum != this.EnumTypes.List)
        {
          exp1.close();
        }
      }
      else {
        if (i.ValueofCriterion != null && i.ValueofCriterion.indexOf('true') > -1) {
          // ele.target.blur();
          if (i.ValueofCriterion == undefined) i.ValueofCriterion = "";
          i.ValueofCriterion += "," + ele.value
          this.ListValue.emit(ele.value);
          let parent = exp1._body.nativeElement.parentNode;
          while (parent != null && parent.tagName != undefined) {
            if (parent.tagName.toLocaleLowerCase() == 'mat-expansion-panel') {
              parent.setAttribute('nottoclose', 'false');
            }
            parent = parent.parentNode;
          }
          this.valid.emit(i)
          parent = exp1._body.nativeElement.parentNode;
          if (parent != null && parent.tagName != undefined && parent.tagName.toLocaleLowerCase() == 'mat-expansion-panel') {
            this.open(i, parent)
          }
        }
        else {
          this.ResetListValue.emit(ele.value)
        }
      }
    }
    else {
      if (checkbox != null && checkbox.checked)
        this.ListValue.emit(CriterionofAreaCode);
      else {
        this.ResetListValue.emit(CriterionofAreaCode)
      }
    }
  }
  getOtherValue(i: CriterionsofAreas) {
    if (i.ValueofCriterion != null)
      return i.ValueofCriterion.replace('true', '').replace('false', '').split(',').join('');
    return '';
  }
  confirmOtherOption(i, exp1) {
    let x;
    if (i.Name == "אחר")
      x = (event as any).srcElement.parentElement.parentElement.children[1]
    else
      x = (event as any).srcElement.parentElement.children[1]
    this.sendValueToFather(x, i, x.value, exp1)
  }
  //פונקציה לשמירת ערכ/ים נבחר/ים לקריטריון מסוג רשימה
  setFatherValue(i: CriterionsofAreas, CriterionofAreaCode: any, exp) {
    if (i.FeildValidation != null && i.FeildValidation.indexOf('multiple') > -1) {
      if (i.ValueofCriterion == undefined) i.ValueofCriterion = "";
      i.ValueofCriterion += "," + CriterionofAreaCode;
    }
    else
      i.ValueofCriterion = CriterionofAreaCode;
    console.log('event!!!!1', event)
    let ele = event as any
    let parent = ele.srcElement.parentNode;
    while (parent != null && parent.tagName != undefined) {
      if (parent.tagName.toLocaleLowerCase() == 'mat-expansion-panel') {
        parent.setAttribute('nottoclose', 'false');
      }
      parent = parent.parentNode;
    }
    this.valid.emit(i);
    let r = null;
    for (let x = 0; x < this.list.length; x++) {
      let y = 0;
      for (y = 0; y < this.list[x].CriterionsofAreasTree.length; y++) {
        if (this.list[x].CriterionsofAreasTree[y].CriterionofAreaCode == CriterionofAreaCode) {
          r = this.list[x].CriterionsofAreasTree[y];
          break;
        }
      }
      if (y < this.list[x].CriterionsofAreasTree.length)
        break;
    }
    if (r != null) {
      if (r.CriterionsofAreasTree.length > 0) {
        if (r.CriterionsofAreasTree.find(x => x.FeildValidation != null && x.FeildValidation.indexOf('required') > -1 && x.ValueofCriterion == null) != null) {
          console.log('exp', ele.srcElement.parentNode.parentNode.parentNode.parentNode);
          parent = ele.srcElement.parentNode.parentNode.parentNode.parentNode;
          while (parent != null && parent.tagName != undefined) {
            if (parent.tagName.toLocaleLowerCase() == 'mat-expansion-panel') {
              parent.setAttribute('nottoclose', 'true');
            }
            parent = parent.parentNode;
          }
        }
        this.open(r, exp);
      }
    }
  }
  resetFatherValue(i: CriterionsofAreas, CriterionofAreaCode: number, exp) {
    if (i.FeildValidation != null && i.FeildValidation.indexOf('multiple') > -1) {
      if (i.ValueofCriterion != null)
        i.ValueofCriterion = i.ValueofCriterion.replace(i.ValueofCriterion.substring(i.ValueofCriterion.indexOf(CriterionofAreaCode) - 1, CriterionofAreaCode.toString().length + 1), "")
    }
    else {
      i.ValueofCriterion = null;
    }
    if (i.ValueofCriterion == null || i.ValueofCriterion == "" && i.FeildValidation != null &&
      i.FeildValidation != undefined &&
      i.FeildValidation.indexOf('required') > -1) {
      console.log('event!!!!!2', event)
      var eve1 = event as any
      let parent = eve1.srcElement.parentNode;
      while (parent != null && parent.tagName != undefined) {
        if (parent.tagName.toLocaleLowerCase() == 'mat-expansion-panel') {
          parent.setAttribute('nottoclose', 'true');
        }
        parent = parent.parentNode;
      }
      this.invalid.emit(i);
      this.removeChildrenValues(i);
      if (i.TypeEnum != this.EnumTypes.List) {
        exp.close();
      }
    }
  }
}
