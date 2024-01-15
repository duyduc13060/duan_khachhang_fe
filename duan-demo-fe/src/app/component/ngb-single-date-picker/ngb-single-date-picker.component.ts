import {
  Component,
  ElementRef,
  EventEmitter, HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {
  COMPARE,
  INVALID,
  KEYCODE_0,
  KEYCODE_9,
  KEYCODE_BACKSPACE, KEYCODE_DOWN,
  KEYCODE_RIGHT_0, KEYCODE_RIGHT_9, KEYCODE_UP
} from '../.././helpers/constants';
import {formatDate} from '@angular/common';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-input';
import { CommonFunction } from 'src/app/utils/common-function';
import { ConfigDate } from '../share/date2/date2.component';

@Component({
  selector: 'kt-ngb-single-date-picker',
  templateUrl: './ngb-single-date-picker.component.html',
  styleUrls: ['./ngb-single-date-picker.component.scss']
})
export class NgbSingleDatePickerComponent implements OnInit, OnChanges {
  @Input() idInput;
  @Input() appendTo;
  @Input() disable;
  @Input() showMessageInput = true;
  @Input() isSchoolYear;
  @Input() disableCalendar;
  @ViewChild('dateText', {static: true}) dateText: ElementRef;
  @ViewChild('dp') dp: NgbDatepicker;
  positionY = window.innerHeight - this.elRef.nativeElement.getBoundingClientRect().y;
  _dateValue;
  get dateValue(): any {
    return this._dateValue;
  }

  @Input() set dateValue(data) {
    //
    if (typeof data !== 'object' && data !== undefined) {
      this._dateValue = CommonFunction.stringToObjectDate(data);
    } else {
      // if (data !== null) {
      //   this._dateValue = data;
      // }
      this._dateValue = data;
    }
  };

  @Input() messageIllegal;
  @Input() messageNull;
  @Input() config: ConfigDate;
  @Input() isReadOnly;
  @Input() maxDate;

  @Output() dateOutput: any = new EventEmitter<any>();
  @Output() customValidateEmit = new EventEmitter<boolean>()
  @Output() beforeSubmit = new EventEmitter<() => void>()
  @Output() blurEventEmit = new EventEmitter<{}>()
  @Output() emitOnKeyUp = new EventEmitter();
  @Output() emitEventInputRawData = new EventEmitter()
  hoveredDate: NgbDate | null = null;

  min = {year: 1, month: 1, day: 1};
  max = {year: 9999, month: 12, day: 31}

  constructor(private calendar: NgbCalendar,
              private elRef: ElementRef) {
    //this.getPosition();
  }

  // dateValue;
  showErrDate = false;
  messageErrDate;

  ngOnInit(): void {
    // this.dateOutput.emit(this.dateValue);
    const isInitial = true
    // this.beforeSubmit.emit(() => {this.checkDate(true,isInitial)})
    if (this.maxDate) {
      this.max = this.maxDate;
    }
    console.log('date in ngb:', this.positionY);
    //
  }

  emitEventInputAndGetRawValue(event) {
    console.log('INPUT EVENT');
    console.log(event.target.value);
    this.emitEventInputRawData.emit(event.target.value)
  }

  checkDate(isBlur: boolean, isInitial: boolean, datepicker?: NgbInputDatepicker) {
    if (!isInitial) {
      this.showErrDate = false;
      // console.log('_dateValue', this._dateValue);
      if (this._dateValue === null) {
        console.log('da vao day')
        this.showErrDate = true
        this.dateOutput.emit(null);
        return
      }
      if (INVALID.includes(this._dateValue)) {
        console.log('da vao day')
        this.showErrDate = true
        this.dateOutput.emit('error');
        return
      }
      if (typeof this._dateValue === 'object' || INVALID.includes(this._dateValue)) {
        console.log('da vao day')
        this.dateOutput.emit(this._dateValue);
        if (this.config && this.config.hasCustomValidate) {
          const result = this.validateDate()
          this.customValidateEmit.emit(result)
        }
        return;
      }
      // console.log('da vao day')
      this.showErrDate = true
      this.messageErrDate = this.messageIllegal;
      this.dateOutput.emit('error');
    }
  }

  blurEmit(event) {
    // console.log('Blur Event', event);
    this.blurEventEmit.emit(event);
  }

  isHovered(date: NgbDate) {
    return this._dateValue
      && this.hoveredDate;
  }

  validateDate(): boolean {
    this.showErrDate = false
    let result = false
    this.config.compare.every(c => {
      if (typeof c === 'object') {

        const dateValue = `${this._dateValue.year}-${('0' + this._dateValue.month).slice(-2)}-${('0' + this._dateValue.day).slice(-2)}`

        if (c.toCompare) {
          const compare = formatDate(c.toCompare, 'yyyy-MM-dd', 'en_US');
          if (
            (c.typeCompare === COMPARE.GREATER_EQUAL && dateValue < compare) ||
            (c.typeCompare === COMPARE.LESS_EQUAL && dateValue > compare) ||
            (c.typeCompare === COMPARE.LESS_THAN && dateValue >= compare)
          ) {
            this.showErrDate = true
            this.messageErrDate = c.messageError
            result = true
            return false
          }
        }

        if (c.fromDate && c.toDate) {
          if (dateValue < c.fromDate || dateValue > c.toDate) {
            this.showErrDate = true
            this.messageErrDate = c.messageError
            result = true
            return false
          }
        }
      }
      return true
    })
    return result
  }

  interceptKeyboard(event): void {
    // console.log(event);
    if (this.isReadOnly) {
      const keyCode = event.keyCode
      if (keyCode === KEYCODE_BACKSPACE || keyCode === 46) {
        this._dateValue = null;
        this.dateOutput.emit(this._dateValue);
        return
      }

      if (
        (keyCode >= KEYCODE_0 && keyCode <= KEYCODE_9) ||
        (keyCode >= KEYCODE_RIGHT_0 && keyCode <= KEYCODE_RIGHT_9) ||
        keyCode === KEYCODE_UP || keyCode === KEYCODE_DOWN) {
        event.preventDefault()
      }
    }
  }

  tooltip(): string {
    if (!this._dateValue) return
    const {day, month, year} = this._dateValue
    const d = ('0' + day).slice(-2)
    const m = ('0' + month).slice(-2)
    return `${d}/${m}/${year}`
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dateValueNgb) {
      this.dateOutput.emit(this._dateValue);
    }
  }

  selectToday(datepicker: NgbDatepicker) {
    this._dateValue = this.calendar.getToday();
    datepicker.navigateTo()
    this.dateOutput.emit(this._dateValue)
  }

  clear() {
    this._dateValue = null;
    this.dateOutput.emit(this._dateValue)
  }

  // Get All Element And remove property tabindex
  removeTabIndexAndToggle(d: NgbInputDatepicker) {
    // this.getPosition();
    // d.toggle();
    const listElement = Array.from(document.getElementsByClassName('ngb-dp-day'));
    listElement?.forEach((item) => {
      item.removeAttribute('tabindex')
    });
    // setTimeout(() =>{
    //   const overlayElement = document.getElementsByTagName('ngb-datepicker')[0];
    //   const parent = overlayElement.parentNode;
    //   const wrapper = document.createElement('div');
    //   wrapper.className='overlay';
    //   parent.replaceChild(wrapper, overlayElement);
    //   wrapper.appendChild(overlayElement);
    // },1000)
  }

  emitOnKeyUpFunc(event) {
    this.emitOnKeyUp.emit(event);
  }

  // getPosition() {
  //   this.positionY = window.innerHeight - this.elRef.nativeElement.getBoundingClientRect().y;
  // }

  mouseMove(event: MouseEvent) {
    this.positionY = window.innerHeight - event.y - 12;
  }
}
